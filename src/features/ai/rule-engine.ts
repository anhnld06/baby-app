import type { SafetyLevel } from "@/features/ai/types";

export type SafetyAssessment = { level: SafetyLevel; shouldSeekMedicalCare: boolean; matchedRuleIds: string[] };

// Intentionally empty until each medical red-flag rule has an authoritative
// source, version, reviewer and tests. The LLM cannot elevate or lower this result.
const verifiedRules: ReadonlyArray<{ id: string; matches: (question: string) => boolean; level: SafetyLevel }> = [];

export function assessSafety(question: string): SafetyAssessment {
  const matched = verifiedRules.filter((rule) => rule.matches(question));
  const order: SafetyLevel[] = ["NORMAL", "MONITOR", "CONTACT_DOCTOR", "URGENT", "EMERGENCY"];
  const level = matched.reduce<SafetyLevel>((current, rule) => order.indexOf(rule.level) > order.indexOf(current) ? rule.level : current, "NORMAL");
  return { level, shouldSeekMedicalCare: order.indexOf(level) >= order.indexOf("CONTACT_DOCTOR"), matchedRuleIds: matched.map((rule) => rule.id) };
}
