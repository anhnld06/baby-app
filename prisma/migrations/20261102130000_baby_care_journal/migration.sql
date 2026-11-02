CREATE TABLE "BabyCareEntry" (
 "id" TEXT NOT NULL, "babyId" TEXT NOT NULL, "kind" TEXT NOT NULL,
 "occurredAt" TIMESTAMP(3) NOT NULL, "title" TEXT NOT NULL, "details" TEXT,
 "amount" TEXT, "mood" TEXT, "symptoms" TEXT, "durationMinutes" INTEGER,
 "completed" BOOLEAN NOT NULL DEFAULT false, "photoData" BYTEA, "photoMime" TEXT,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "BabyCareEntry_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "BabyCareEntry_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "BabyCareEntry_babyId_kind_occurredAt_idx" ON "BabyCareEntry"("babyId", "kind", "occurredAt");
