ALTER TABLE "PumpingEntry" ADD COLUMN "isRunning" BOOLEAN NOT NULL DEFAULT false;
CREATE UNIQUE INDEX "PumpingEntry_one_running_per_mother" ON "PumpingEntry"("motherId") WHERE "isRunning" = true;
