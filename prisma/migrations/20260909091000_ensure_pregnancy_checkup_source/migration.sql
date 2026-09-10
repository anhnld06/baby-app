-- Reapply the column after the full table definition on fresh databases.
-- This is a no-op for databases where the historical migration already added it.
ALTER TABLE "PregnancyCheckup"
ADD COLUMN IF NOT EXISTS "source" "RecordSource" NOT NULL DEFAULT 'MANUAL';
