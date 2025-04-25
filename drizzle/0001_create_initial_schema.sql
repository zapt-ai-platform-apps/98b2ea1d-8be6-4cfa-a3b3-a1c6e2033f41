-- Organizations table
CREATE TABLE IF NOT EXISTS "org" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "plan" TEXT CHECK ("plan" IN ('free', 'pro', 'enterprise')) NOT NULL DEFAULT 'free',
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS "user" (
  "id" UUID PRIMARY KEY,
  "org_id" INTEGER NOT NULL REFERENCES "org"("id") ON DELETE CASCADE,
  "role" TEXT CHECK ("role" IN ('apprentice', 'assessor', 'iqa', 'employer', 'admin')) NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- Apprentice standards table
CREATE TABLE IF NOT EXISTS "standard" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "level" INTEGER NOT NULL,
  "code" TEXT NOT NULL,
  "otj_required_hours" INTEGER NOT NULL
);

-- Apprentices table
CREATE TABLE IF NOT EXISTS "apprentice" (
  "id" SERIAL PRIMARY KEY,
  "org_id" INTEGER NOT NULL REFERENCES "org"("id") ON DELETE CASCADE,
  "standard_id" INTEGER NOT NULL REFERENCES "standard"("id"),
  "name" TEXT NOT NULL,
  "start_date" DATE NOT NULL,
  "end_date" DATE,
  "user_id" UUID REFERENCES "user"("id"),
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- Evidence items table
CREATE TABLE IF NOT EXISTS "evidence_item" (
  "id" SERIAL PRIMARY KEY,
  "apprentice_id" INTEGER NOT NULL REFERENCES "apprentice"("id") ON DELETE CASCADE,
  "file_url" TEXT NOT NULL,
  "type" TEXT CHECK ("type" IN ('photo', 'video', 'pdf')) NOT NULL,
  "minutes" INTEGER,
  "linked_standard_id" INTEGER REFERENCES "standard"("id"),
  "geo_lat" FLOAT,
  "geo_lng" FLOAT,
  "captured_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- Off-The-Job logs table
CREATE TABLE IF NOT EXISTS "otj_log" (
  "id" SERIAL PRIMARY KEY,
  "apprentice_id" INTEGER NOT NULL REFERENCES "apprentice"("id") ON DELETE CASCADE,
  "minutes" INTEGER NOT NULL,
  "evidence_id" INTEGER REFERENCES "evidence_item"("id") ON DELETE SET NULL,
  "auto" BOOLEAN DEFAULT TRUE,
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS "review" (
  "id" SERIAL PRIMARY KEY,
  "evidence_id" INTEGER NOT NULL REFERENCES "evidence_item"("id") ON DELETE CASCADE,
  "assessor_id" UUID NOT NULL REFERENCES "user"("id"),
  "status" TEXT CHECK ("status" IN ('pending', 'approved', 'rejected')) NOT NULL DEFAULT 'pending',
  "comments" TEXT,
  "signed_at" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- IQA Samples table
CREATE TABLE IF NOT EXISTS "iqa_sample" (
  "id" SERIAL PRIMARY KEY,
  "review_id" INTEGER NOT NULL REFERENCES "review"("id") ON DELETE CASCADE,
  "iqa_id" UUID NOT NULL REFERENCES "user"("id"),
  "outcome" TEXT CHECK ("outcome" IN ('ok', 'issue')) NOT NULL,
  "sampled_at" TIMESTAMP DEFAULT NOW(),
  "comments" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- Gateway assessment table
CREATE TABLE IF NOT EXISTS "gateway" (
  "id" SERIAL PRIMARY KEY,
  "apprentice_id" INTEGER NOT NULL REFERENCES "apprentice"("id") ON DELETE CASCADE,
  "ready" BOOLEAN NOT NULL DEFAULT FALSE,
  "checklist_json" TEXT,
  "signed_at" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- EPA Results table
CREATE TABLE IF NOT EXISTS "epa_result" (
  "id" SERIAL PRIMARY KEY,
  "apprentice_id" INTEGER NOT NULL REFERENCES "apprentice"("id") ON DELETE CASCADE,
  "grade" TEXT CHECK ("grade" IN ('fail', 'pass', 'merit', 'distinction')) NOT NULL,
  "date" DATE NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- Funding Alerts table
CREATE TABLE IF NOT EXISTS "funding_alert" (
  "id" SERIAL PRIMARY KEY,
  "apprentice_id" INTEGER NOT NULL REFERENCES "apprentice"("id") ON DELETE CASCADE,
  "alert_type" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "raised_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "cleared_at" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- Audit log table
CREATE TABLE IF NOT EXISTS "log_changes" (
  "id" SERIAL PRIMARY KEY,
  "table_name" TEXT NOT NULL,
  "record_id" TEXT NOT NULL,
  "operation" TEXT CHECK ("operation" IN ('INSERT', 'UPDATE', 'DELETE')) NOT NULL,
  "old_data" TEXT,
  "new_data" TEXT,
  "changed_by" UUID REFERENCES "user"("id"),
  "changed_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert demo data
INSERT INTO "org" ("name", "plan") VALUES 
('Hopwood Hall College', 'pro');

INSERT INTO "standard" ("name", "level", "code", "otj_required_hours") VALUES
('Software Developer', 4, 'ST0116', 720),
('Digital Marketer', 3, 'ST0122', 540),
('Business Administrator', 3, 'ST0070', 540);