ALTER TABLE "BabyMemory" ADD COLUMN "milestoneKey" TEXT;
CREATE INDEX "BabyMemory_babyId_milestoneKey_idx" ON "BabyMemory"("babyId", "milestoneKey");
