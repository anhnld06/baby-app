import "server-only";

import { z } from "zod";
import { db } from "@/lib/db";

const responseSchema = z.object({
  standard: z.literal("WHO_2006"),
  engineVersion: z.string().min(1).max(100),
  weightAgeZ: z.number().nullable().optional(),
  heightAgeZ: z.number().nullable().optional(),
  weightHeightZ: z.number().nullable().optional(),
  bmiAgeZ: z.number().nullable().optional(),
  headAgeZ: z.number().nullable().optional(),
  flags: z.array(z.string().max(100)).max(20).default([]),
});

export function growthAgeInDays(dateOfBirth: Date, measuredAt: Date) {
  return Math.max(
    0,
    Math.floor((measuredAt.getTime() - dateOfBirth.getTime()) / 86_400_000),
  );
}

export function whoSex(gender: string) {
  if (gender === "MALE") return "1";
  if (gender === "FEMALE") return "2";
  return null;
}

export function whoAnthroConfig() {
  const development = process.env.NODE_ENV !== "production";
  const baseUrl = (
    process.env.WHO_ANTHRO_URL || (development ? "http://localhost:8082" : "")
  ).replace(/\/$/, "");
  const token =
    process.env.WHO_ANTHRO_TOKEN || (development ? "change-this-token" : "");
  return { baseUrl, token, configured: Boolean(baseUrl && token) };
}

export async function refreshWhoGrowthAssessment(growthEntryId: string) {
  const { baseUrl, token, configured } = whoAnthroConfig();
  if (!configured) return { status: "unconfigured" as const };

  const entry = await db.growthEntry.findUnique({
    where: { id: growthEntryId },
    include: { baby: { select: { gender: true, dateOfBirth: true } } },
  });
  if (!entry) return { status: "missing" as const };
  const sex = whoSex(entry.baby.gender);
  const ageInDays = growthAgeInDays(entry.baby.dateOfBirth, entry.measuredAt);
  if (!sex || ageInDays >= 1_857) return { status: "unsupported" as const };

  const response = await fetch(`${baseUrl}/assess`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sex,
      ageInDays,
      weightKg: entry.weightKg,
      lengthHeightCm: entry.heightCm,
      measure:
        entry.measurementPosition === "RECUMBENT"
          ? "L"
          : entry.measurementPosition === "STANDING"
            ? "H"
            : null,
      headCircumferenceCm: entry.headCircumferenceCm,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) throw new Error(`WHO Anthro returned ${response.status}`);
  const result = responseSchema.parse(await response.json());
  await db.growthAssessment.upsert({
    where: { growthEntryId: entry.id },
    create: {
      growthEntryId: entry.id,
      standard: result.standard,
      engineVersion: result.engineVersion,
      weightAgeZ: result.weightAgeZ,
      heightAgeZ: result.heightAgeZ,
      weightHeightZ: result.weightHeightZ,
      bmiAgeZ: result.bmiAgeZ,
      headAgeZ: result.headAgeZ,
      flags: result.flags,
    },
    update: {
      standard: result.standard,
      engineVersion: result.engineVersion,
      weightAgeZ: result.weightAgeZ,
      heightAgeZ: result.heightAgeZ,
      weightHeightZ: result.weightHeightZ,
      bmiAgeZ: result.bmiAgeZ,
      headAgeZ: result.headAgeZ,
      flags: result.flags,
      computedAt: new Date(),
    },
  });
  return { status: "calculated" as const };
}
