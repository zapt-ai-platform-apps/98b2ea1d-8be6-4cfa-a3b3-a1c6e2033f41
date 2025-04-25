import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { authenticateUser, getUserRole } from './_apiUtils.js';
import { users } from '../drizzle/schema.js';
import { orgs } from '../drizzle/schema.js'; // Fixed: separate import to ensure it's properly loaded
import { eq } from 'drizzle-orm';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log('getUserData API called');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = postgres(process.env.COCKROACH_DB_URL);
  const db = drizzle(client);

  try {
    const user = await authenticateUser(req);
    console.log('User authenticated:', user.id);

    try {
      // Get the user's role and organization from the database
      const userRecord = await getUserRole(user.id, db);
      
      // Return the user data with the role and organization
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
          // Debug logs to verify orgs is properly imported
          console.log('Looking for demo organization...');
          
          // Find the demo organization
          const demoOrgRecords = await db.select().from(orgs).where(eq(orgs.name, 'Hopwood Hall College'));
          console.log('Demo org query executed, records found:', demoOrgRecords?.length);
          
          if (!demoOrgRecords || demoOrgRecords.length === 0) {
            console.error('Demo organization not found');
            throw new Error('Demo organization not found');
          }
          
          const demoOrg = demoOrgRecords[0];
          console.log('Using demo org:', demoOrg.id);
          
          // Create a new user record
          await db.insert(users).values({
            id: user.id,
            orgId: demoOrg.id,
            role: 'apprentice', // Default role
            email: user.email,
            name: user.email.split('@')[0] // Default name from email
          });
          
          console.log('New user record created successfully');
          
          // Fetch the newly created user
          const newUserRecord = await getUserRole(user.id, db);
          
          return res.status(200).json({
            id: user.id,
            email: user.email,
            ...newUserRecord,
            isNewUser: true
          });
        } catch (createError) {
          console.error('Error creating new user:', createError);
          Sentry.captureException(createError);
          throw createError;
        }
      } else {
        // If it's another error, rethrow it
        throw error;
      }
    }
  } catch (error) {
    console.error('Error in getUserData:', error);
    Sentry.captureException(error);
    return res.status(401).json({ error: error.message });
  } finally {
    await client.end();
  }
}