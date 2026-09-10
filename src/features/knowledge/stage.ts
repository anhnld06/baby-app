import type { KnowledgeStage } from "@prisma/client";

export function stageForAge(ageDays?: number): KnowledgeStage | undefined {
  if (ageDays === undefined) return undefined;
  if (ageDays <= 28) return "NEWBORN_0_28_DAYS";
  if (ageDays < 92) return "INFANT_1_3_MONTHS";
  if (ageDays < 183) return "INFANT_3_6_MONTHS";
  if (ageDays < 366) return "INFANT_6_12_MONTHS";
  return "TODDLER";
}
