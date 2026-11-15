import "server-only";

import { ageInDays } from "@/lib/date";
import { db } from "@/lib/db";
import { calculateWho, whoAgeSupported, type WhoInput } from "./who-local";

export function growthAgeInDays(dateOfBirth: Date, measuredAt: Date, timeZone?: string) {
  // Do not turn a pre-birth measurement into a valid newborn measurement.
  if (timeZone && measuredAt >= dateOfBirth) return ageInDays(dateOfBirth, measuredAt, timeZone);
  return Math.floor((measuredAt.getTime() - dateOfBirth.getTime()) / 86_400_000);
}

export function whoSex(gender: string) {
  if (gender === "MALE") return "1";
  if (gender === "FEMALE") return "2";
  return null;
}

export function whoEntryInput(entry: {
  measuredAt: Date; weightKg: number | null; heightCm: number | null; headCircumferenceCm: number | null; measurementPosition: string | null;
  baby: { gender: string; dateOfBirth: Date; gestationalAgeAtBirth: number | null; user?: { timezone: string } };
}, timeZone?: string): { input: WhoInput | null; reason: "sex" | "age" | "preterm" | null } {
  const sex = whoSex(entry.baby.gender);
  if (!sex) return { input: null, reason: "sex" };
  const ageInDays = growthAgeInDays(entry.baby.dateOfBirth, entry.measuredAt, timeZone ?? entry.baby.user?.timezone);
  if (!whoAgeSupported(ageInDays)) return { input: null, reason: "age" };
  // Preterm charts/corrected ages need a separate clinical policy. Do not label
  // preterm babies with chronological-age term-infant standards.
  if (entry.baby.gestationalAgeAtBirth != null && entry.baby.gestationalAgeAtBirth < 37) return { input: null, reason: "preterm" };
  return { reason: null, input: {
    sex, ageInDays, weightKg: entry.weightKg, lengthHeightCm: entry.heightCm,
    headCircumferenceCm: entry.headCircumferenceCm,
    measure: entry.measurementPosition === "RECUMBENT" ? "L" : entry.measurementPosition === "STANDING" ? "H" : null,
  } };
}

export async function refreshWhoGrowthAssessment(growthEntryId: string) {
  const entry = await db.growthEntry.findUnique({ where: { id: growthEntryId }, include: { baby: { select: { gender: true, dateOfBirth: true, gestationalAgeAtBirth: true, user: { select: { timezone: true } } } } } });
  if (!entry) return { status: "missing" as const };
  const { input, reason } = whoEntryInput(entry);
  if (!input) {
    await db.growthAssessment.deleteMany({ where: { growthEntryId } });
    return { status: "unsupported" as const, reason };
  }
  const result = calculateWho(input);
  if ([result.weightAgeZ, result.heightAgeZ, result.headAgeZ, result.weightHeightZ, result.bmiAgeZ].every(z => z == null)) {
    await db.growthAssessment.deleteMany({ where: { growthEntryId } });
    return { status: "empty" as const };
  }
  await db.growthAssessment.upsert({
    where: { growthEntryId: entry.id },
    create: { growthEntryId: entry.id, ...result },
    update: { ...result, computedAt: new Date() },
  });
  return { status: "calculated" as const };
}
