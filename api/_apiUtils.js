import { initializeZapt } from '@zapt/zapt-js';
import * as Sentry from '@sentry/node';

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
    // Query the database to get the user's role
    const userRecord = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
      columns: {
        role: true,
        orgId: true,
        name: true,
        email: true
      }
    });

    if (!userRecord) {
      console.error('User record not found in database');
      throw new Error('User not found in database');
    }

    console.log('Found user role:', userRecord.role);
    return userRecord;
  } catch (error) {
    console.error('Error getting user role:', error.message);
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