CREATE TABLE "VaccinationAppointment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "babyId" TEXT,
  "motherId" TEXT,
  "vaccineName" TEXT NOT NULL,
  "doseNumber" INTEGER,
  "scheduledAt" DATE NOT NULL,
  "notes" TEXT,
  "vaccinationRecordId" TEXT UNIQUE,
  "motherVaccinationRecordId" TEXT UNIQUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VaccinationAppointment_owner_check" CHECK (("babyId" IS NOT NULL) <> ("motherId" IS NOT NULL)),
  CONSTRAINT "VaccinationAppointment_record_owner_check" CHECK (
    ("vaccinationRecordId" IS NULL OR "babyId" IS NOT NULL) AND
    ("motherVaccinationRecordId" IS NULL OR "motherId" IS NOT NULL)
  ),
  FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("motherId") REFERENCES "Mother"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("vaccinationRecordId") REFERENCES "VaccinationRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY ("motherVaccinationRecordId") REFERENCES "MotherVaccinationRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "VaccinationAppointment_babyId_scheduledAt_idx" ON "VaccinationAppointment"("babyId", "scheduledAt");
CREATE INDEX "VaccinationAppointment_motherId_scheduledAt_idx" ON "VaccinationAppointment"("motherId", "scheduledAt");

-- Preserve previously entered follow-up dates as actionable appointments.
INSERT INTO "VaccinationAppointment" ("id", "babyId", "vaccineName", "scheduledAt", "notes", "updatedAt")
SELECT 'legacy-vaccine-followup-' || "id", "babyId", "vaccineName", "nextDueAt",
       'Lịch hẹn tiếp theo đã lưu trước đây.', CURRENT_TIMESTAMP
FROM "VaccinationRecord" WHERE "nextDueAt" IS NOT NULL;
