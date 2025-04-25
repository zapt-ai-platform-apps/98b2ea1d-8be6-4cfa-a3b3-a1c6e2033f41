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
      console.error('Authentication failed: Missing Authorization header');
      throw new Error('Missing Authorization header');
    }

    // Log token format (safely)
    const authParts = authHeader.split(' ');
    if (authParts.length !== 2 || authParts[0] !== 'Bearer') {
      console.error('Authentication failed: Invalid Authorization header format');
      throw new Error('Invalid Authorization header format. Expected: Bearer <token>');
    }

    const token = authParts[1];
    console.log('Token format check:', {
      length: token.length,
      startsWithEy: token.startsWith('ey'),
      hasThreeParts: token.split('.').length === 3
    });

    console.log('Calling supabase.auth.getUser with token');
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error('Authentication error details:', {
        message: error.message,
        status: error.status,
        name: error.name,
        code: error.code
      });
      
      // Enhanced error for troubleshooting
      throw new Error(`Invalid token: ${error.message}`);
    }

    if (!data || !data.user) {
      console.error('Authentication failed: User not found in Supabase response');
      throw new Error('User not found in authentication response');
    }

    console.log('Authenticated user:', data.user.email, 'with ID:', data.user.id);
    return data.user;
  } catch (error) {
    console.error('Authentication error:', error.message, error.stack);
    Sentry.captureException(error, {
      extra: {
        hasAuthHeader: !!req.headers.authorization,
        authHeaderStart: req.headers.authorization ? 
          `${req.headers.authorization.substring(0, 15)}...` : 'N/A'
      }
    });
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