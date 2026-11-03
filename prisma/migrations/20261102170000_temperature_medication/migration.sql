CREATE TABLE "TemperatureEntry" (
 "id" TEXT NOT NULL, "babyId" TEXT NOT NULL, "measuredAt" TIMESTAMP(3) NOT NULL,
 "celsius" DOUBLE PRECISION NOT NULL, "method" TEXT NOT NULL, "notes" TEXT,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "TemperatureEntry_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "TemperatureEntry_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "TemperatureEntry_babyId_measuredAt_idx" ON "TemperatureEntry"("babyId", "measuredAt");
CREATE TABLE "MedicationSchedule" (
 "id" TEXT NOT NULL, "babyId" TEXT NOT NULL, "name" TEXT NOT NULL, "dosage" TEXT NOT NULL,
 "instructions" TEXT, "startDate" DATE NOT NULL, "endDate" DATE, "times" TEXT[] NOT NULL,
 "active" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "MedicationSchedule_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "MedicationSchedule_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "MedicationSchedule_babyId_active_idx" ON "MedicationSchedule"("babyId", "active");
CREATE TABLE "MedicationDose" (
 "id" TEXT NOT NULL, "scheduleId" TEXT NOT NULL, "day" DATE NOT NULL, "time" TEXT NOT NULL,
 "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "MedicationDose_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "MedicationDose_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "MedicationSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "MedicationDose_scheduleId_day_time_key" ON "MedicationDose"("scheduleId", "day", "time");
CREATE INDEX "MedicationDose_day_idx" ON "MedicationDose"("day");
