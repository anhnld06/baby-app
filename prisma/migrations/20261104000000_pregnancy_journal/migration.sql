CREATE TABLE "PregnancyJournalEntry" (
  "id" TEXT NOT NULL,
  "pregnancyId" TEXT NOT NULL,
  "kind" TEXT NOT NULL,
  "occurredOn" DATE NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PregnancyJournalEntry_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PregnancyJournalEntry_kind_check" CHECK ("kind" IN ('HEALTH', 'MEMORY'))
);
CREATE INDEX "PregnancyJournalEntry_pregnancyId_kind_occurredOn_idx" ON "PregnancyJournalEntry"("pregnancyId", "kind", "occurredOn");
ALTER TABLE "PregnancyJournalEntry" ADD CONSTRAINT "PregnancyJournalEntry_pregnancyId_fkey" FOREIGN KEY ("pregnancyId") REFERENCES "Pregnancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
