-- The following historical migration adds `source` before the full table was
-- introduced. Create a disposable placeholder so fresh databases can apply
-- the immutable migration history in order.
CREATE TABLE IF NOT EXISTS "PregnancyCheckup" (
    "id" TEXT NOT NULL,
    CONSTRAINT "PregnancyCheckup_pkey" PRIMARY KEY ("id")
);
