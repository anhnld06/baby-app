-- AlterTable
ALTER TABLE "PregnancyCheckup" ADD COLUMN     "source" "RecordSource" NOT NULL DEFAULT 'MANUAL';

-- CreateTable
CREATE TABLE "MotherVaccinationRecord" (
    "id" TEXT NOT NULL,
    "motherId" TEXT NOT NULL,
    "vaccineName" TEXT NOT NULL,
    "doseNumber" INTEGER,
    "administeredAt" TIMESTAMP(3) NOT NULL,
    "facility" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MotherVaccinationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MotherVaccinationRecord_motherId_administeredAt_idx" ON "MotherVaccinationRecord"("motherId", "administeredAt");

-- AddForeignKey
ALTER TABLE "MotherVaccinationRecord" ADD CONSTRAINT "MotherVaccinationRecord_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Mother"("id") ON DELETE CASCADE ON UPDATE CASCADE;
