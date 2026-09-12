import { NextResponse } from "next/server";
import { z } from "zod";
import { getAIProvider } from "@/features/ai/provider";
import { retrieveKnowledge } from "@/features/ai/retrieval";
import { assessSafety } from "@/features/ai/rule-engine";
import { selectRelevantPregnancy } from "@/features/mother/pregnancy";
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
      include: { pregnancies: { orderBy: { createdAt: "desc" } } },
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
      postpartum: selectRelevantPregnancy(mother?.pregnancies ?? [])?.pregnancyStatus === "DELIVERED",
    };
    const safety = assessSafety(input.question, { babyAgeDays: context.babyAgeDays });
    if (safety.level === "EMERGENCY" || safety.level === "URGENT") {
      const isVietnamese = input.locale === "vi";
      return NextResponse.json({
        answer: isVietnamese
          ? safety.level === "EMERGENCY"
            ? "Dấu hiệu bạn mô tả có thể là tình huống cấp cứu. Hãy gọi dịch vụ cấp cứu tại nơi bạn sống hoặc đưa người bệnh đến khoa cấp cứu ngay. Đừng chờ câu trả lời trực tuyến."
            : "Với trẻ sơ sinh, dấu hiệu bạn mô tả cần được nhân viên y tế đánh giá khẩn. Hãy liên hệ cơ sở y tế hoặc đưa bé đi khám ngay."
          : safety.level === "EMERGENCY"
            ? "The signs you described may be an emergency. Call your local emergency service or go to an emergency department now. Do not wait for an online answer."
            : "For a newborn, the sign you described needs urgent medical assessment. Contact a medical service or take the baby for care now.",
        evidenceLevel: "STRONG",
        sources: [{
          title: safety.level === "EMERGENCY" ? "When to get urgent medical help for babies and children under 5" : "Newborn mortality: danger signs",
          organization: safety.level === "EMERGENCY" ? "NHS" : "WHO",
          url: safety.level === "EMERGENCY"
            ? "https://www.nhs.uk/baby/health/when-to-get-urgent-medical-help-for-babies-and-children-under-5/"
            : "https://www.who.int/news-room/fact-sheets/detail/newborn-mortality",
          evidenceLevel: "STRONG",
        }],
        safetyLevel: safety.level,
        shouldSeekMedicalCare: true,
      });
    }
    const retrieved = await retrieveKnowledge(input.question, context.babyAgeDays);
    const providerAnswer = await getAIProvider().answer({
      question: input.question,
      context,
      locale: input.locale,
      ...retrieved,
    });
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
