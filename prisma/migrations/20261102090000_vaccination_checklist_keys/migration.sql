-- Stable checklist identity; existing family records remain unchanged.
ALTER TABLE "VaccinationRecord" ADD COLUMN "scheduleKey" TEXT;
ALTER TABLE "MotherVaccinationRecord" ADD COLUMN "scheduleKey" TEXT;
CREATE UNIQUE INDEX "VaccinationRecord_babyId_scheduleKey_key" ON "VaccinationRecord"("babyId", "scheduleKey");
CREATE UNIQUE INDEX "MotherVaccinationRecord_motherId_scheduleKey_key" ON "MotherVaccinationRecord"("motherId", "scheduleKey");
