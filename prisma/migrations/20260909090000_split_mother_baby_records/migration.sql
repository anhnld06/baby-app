-- Mother-only tracking
CREATE TABLE "MenstrualCycle" (
    "id" TEXT NOT NULL,
    "motherId" TEXT NOT NULL,
    "periodStart" DATE NOT NULL,
    "periodEnd" DATE,
    "flow" TEXT,
    "symptoms" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MenstrualCycle_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PregnancyCheckup" (
    "id" TEXT NOT NULL,
    "pregnancyId" TEXT NOT NULL,
    "checkedAt" TIMESTAMP(3) NOT NULL,
    "gestationalWeek" INTEGER,
    "weightKg" DOUBLE PRECISION,
    "bloodPressure" TEXT,
    "fetalHeartRate" INTEGER,
    "fundalHeightCm" DOUBLE PRECISION,
    "facility" TEXT,
    "doctor" TEXT,
    "findings" TEXT,
    "nextCheckupAt" DATE,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PregnancyCheckup_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MotherMedicalVisit" (
    "id" TEXT NOT NULL,
    "motherId" TEXT NOT NULL,
    "visitedAt" TIMESTAMP(3) NOT NULL,
    "facility" TEXT,
    "doctor" TEXT,
    "specialty" TEXT,
    "reason" TEXT,
    "diagnosis" TEXT,
    "treatment" TEXT,
    "nextVisitAt" DATE,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MotherMedicalVisit_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MotherInsurancePolicy" (
    "id" TEXT NOT NULL,
    "motherId" TEXT NOT NULL,
    "insuranceType" TEXT NOT NULL,
    "provider" TEXT,
    "policyNumber" TEXT NOT NULL,
    "registeredCare" TEXT,
    "validFrom" DATE,
    "validUntil" DATE,
    "contact" TEXT,
    "benefits" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MotherInsurancePolicy_pkey" PRIMARY KEY ("id")
);

-- Baby-only tracking
CREATE TABLE "BabyMedicalVisit" (
    "id" TEXT NOT NULL,
    "babyId" TEXT NOT NULL,
    "visitedAt" TIMESTAMP(3) NOT NULL,
    "facility" TEXT,
    "doctor" TEXT,
    "specialty" TEXT,
    "reason" TEXT,
    "diagnosis" TEXT,
    "treatment" TEXT,
    "nextVisitAt" DATE,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BabyMedicalVisit_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BabyInsurancePolicy" (
    "id" TEXT NOT NULL,
    "babyId" TEXT NOT NULL,
    "insuranceType" TEXT NOT NULL,
    "provider" TEXT,
    "policyNumber" TEXT NOT NULL,
    "registeredCare" TEXT,
    "validFrom" DATE,
    "validUntil" DATE,
    "contact" TEXT,
    "benefits" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BabyInsurancePolicy_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MenstrualCycle_motherId_periodStart_idx" ON "MenstrualCycle"("motherId", "periodStart");
CREATE INDEX "PregnancyCheckup_pregnancyId_checkedAt_idx" ON "PregnancyCheckup"("pregnancyId", "checkedAt");
CREATE INDEX "MotherMedicalVisit_motherId_visitedAt_idx" ON "MotherMedicalVisit"("motherId", "visitedAt");
CREATE INDEX "MotherInsurancePolicy_motherId_validUntil_idx" ON "MotherInsurancePolicy"("motherId", "validUntil");
CREATE INDEX "BabyMedicalVisit_babyId_visitedAt_idx" ON "BabyMedicalVisit"("babyId", "visitedAt");
CREATE INDEX "BabyInsurancePolicy_babyId_validUntil_idx" ON "BabyInsurancePolicy"("babyId", "validUntil");

ALTER TABLE "MenstrualCycle" ADD CONSTRAINT "MenstrualCycle_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Mother"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PregnancyCheckup" ADD CONSTRAINT "PregnancyCheckup_pregnancyId_fkey" FOREIGN KEY ("pregnancyId") REFERENCES "Pregnancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MotherMedicalVisit" ADD CONSTRAINT "MotherMedicalVisit_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Mother"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MotherInsurancePolicy" ADD CONSTRAINT "MotherInsurancePolicy_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Mother"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BabyMedicalVisit" ADD CONSTRAINT "BabyMedicalVisit_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BabyInsurancePolicy" ADD CONSTRAINT "BabyInsurancePolicy_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;
