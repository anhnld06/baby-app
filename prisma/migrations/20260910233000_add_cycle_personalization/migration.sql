CREATE TYPE "OvulationTestResult" AS ENUM ('NEGATIVE', 'POSITIVE', 'PEAK');

ALTER TABLE "Mother"
ADD COLUMN "cycleLengthDays" INTEGER NOT NULL DEFAULT 28,
ADD COLUMN "periodLengthDays" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN "lutealPhaseDays" INTEGER NOT NULL DEFAULT 14;

ALTER TABLE "MotherDailyHealthLog"
ADD COLUMN "ovulationTest" "OvulationTestResult";
