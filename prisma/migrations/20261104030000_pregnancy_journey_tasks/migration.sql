CREATE TABLE "PregnancyJourneyTask" (
  "id" TEXT NOT NULL,
  "pregnancyId" TEXT NOT NULL,
  "taskKey" TEXT NOT NULL,
  "done" BOOLEAN NOT NULL DEFAULT false,
  "note" TEXT NOT NULL DEFAULT '',
  "remindOn" DATE,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PregnancyJourneyTask_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PregnancyJourneyTask_pregnancyId_taskKey_key" ON "PregnancyJourneyTask"("pregnancyId", "taskKey");
ALTER TABLE "PregnancyJourneyTask" ADD CONSTRAINT "PregnancyJourneyTask_pregnancyId_fkey" FOREIGN KEY ("pregnancyId") REFERENCES "Pregnancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
