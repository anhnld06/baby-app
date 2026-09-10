import type { EvidenceLevel } from "@prisma/client";

export type SafetyLevel = "NORMAL" | "MONITOR" | "CONTACT_DOCTOR" | "URGENT" | "EMERGENCY";

export type AssistantSource = { title: string; organization: string; url: string; evidenceLevel: EvidenceLevel };

export type AssistantAnswer = {
  answer: string;
  evidenceLevel: EvidenceLevel | "INSUFFICIENT";
  sources: AssistantSource[];
  safetyLevel: SafetyLevel;
  shouldSeekMedicalCare: boolean;
};

export type AssistantContext = {
  babyAgeDays?: number;
  latestGrowth?: { weightKg: number | null; heightCm: number | null; headCircumferenceCm: number | null };
  feedingCount24h: number;
  sleepMinutes24h: number;
  wetDiapers24h: number;
  stoolDiapers24h: number;
  postpartum: boolean;
};
