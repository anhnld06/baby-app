import { NextResponse } from "next/server";
import { z } from "zod";
import { getAIProvider } from "@/features/ai/provider";
import { retrieveKnowledge } from "@/features/ai/retrieval";
import { assessSafety } from "@/features/ai/rule-engine";
import type { AssistantContext } from "@/features/ai/types";
import { getCurrentUser } from "@/lib/auth";
import { ageInDays } from "@/lib/date";
import { db } from "@/lib/db";
import { totalDurationMinutes } from "@/lib/metrics";

const requestSchema = z.object({
  question: z.string().trim().min(3).max(1000),
  motherId: z.string().optional(),
  babyId: z.string().optional(),
  locale: z.enum(["vi", "en"]).default("vi"),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const input = requestSchema.parse(await request.json());
    const baby = await db.baby.findFirst({
      where: { userId: user.id, ...(input.babyId ? { id: input.babyId } : {}) },
    });
    const mother = await db.mother.findFirst({
      where: {
        userId: user.id,
        ...(input.motherId ? { id: input.motherId } : {}),
      },
      include: { pregnancies: { orderBy: { createdAt: "desc" }, take: 1 } },
    });
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [growth, feedings, sleeps, diapers] = baby
      ? await Promise.all([
          db.growthEntry.findFirst({
            where: { babyId: baby.id },
            orderBy: { measuredAt: "desc" },
          }),
          db.feeding.findMany({
            where: { babyId: baby.id, startTime: { gte: since } },
          }),
          db.sleepEntry.findMany({
            where: { babyId: baby.id, startTime: { gte: since } },
          }),
          db.diaperEntry.findMany({
            where: { babyId: baby.id, changedAt: { gte: since } },
          }),
        ])
      : [null, [], [], []];
    const context: AssistantContext = {
      babyAgeDays: baby ? ageInDays(baby.dateOfBirth) : undefined,
      latestGrowth: growth
        ? {
            weightKg: growth.weightKg,
            heightCm: growth.heightCm,
            headCircumferenceCm: growth.headCircumferenceCm,
          }
        : undefined,
      feedingCount24h: feedings.length,
      sleepMinutes24h: totalDurationMinutes(sleeps),
      wetDiapers24h: diapers.filter(
        (item) => item.type === "WET" || item.type === "BOTH",
      ).length,
      stoolDiapers24h: diapers.filter(
        (item) => item.type === "STOOL" || item.type === "BOTH",
      ).length,
      postpartum: mother?.pregnancies[0]?.pregnancyStatus === "DELIVERED",
    };
    const retrieved = await retrieveKnowledge(
      input.question,
      context.babyAgeDays,
    );
    const providerAnswer = await getAIProvider().answer({
      question: input.question,
      context,
      locale: input.locale,
      ...retrieved,
    });
    const safety = assessSafety(input.question);
    const knowledgeFallback = providerAnswer.evidenceLevel === "INSUFFICIENT";
    return NextResponse.json({
      ...providerAnswer,
      safetyLevel:
        knowledgeFallback && safety.level === "NORMAL"
          ? "CONTACT_DOCTOR"
          : safety.level,
      shouldSeekMedicalCare:
        knowledgeFallback || safety.shouldSeekMedicalCare,
    });
  } catch (error: unknown) {
    console.error(
      "Assistant request failed:",
      error instanceof Error
        ? `${error.name}: ${error.message}`
        : "Unknown error",
    );
    return NextResponse.json(
      { error: "Unable to answer safely" },
      { status: 400 },
    );
  }
}
