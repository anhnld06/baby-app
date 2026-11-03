CREATE TABLE "PregnancyTrackingSession" (
  "id" TEXT NOT NULL,
  "pregnancyId" TEXT NOT NULL,
  "clientId" TEXT NOT NULL,
  "kind" TEXT NOT NULL,
  "startedAt" TIMESTAMP(3) NOT NULL,
  "endedAt" TIMESTAMP(3) NOT NULL,
  "events" JSONB NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PregnancyTrackingSession_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PregnancyTrackingSession_kind_check" CHECK ("kind" IN ('KICKS', 'CONTRACTIONS'))
);
CREATE UNIQUE INDEX "PregnancyTrackingSession_pregnancyId_clientId_key" ON "PregnancyTrackingSession"("pregnancyId", "clientId");
CREATE INDEX "PregnancyTrackingSession_pregnancyId_kind_startedAt_idx" ON "PregnancyTrackingSession"("pregnancyId", "kind", "startedAt");
ALTER TABLE "PregnancyTrackingSession" ADD CONSTRAINT "PregnancyTrackingSession_pregnancyId_fkey" FOREIGN KEY ("pregnancyId") REFERENCES "Pregnancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE TABLE "PregnancyMeasurement" (
  "id" TEXT NOT NULL,
  "pregnancyId" TEXT NOT NULL,
  "measuredOn" DATE NOT NULL,
  "weightKg" DOUBLE PRECISION,
  "bellyCm" DOUBLE PRECISION,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PregnancyMeasurement_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PregnancyMeasurement_values_check" CHECK ("weightKg" IS NOT NULL OR "bellyCm" IS NOT NULL)
);
CREATE UNIQUE INDEX "PregnancyMeasurement_pregnancyId_measuredOn_key" ON "PregnancyMeasurement"("pregnancyId", "measuredOn");
ALTER TABLE "PregnancyMeasurement" ADD CONSTRAINT "PregnancyMeasurement_pregnancyId_fkey" FOREIGN KEY ("pregnancyId") REFERENCES "Pregnancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
