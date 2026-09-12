CREATE TYPE "MeasurementPosition" AS ENUM ('RECUMBENT', 'STANDING');

ALTER TABLE "GrowthEntry"
ADD COLUMN "measurementPosition" "MeasurementPosition";

CREATE TABLE "GrowthAssessment" (
    "id" TEXT NOT NULL,
    "growthEntryId" TEXT NOT NULL,
    "standard" TEXT NOT NULL DEFAULT 'WHO_2006',
    "engineVersion" TEXT NOT NULL,
    "weightAgeZ" DOUBLE PRECISION,
    "heightAgeZ" DOUBLE PRECISION,
    "weightHeightZ" DOUBLE PRECISION,
    "bmiAgeZ" DOUBLE PRECISION,
    "headAgeZ" DOUBLE PRECISION,
    "flags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GrowthAssessment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReminderDelivery" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "reminderKey" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReminderDelivery_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OfflineMutationReceipt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfflineMutationReceipt_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "GrowthAssessment_growthEntryId_key" ON "GrowthAssessment"("growthEntryId");
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");
CREATE INDEX "PushSubscription_userId_idx" ON "PushSubscription"("userId");
CREATE UNIQUE INDEX "ReminderDelivery_subscriptionId_reminderKey_key" ON "ReminderDelivery"("subscriptionId", "reminderKey");
CREATE INDEX "ReminderDelivery_scheduledAt_sentAt_idx" ON "ReminderDelivery"("scheduledAt", "sentAt");
CREATE INDEX "OfflineMutationReceipt_userId_createdAt_idx" ON "OfflineMutationReceipt"("userId", "createdAt");

ALTER TABLE "GrowthAssessment"
ADD CONSTRAINT "GrowthAssessment_growthEntryId_fkey"
FOREIGN KEY ("growthEntryId") REFERENCES "GrowthEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PushSubscription"
ADD CONSTRAINT "PushSubscription_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ReminderDelivery"
ADD CONSTRAINT "ReminderDelivery_subscriptionId_fkey"
FOREIGN KEY ("subscriptionId") REFERENCES "PushSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OfflineMutationReceipt"
ADD CONSTRAINT "OfflineMutationReceipt_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
