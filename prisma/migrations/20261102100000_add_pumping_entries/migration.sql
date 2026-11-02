CREATE TABLE "PumpingEntry" (
    "id" TEXT NOT NULL,
    "motherId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER,
    "leftAmountMl" DOUBLE PRECISION,
    "rightAmountMl" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PumpingEntry_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "PumpingEntry_motherId_startTime_idx" ON "PumpingEntry"("motherId", "startTime");
ALTER TABLE "PumpingEntry" ADD CONSTRAINT "PumpingEntry_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Mother"("id") ON DELETE CASCADE ON UPDATE CASCADE;
