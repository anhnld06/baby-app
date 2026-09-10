-- CreateEnum
CREATE TYPE "ToothPosition" AS ENUM ('UPPER_RIGHT_CENTRAL_INCISOR', 'UPPER_RIGHT_LATERAL_INCISOR', 'UPPER_RIGHT_CANINE', 'UPPER_RIGHT_FIRST_MOLAR', 'UPPER_RIGHT_SECOND_MOLAR', 'UPPER_LEFT_CENTRAL_INCISOR', 'UPPER_LEFT_LATERAL_INCISOR', 'UPPER_LEFT_CANINE', 'UPPER_LEFT_FIRST_MOLAR', 'UPPER_LEFT_SECOND_MOLAR', 'LOWER_LEFT_CENTRAL_INCISOR', 'LOWER_LEFT_LATERAL_INCISOR', 'LOWER_LEFT_CANINE', 'LOWER_LEFT_FIRST_MOLAR', 'LOWER_LEFT_SECOND_MOLAR', 'LOWER_RIGHT_CENTRAL_INCISOR', 'LOWER_RIGHT_LATERAL_INCISOR', 'LOWER_RIGHT_CANINE', 'LOWER_RIGHT_FIRST_MOLAR', 'LOWER_RIGHT_SECOND_MOLAR');

-- CreateTable
CREATE TABLE "ToothRecord" (
    "id" TEXT NOT NULL,
    "babyId" TEXT NOT NULL,
    "position" "ToothPosition" NOT NULL,
    "eruptedAt" DATE NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ToothRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "stage" "KnowledgeStage",
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "durationMinutes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ToothRecord_babyId_idx" ON "ToothRecord"("babyId");

-- CreateIndex
CREATE UNIQUE INDEX "ToothRecord_babyId_position_key" ON "ToothRecord"("babyId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Story_slug_key" ON "Story"("slug");

-- CreateIndex
CREATE INDEX "Story_stage_idx" ON "Story"("stage");

-- AddForeignKey
ALTER TABLE "ToothRecord" ADD CONSTRAINT "ToothRecord_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;
