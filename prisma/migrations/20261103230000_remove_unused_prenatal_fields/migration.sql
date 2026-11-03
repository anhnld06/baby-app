BEGIN;

-- Prevent a concurrent insert from escaping the preflight check.
LOCK TABLE "PregnancyCheckup" IN SHARE ROW EXCLUSIVE MODE;

-- These observations were verified empty. Abort if another environment has data.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "PregnancyCheckup"
    WHERE "fundalHeightCm" IS NOT NULL
       OR NULLIF(BTRIM("vaginalExamination"), '') IS NOT NULL
       OR NULLIF(BTRIM("notes"), '') IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'Prenatal fields contain data. Export and review fundalHeightCm, vaginalExamination and notes before removing them.';
  END IF;
END $$;

-- Preserve explicit appointment dates alongside any existing instructions.
UPDATE "PregnancyCheckup"
SET "followupInstruction" = CONCAT_WS(
  E'\n',
  NULLIF(BTRIM("followupInstruction"), ''),
  'Ngày tái khám: ' || TO_CHAR("nextCheckupAt", 'DD/MM/YYYY')
)
WHERE "nextCheckupAt" IS NOT NULL;

ALTER TABLE "PregnancyCheckup"
  DROP COLUMN "fundalHeightCm",
  DROP COLUMN "vaginalExamination",
  DROP COLUMN "nextCheckupAt",
  DROP COLUMN "notes";

COMMIT;
