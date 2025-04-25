import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { authenticateUser, getUserRole } from './_apiUtils.js';
import { orgs, users, standards, apprentices, evidenceItems, otjLogs, reviews } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log('seedDemoData API called');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = postgres(process.env.COCKROACH_DB_URL);
  const db = drizzle(client);

  try {
    const user = await authenticateUser(req);
    console.log('User authenticated:', user.id);

    // Get the user's role and organization from the database
    const userRecord = await getUserRole(user.id, db);
    
    if (!userRecord || userRecord.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can seed demo data' });
    }
    
    // Check if demo data already exists for this organization
    const existingApprentices = await db.query.apprentices.findMany({
      where: (apprentices, { eq }) => eq(apprentices.orgId, userRecord.orgId)
    });
    
    if (existingApprentices.length > 0) {
      return res.status(200).json({ message: 'Demo data already exists', existingApprentices });
    }
    
    // Fetch standards
    const standardsList = await db.query.standards.findMany();
    if (standardsList.length === 0) {
      throw new Error('No standards found in database');
    }
    
    // Create demo apprentices
    const apprentice1 = await db.insert(apprentices).values({
      orgId: userRecord.orgId,
      standardId: standardsList[0].id,
      name: 'John Smith',
      startDate: new Date('2023-09-01')
    }).returning();
    
    const apprentice2 = await db.insert(apprentices).values({
      orgId: userRecord.orgId,
      standardId: standardsList[1].id,
      name: 'Sarah Johnson',
      startDate: new Date('2023-10-15')
    }).returning();
    
    // Create evidence items for first apprentice
    const evidence1 = await db.insert(evidenceItems).values({
      apprenticeId: apprentice1[0].id,
      fileUrl: 'https://example.com/evidence1.pdf',
      type: 'pdf',
      minutes: 45,
      linkedStandardId: standardsList[0].id,
      capturedAt: new Date('2023-11-10')
    }).returning();
    
    const evidence2 = await db.insert(evidenceItems).values({
      apprenticeId: apprentice1[0].id,
      fileUrl: 'https://example.com/evidence2.mp4',
      type: 'video',
      minutes: 30,
      linkedStandardId: standardsList[0].id,
      capturedAt: new Date('2023-12-05')
    }).returning();
    
    // Create evidence item for second apprentice
    const evidence3 = await db.insert(evidenceItems).values({
      apprenticeId: apprentice2[0].id,
      fileUrl: 'https://example.com/evidence3.jpg',
      type: 'photo',
      minutes: 15,
      linkedStandardId: standardsList[1].id,
      capturedAt: new Date('2024-01-20')
    }).returning();
    
    // Create OTJ logs corresponding to evidence
    await db.insert(otjLogs).values({
      apprenticeId: apprentice1[0].id,
      minutes: 45,
      evidenceId: evidence1[0].id,
      auto: true
    });
    
    await db.insert(otjLogs).values({
      apprenticeId: apprentice1[0].id,
      minutes: 30,
      evidenceId: evidence2[0].id,
      auto: true
    });
    
    await db.insert(otjLogs).values({
      apprenticeId: apprentice2[0].id,
      minutes: 15,
      evidenceId: evidence3[0].id,
      auto: true
    });
    
    // Add a review for one evidence item
    await db.insert(reviews).values({
      evidenceId: evidence1[0].id,
      assessorId: user.id,
      status: 'approved',
      comments: 'Excellent work, meets all criteria',
      signedAt: new Date()
    });
    
    return res.status(200).json({ 
      message: 'Demo data created successfully',
      apprentices: [apprentice1[0], apprentice2[0]],
      evidenceItems: [evidence1[0], evidence2[0], evidence3[0]]
    });
    
  } catch (error) {
    console.error('Error in seedDemoData:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  } finally {
    await client.end();
  }
}