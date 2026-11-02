ALTER TABLE "BabyCareEntry" ADD COLUMN "milestoneKey" TEXT, ADD COLUMN "endedAt" TIMESTAMP(3), ADD COLUMN "expectedEndAt" TIMESTAMP(3);
CREATE UNIQUE INDEX "BabyCareEntry_babyId_milestoneKey_key" ON "BabyCareEntry"("babyId", "milestoneKey");
CREATE TABLE "BabyRoutineSettings" (
 "babyId" TEXT NOT NULL, "method" TEXT NOT NULL DEFAULT 'AUTO',
 "dayStart" TEXT NOT NULL DEFAULT '06:30', "dayEnd" TEXT NOT NULL DEFAULT '19:00',
 "feedingMinutes" INTEGER NOT NULL DEFAULT 25, "awakeMinutes" INTEGER NOT NULL DEFAULT 35,
 "sleepMinutes" INTEGER NOT NULL DEFAULT 120, "adaptToLogs" BOOLEAN NOT NULL DEFAULT true,
 "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "BabyRoutineSettings_pkey" PRIMARY KEY ("babyId"),
 CONSTRAINT "BabyRoutineSettings_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "NotificationRead" (
 "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "key" TEXT NOT NULL,
 "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "NotificationRead_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "NotificationRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "NotificationRead_userId_key_key" ON "NotificationRead"("userId", "key");
