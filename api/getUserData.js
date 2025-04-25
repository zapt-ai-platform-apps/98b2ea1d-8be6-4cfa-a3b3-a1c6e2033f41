import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { authenticateUser, getUserRole } from './_apiUtils.js';
import { users, orgs } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import Sentry from './_sentry.js';

// Helper function to safely create a new user
async function createNewUser(db, userId, email) {
  console.log('Creating new user record for:', userId, email);
  
  // Find or create the demo organization
  let demoOrg;
  try {
    console.log('Looking for demo organization...');
    const demoOrgRecords = await db.select().from(orgs).where(eq(orgs.name, 'Hopwood Hall College'));
    console.log('Demo org query returned:', demoOrgRecords?.length || 0, 'results');
    
    if (!demoOrgRecords || demoOrgRecords.length === 0) {
      console.log('Demo organization not found, creating...');
      // Try to create it
      const insertResult = await db.insert(orgs).values({
        name: 'Hopwood Hall College',
        plan: 'pro'
      }).returning();
      
      console.log('Org insert result:', insertResult);
      
      if (!insertResult || insertResult.length === 0) {
        throw new Error('Failed to create demo organization');
      }
      
      demoOrg = insertResult[0];
      console.log('Created demo organization:', demoOrg);
    } else {
      demoOrg = demoOrgRecords[0];
      console.log('Found existing demo organization:', demoOrg);
    }
  } catch (orgError) {
    console.error('Error finding/creating organization:', orgError);
    Sentry.captureException(orgError);
    throw new Error('Failed to find or create organization: ' + orgError.message);
  }
  
  // Create the user record
  const userName = email.split('@')[0];
  const newUser = {
    id: userId,
    orgId: demoOrg.id,
    role: 'apprentice',
    email: email,
    name: userName
  };
  
  console.log('Inserting new user record:', newUser);
  
  try {
    const insertResult = await db.insert(users).values(newUser).returning();
    console.log('User insert result:', insertResult);
    console.log('User record created successfully');
    
    // Fetch and return the new user record
    const userRecord = await getUserRole(userId, db);
    console.log('Retrieved new user record:', userRecord);
    return userRecord;
  } catch (userError) {
    console.error('Error creating user record:', userError);
    Sentry.captureException(userError);
    throw new Error('Failed to create user record: ' + userError.message);
  }
}

export default async function handler(req, res) {
  console.log('getUserData API called');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = postgres(process.env.COCKROACH_DB_URL);
  const db = drizzle(client);

  try {
    // Log that we're authenticating the user
    console.log('Authenticating user...');
    const user = await authenticateUser(req);
    
    // Log the authenticated user's ID
    console.log('User authenticated:', user.id, 'Type:', typeof user.id);
    
    // Check if user.id is valid
    if (!user.id) {
      throw new Error('User ID is missing from authentication response');
    }
    
    try {
      // Get the user's role and organization from the database
      console.log('Fetching user role for:', user.id);
      const userRecord = await getUserRole(user.id, db);
      
      // Return the user data with the role and organization
      console.log('User found in database, returning data');
      return res.status(200).json({
        id: user.id,
        email: user.email,
        ...userRecord,
        isNewUser: false
      });
    } catch (error) {
      // If the error is that the user is not found, create a new user
      if (error.message === 'User not found in database') {
        console.log('User not found in database, creating new user record');
        
        try {
          const newUserRecord = await createNewUser(db, user.id, user.email);
          
          console.log('New user created successfully, returning data');
          return res.status(200).json({
            id: user.id,
            email: user.email,
            ...newUserRecord,
            isNewUser: true
          });
        } catch (createError) {
          console.error('Error creating new user:', createError);
          Sentry.captureException(createError);
          
          // Since we couldn't create a user record, return a temporary user object
          // This way the app won't crash, but we'll know there's an issue to fix
          return res.status(200).json({
            id: user.id,
            email: user.email,
            role: 'apprentice',
            name: user.email.split('@')[0],
            orgId: null,
            isTemporary: true,
            isNewUser: true,
            error: createError.message
          });
        }
      } else {
        // If it's another error, rethrow it
        throw error;
      }
    }
  } catch (error) {
    console.error('Error in getUserData:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  } finally {
    await client.end();
  }
}