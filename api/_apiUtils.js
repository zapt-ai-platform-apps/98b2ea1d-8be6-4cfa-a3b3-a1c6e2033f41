import { initializeZapt } from '@zapt/zapt-js';
import * as Sentry from '@sentry/node';
import { eq } from 'drizzle-orm';
import { users } from '../drizzle/schema.js';
import { logChanges } from '../drizzle/schema.js';

// Initialize Sentry
Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID
    }
  }
});

const { supabase } = initializeZapt(process.env.VITE_PUBLIC_APP_ID);

export async function authenticateUser(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error('Authentication error:', error.message);
      throw new Error('Invalid token');
    }

    if (!user) {
      throw new Error('User not found');
    }

    console.log('Authenticated user:', user.email, 'with ID:', user.id);
    return user;
  } catch (error) {
    console.error('Authentication error:', error.message);
    Sentry.captureException(error);
    throw error;
  }
}

export async function getUserRole(userId, db) {
  try {
    if (!userId) {
      console.error('No userId provided to getUserRole');
      throw new Error('No userId provided to getUserRole');
    }
    
    console.log('Getting user role for userId:', userId);
    
    // Query the database to get the user's role
    const userRecords = await db.select({
      role: users.role,
      orgId: users.orgId,
      name: users.name,
      email: users.email
    })
    .from(users)
    .where(eq(users.id, userId));
    
    console.log('User record query returned', userRecords?.length || 0, 'results');
    
    if (!userRecords || userRecords.length === 0) {
      console.error(`User record not found in database for userId: ${userId}`);
      throw new Error('User not found in database');
    }
    
    const userRecord = userRecords[0];
    console.log('Found user role:', userRecord.role);
    return userRecord;
  } catch (error) {
    console.error('Error getting user role:', error.message, error.stack);
    Sentry.captureException(error);
    throw error;
  }
}

export async function createAuditLog(db, tableName, recordId, operation, oldData, newData, userId) {
  try {
    await db.insert(logChanges).values({
      tableName,
      recordId: String(recordId),
      operation,
      oldData: oldData ? JSON.stringify(oldData) : null,
      newData: newData ? JSON.stringify(newData) : null,
      changedBy: userId
    });
    console.log('Audit log created for', operation, 'on', tableName);
  } catch (error) {
    console.error('Error creating audit log:', error);
    Sentry.captureException(error);
  }
}