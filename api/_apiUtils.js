import { initializeZapt } from '@zapt/zapt-js';
import * as Sentry from '@sentry/node';
import { eq } from 'drizzle-orm';
import { users } from '../drizzle/schema.js';
import { logChanges } from '../drizzle/schema.js'; // Fixed: explicit import for logChanges

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

    console.log('Authenticated user:', user.email);
    return user;
  } catch (error) {
    console.error('Authentication error:', error.message);
    Sentry.captureException(error);
    throw error;
  }
}

export async function getUserRole(userId, db) {
  try {
    console.log('Getting user role for userId:', userId);
    // Query the database to get the user's role using the correct Drizzle query pattern
    const userRecords = await db.select({
      role: users.role,
      orgId: users.orgId,
      name: users.name,
      email: users.email
    })
    .from(users)
    .where(eq(users.id, userId));

    if (!userRecords || userRecords.length === 0) {
      console.error('User record not found in database');
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