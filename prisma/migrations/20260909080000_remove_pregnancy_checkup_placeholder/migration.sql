-- On a fresh database, remove only the placeholder before the full table is
-- created by 20260909090000. Existing databases that already applied the full
-- migration are deliberately left untouched.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM "_prisma_migrations"
        WHERE migration_name = '20260909090000_split_mother_baby_records'
          AND finished_at IS NOT NULL
    ) THEN
        DROP TABLE IF EXISTS "PregnancyCheckup";
    END IF;
END
$$;
