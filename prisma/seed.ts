import {
  DiaperType,
  FeedingType,
  Gender,
  PregnancyStatus,
  PrismaClient,
  SleepType,
} from "@prisma/client";
import { curatedArticles } from "../src/features/knowledge/articles";
import { curatedStories } from "../src/features/stories/stories";

const prisma = new PrismaClient();

const ids = {
  user: "demo-user",
  mother: "demo-mother",
  pregnancy: "demo-pregnancy",
  baby: "demo-baby-vani",
};

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

async function main() {
  const user = await prisma.user.upsert({
    where: { username: "demo" },
    update: { name: "Gia đình Vani", timezone: "Asia/Bangkok", locale: "vi" },
    create: {
      id: ids.user,
      name: "Gia đình Vani",
      username: "demo",
      email: "demo@baby.local",
      timezone: "Asia/Bangkok",
      locale: "vi",
    },
  });

  const mother = await prisma.mother.upsert({
    where: { userId: user.id },
    update: { name: "Mẹ của Vani" },
    create: { id: ids.mother, userId: user.id, name: "Mẹ của Vani" },
  });

  await prisma.pregnancy.upsert({
    where: { id: ids.pregnancy },
    update: {},
    create: {
      id: ids.pregnancy,
      motherId: mother.id,
      actualDeliveryDate: new Date("2026-08-28T00:00:00.000Z"),
      pregnancyStatus: PregnancyStatus.DELIVERED,
    },
  });

  const baby = await prisma.baby.upsert({
    where: { id: ids.baby },
    update: {
      name: "Nguyễn Thanh Giang",
      nickname: "Vani",
      dateOfBirth: new Date("2026-08-28T00:00:00.000Z"),
    },
    create: {
      id: ids.baby,
      userId: user.id,
      name: "Nguyễn Thanh Giang",
      nickname: "Vani",
      gender: Gender.FEMALE,
      dateOfBirth: new Date("2026-08-28T00:00:00.000Z"),
      birthWeightKg: 3.2,
      birthLengthCm: 50,
      birthHeadCircumferenceCm: 34,
    },
  });

  const existingEvents = await prisma.feeding.count({ where: { babyId: baby.id } });
  if (existingEvents === 0) {
    await prisma.$transaction([
      prisma.feeding.create({
        data: {
          babyId: baby.id,
          type: FeedingType.BREASTFEEDING,
          startTime: hoursAgo(2),
          endTime: hoursAgo(1.65),
          leftBreastDuration: 12,
          rightBreastDuration: 9,
        },
      }),
      prisma.feeding.create({
        data: {
          babyId: baby.id,
          type: FeedingType.BOTTLE_BREAST_MILK,
          startTime: hoursAgo(5),
          endTime: hoursAgo(4.8),
          amountMl: 70,
        },
      }),
      prisma.sleepEntry.create({
        data: {
          babyId: baby.id,
          startTime: hoursAgo(4.5),
          endTime: hoursAgo(2.5),
          type: SleepType.NAP,
          location: "Nôi",
        },
      }),
      prisma.diaperEntry.create({
        data: { babyId: baby.id, changedAt: hoursAgo(1), type: DiaperType.WET },
      }),
      prisma.diaperEntry.create({
        data: {
          babyId: baby.id,
          changedAt: hoursAgo(4),
          type: DiaperType.BOTH,
          stoolColor: "Vàng",
          consistency: "Mềm",
        },
      }),
      prisma.growthEntry.create({
        data: {
          babyId: baby.id,
          measuredAt: hoursAgo(24),
          weightKg: 3.35,
          heightCm: 50.5,
          headCircumferenceCm: 34.2,
        },
      }),
      prisma.vaccinationRecord.create({
        data: {
          babyId: baby.id,
          vaccineName: "Viêm gan B (mũi 1)",
          doseNumber: 1,
          administeredAt: hoursAgo(24),
          facility: "Bệnh viện Từ Dũ",
        },
      }),
      prisma.prescription.create({
        data: {
          babyId: baby.id,
          prescribedBy: "BS. Nguyễn Văn A",
          diagnosis: "Vàng da sinh lý",
          issuedAt: hoursAgo(24),
          items: {
            create: [
              { medicineName: "Vitamin D3", dosage: "400 IU", frequency: "1 lần/ngày", durationDays: 30 },
            ],
          },
        },
      }),
    ]);
  }

  await prisma.knowledgeArticle.deleteMany({
    where: { slug: { startsWith: "demo-" } },
  });

  for (const article of curatedArticles) {
    const { sources, ...articleData } = article;
    const saved = await prisma.knowledgeArticle.upsert({
      where: { slug: article.slug },
      update: articleData,
      create: articleData,
    });

    await prisma.$transaction([
      prisma.knowledgeSource.deleteMany({ where: { articleId: saved.id } }),
      prisma.knowledgeChunk.deleteMany({ where: { articleId: saved.id } }),
      prisma.knowledgeSource.createMany({
        data: sources.map((source) => ({ ...source, articleId: saved.id })),
      }),
      prisma.knowledgeChunk.create({
        data: {
          articleId: saved.id,
          content: `${article.title}\n${article.summary}\n${article.content}`,
          metadata: {
            curated: true,
            stage: article.stage,
            category: article.category,
          },
        },
      }),
    ]);
  }

  for (const story of curatedStories) {
    await prisma.story.upsert({
      where: { slug: story.slug },
      update: story,
      create: story,
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error instanceof Error ? error.message : "Seed failed");
    await prisma.$disconnect();
    process.exit(1);
  });
