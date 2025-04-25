-- Ensure the demo organization exists
INSERT INTO "org" ("name", "plan")
SELECT 'Hopwood Hall College', 'pro'
WHERE NOT EXISTS (
  SELECT 1 FROM "org" WHERE "name" = 'Hopwood Hall College'
);