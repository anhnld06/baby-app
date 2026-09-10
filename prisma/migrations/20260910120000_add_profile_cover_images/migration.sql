CREATE TABLE "MotherProfileCover" (
    "motherId" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "mimeType" VARCHAR(32) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MotherProfileCover_pkey" PRIMARY KEY ("motherId")
);

CREATE TABLE "BabyProfileCover" (
    "babyId" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "mimeType" VARCHAR(32) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BabyProfileCover_pkey" PRIMARY KEY ("babyId")
);

ALTER TABLE "MotherProfileCover"
ADD CONSTRAINT "MotherProfileCover_motherId_fkey"
FOREIGN KEY ("motherId") REFERENCES "Mother"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BabyProfileCover"
ADD CONSTRAINT "BabyProfileCover_babyId_fkey"
FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;
