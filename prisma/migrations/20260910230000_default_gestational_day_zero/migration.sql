UPDATE "PregnancyCheckup" SET "gestationalDay" = 0 WHERE "gestationalDay" IS NULL;

ALTER TABLE "PregnancyCheckup"
ALTER COLUMN "gestationalDay" SET DEFAULT 0,
ALTER COLUMN "gestationalDay" SET NOT NULL;
