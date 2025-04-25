import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { authenticateUser, getUserRole } from './_apiUtils.js';
import { users } from '../drizzle/schema.js';
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

    // Get the user's role and organization from the database
    const userRecord = await getUserRole(user.id, db);
    
    if (!userRecord) {
      console.log('User not found in database, creating new user record');
      
      // If the user is not in the database yet, we need to create a new record
      // For now, assign them to the demo organization with a default role
      const demoOrg = await db.query.orgs.findFirst({
        where: (orgs, { eq }) => eq(orgs.name, 'Hopwood Hall College')
      });
      
      if (!demoOrg) {
        throw new Error('Demo organization not found');
      }
      
      // Create a new user record
      await db.insert(users).values({
        id: user.id,
        orgId: demoOrg.id,
        role: 'apprentice', // Default role
        email: user.email,
        name: user.email.split('@')[0] // Default name from email
      });
      
      // Fetch the newly created user
      const newUserRecord = await getUserRole(user.id, db);
      
      return res.status(200).json({
        id: user.id,
        email: user.email,
        ...newUserRecord,
        isNewUser: true
      });
    }
    
    // Return the user data with the role and organization
    return res.status(200).json({
      id: user.id,
      email: user.email,
      ...userRecord,
      isNewUser: false
    });
  } catch (error) {
    console.error('Error in getUserData:', error);
    Sentry.captureException(error);
    return res.status(401).json({ error: error.message });
  } finally {
    await client.end();
  }
}