CREATE TABLE "BabyMemory" (
 "id" TEXT NOT NULL, "babyId" TEXT NOT NULL, "title" TEXT NOT NULL,
 "letter" TEXT NOT NULL, "frame" TEXT NOT NULL, "occurredAt" TIMESTAMP(3) NOT NULL,
 "mediaData" BYTEA, "mediaMime" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "BabyMemory_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "BabyMemory_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "BabyMemory_babyId_occurredAt_idx" ON "BabyMemory"("babyId", "occurredAt");
