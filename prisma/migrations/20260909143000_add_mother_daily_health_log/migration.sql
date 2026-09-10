CREATE TABLE "MotherDailyHealthLog" (
    "id" TEXT NOT NULL,
    "motherId" TEXT NOT NULL,
    "loggedAt" DATE NOT NULL,
    "flow" TEXT,
    "symptoms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "moods" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "discharge" TEXT,
    "sleepHours" DOUBLE PRECISION,
    "basalTemperatureC" DOUBLE PRECISION,
    "weightKg" DOUBLE PRECISION,
    "waterGlasses" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MotherDailyHealthLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MotherDailyHealthLog_motherId_loggedAt_key" ON "MotherDailyHealthLog"("motherId", "loggedAt");
CREATE INDEX "MotherDailyHealthLog_motherId_loggedAt_idx" ON "MotherDailyHealthLog"("motherId", "loggedAt");
ALTER TABLE "MotherDailyHealthLog" ADD CONSTRAINT "MotherDailyHealthLog_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Mother"("id") ON DELETE CASCADE ON UPDATE CASCADE;
