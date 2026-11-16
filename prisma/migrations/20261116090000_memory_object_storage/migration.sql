-- Additive only: new memory media is stored in object storage (Neon Object Storage).
-- Existing inline media (mediaData) is kept until it is copied by scripts/migrate-memory-media-to-object-storage.mjs.
ALTER TABLE "BabyMemory" ADD COLUMN "mediaKey" TEXT,
ADD COLUMN "mediaSize" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "BabyMemory_mediaKey_key" ON "BabyMemory"("mediaKey");
