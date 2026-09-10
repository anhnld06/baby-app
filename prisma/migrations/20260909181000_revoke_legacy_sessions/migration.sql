-- Sessions created before env-only authentication used a different token hash.
-- Revoking them also guarantees that previously registered accounts lose access.
DELETE FROM "Session";
