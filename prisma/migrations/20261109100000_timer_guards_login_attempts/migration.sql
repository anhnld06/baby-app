-- MIGRATION VIẾT TAY. Prisma không biểu diễn được partial unique index; nếu `prisma migrate dev`
-- sinh DROP INDEX cho "SleepEntry_one_open_per_baby" hoặc "Feeding_one_active_breastfeeding_per_baby",
-- hãy xóa lệnh đó khỏi migration sinh ra (xem README, mục "Migration viết tay").

-- Preflight: dừng migration với thông báo rõ ràng nếu đã có bản ghi trùng (không tự xóa dữ liệu).
DO $$
DECLARE
  duplicate_babies TEXT;
BEGIN
  SELECT string_agg("babyId", ', ') INTO duplicate_babies FROM (
    SELECT "babyId" FROM "SleepEntry" WHERE "endTime" IS NULL GROUP BY "babyId" HAVING COUNT(*) > 1
  ) duplicates;
  IF duplicate_babies IS NOT NULL THEN
    RAISE EXCEPTION 'Có nhiều giấc ngủ đang chạy (endTime IS NULL) cho bé: %. Hãy kết thúc hoặc xóa bản trùng rồi chạy lại migration.', duplicate_babies;
  END IF;

  SELECT string_agg("babyId", ', ') INTO duplicate_babies FROM (
    SELECT "babyId" FROM "Feeding"
    WHERE "type" = 'BREASTFEEDING' AND "endTime" IS NULL AND "leftBreastDuration" IS NULL
      AND "rightBreastDuration" IS NULL AND "amountMl" IS NULL
    GROUP BY "babyId" HAVING COUNT(*) > 1
  ) duplicates;
  IF duplicate_babies IS NOT NULL THEN
    RAISE EXCEPTION 'Có nhiều cữ bú mẹ đang bấm giờ cho bé: %. Hãy kết thúc hoặc xóa bản trùng rồi chạy lại migration.', duplicate_babies;
  END IF;
END $$;

-- One running sleep per baby (two phones tapping "start" at once).
CREATE UNIQUE INDEX "SleepEntry_one_open_per_baby" ON "SleepEntry"("babyId") WHERE "endTime" IS NULL;

-- One running breastfeeding timer per baby; predicate mirrors activeFeedingWhere.
CREATE UNIQUE INDEX "Feeding_one_active_breastfeeding_per_baby" ON "Feeding"("babyId")
  WHERE "type" = 'BREASTFEEDING' AND "endTime" IS NULL AND "leftBreastDuration" IS NULL
    AND "rightBreastDuration" IS NULL AND "amountMl" IS NULL;

-- Missing foreign-key indexes.
CREATE INDEX IF NOT EXISTS "Baby_pregnancyId_idx" ON "Baby"("pregnancyId");
CREATE INDEX IF NOT EXISTS "PrescriptionItem_prescriptionId_idx" ON "PrescriptionItem"("prescriptionId");
CREATE INDEX IF NOT EXISTS "KnowledgeSource_articleId_idx" ON "KnowledgeSource"("articleId");

-- Failed login attempts (HMAC of client IP, never the raw IP).
CREATE TABLE "LoginAttempt" (
  "id" TEXT NOT NULL,
  "keyHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "LoginAttempt_keyHash_createdAt_idx" ON "LoginAttempt"("keyHash", "createdAt");
CREATE INDEX "LoginAttempt_createdAt_idx" ON "LoginAttempt"("createdAt");
