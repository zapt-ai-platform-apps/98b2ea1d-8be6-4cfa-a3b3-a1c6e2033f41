import { pgTable, serial, text, timestamp, uuid, integer, boolean, date, foreignKey, real, check } from 'drizzle-orm/pg-core';

// Organizations
export const orgs = pgTable('org', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  plan: text('plan').notNull().default('free'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Users
export const users = pgTable('user', {
  id: uuid('id').primaryKey(),
  orgId: integer('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Apprenticeship standards
export const standards = pgTable('standard', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  level: integer('level').notNull(),
  code: text('code').notNull(),
  otjRequiredHours: integer('otj_required_hours').notNull(),
});

// Apprentices
export const apprentices = pgTable('apprentice', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
  standardId: integer('standard_id').notNull().references(() => standards.id),
  name: text('name').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  userId: uuid('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Evidence items
export const evidenceItems = pgTable('evidence_item', {
  id: serial('id').primaryKey(),
  apprenticeId: integer('apprentice_id').notNull().references(() => apprentices.id, { onDelete: 'cascade' }),
  fileUrl: text('file_url').notNull(),
  type: text('type').notNull(),
  minutes: integer('minutes'),
  linkedStandardId: integer('linked_standard_id').references(() => standards.id),
  geoLat: real('geo_lat'),
  geoLng: real('geo_lng'),
  capturedAt: timestamp('captured_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Off-The-Job logs
export const otjLogs = pgTable('otj_log', {
  id: serial('id').primaryKey(),
  apprenticeId: integer('apprentice_id').notNull().references(() => apprentices.id, { onDelete: 'cascade' }),
  minutes: integer('minutes').notNull(),
  evidenceId: integer('evidence_id').references(() => evidenceItems.id, { onDelete: 'set null' }),
  auto: boolean('auto').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Reviews
export const reviews = pgTable('review', {
  id: serial('id').primaryKey(),
  evidenceId: integer('evidence_id').notNull().references(() => evidenceItems.id, { onDelete: 'cascade' }),
  assessorId: uuid('assessor_id').notNull().references(() => users.id),
  status: text('status').notNull().default('pending'),
  comments: text('comments'),
  signedAt: timestamp('signed_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// IQA Samples
export const iqaSamples = pgTable('iqa_sample', {
  id: serial('id').primaryKey(),
  reviewId: integer('review_id').notNull().references(() => reviews.id, { onDelete: 'cascade' }),
  iqaId: uuid('iqa_id').notNull().references(() => users.id),
  outcome: text('outcome').notNull(),
  sampledAt: timestamp('sampled_at').defaultNow(),
  comments: text('comments'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Gateway assessments
export const gateways = pgTable('gateway', {
  id: serial('id').primaryKey(),
  apprenticeId: integer('apprentice_id').notNull().references(() => apprentices.id, { onDelete: 'cascade' }),
  ready: boolean('ready').notNull().default(false),
  checklistJson: text('checklist_json'),
  signedAt: timestamp('signed_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// EPA Results
export const epaResults = pgTable('epa_result', {
  id: serial('id').primaryKey(),
  apprenticeId: integer('apprentice_id').notNull().references(() => apprentices.id, { onDelete: 'cascade' }),
  grade: text('grade').notNull(),
  date: date('date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Funding Alerts
export const fundingAlerts = pgTable('funding_alert', {
  id: serial('id').primaryKey(),
  apprenticeId: integer('apprentice_id').notNull().references(() => apprentices.id, { onDelete: 'cascade' }),
  alertType: text('alert_type').notNull(),
  description: text('description').notNull(),
  raisedAt: timestamp('raised_at').notNull().defaultNow(),
  clearedAt: timestamp('cleared_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Audit log
export const logChanges = pgTable('log_changes', {
  id: serial('id').primaryKey(),
  tableName: text('table_name').notNull(),
  recordId: text('record_id').notNull(),
  operation: text('operation').notNull(),
  oldData: text('old_data'),
  newData: text('new_data'),
  changedBy: uuid('changed_by').references(() => users.id),
  changedAt: timestamp('changed_at').notNull().defaultNow(),
});