import type { SafetyLevel } from "@/features/ai/types";

export type SafetyAssessment = { level: SafetyLevel; shouldSeekMedicalCare: boolean; matchedRuleIds: string[] };

type SafetyContext = { babyAgeDays?: number };

type VerifiedRule = {
  id: string;
  level: SafetyLevel;
  sourceUrl: string;
  reviewedAt: string;
  matches: (normalizedQuestion: string, context: SafetyContext) => boolean;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d")
    .toLowerCase();
}

const includesAny = (value: string, phrases: string[]) =>
  phrases.some((phrase) => value.includes(phrase));

// Source: NHS, "When to get urgent medical help for babies and children under 5".
// Cross-checked with WHO newborn danger signs. Reviewed 2026-09-11. These rules
// intentionally cover only unambiguous wording and must remain conservative.
const verifiedRules: ReadonlyArray<VerifiedRule> = [
  {
    id: "breathing-or-blue-color",
    level: "EMERGENCY",
    sourceUrl: "https://www.nhs.uk/baby/health/when-to-get-urgent-medical-help-for-babies-and-children-under-5/",
    reviewedAt: "2026-09-11",
    matches: (question) => includesAny(question, [
      "khong tho", "ngung tho", "kho tho", "tho rat nhanh", "rut lom long nguc",
      "tim tai", "tim moi", "tim mat", "not breathing", "stopped breathing",
      "difficulty breathing", "trouble breathing", "blue lips", "blue face",
    ]),
  },
  {
    id: "seizure-or-unresponsive",
    level: "EMERGENCY",
    sourceUrl: "https://www.nhs.uk/baby/health/when-to-get-urgent-medical-help-for-babies-and-children-under-5/",
    reviewedAt: "2026-09-11",
    matches: (question) => includesAny(question, [
      "co giat", "bat tinh", "khong danh thuc", "khong tinh", "li bi khong goi day",
      "seizure", "fit", "unconscious", "unresponsive", "cannot wake", "won't wake",
    ]),
  },
  {
    id: "newborn-danger-sign",
    level: "URGENT",
    sourceUrl: "https://www.who.int/news-room/fact-sheets/detail/newborn-mortality",
    reviewedAt: "2026-09-11",
    matches: (question, context) =>
      context.babyAgeDays !== undefined &&
      context.babyAgeDays <= 28 &&
      includesAny(question, [
        "bo bu", "bu kem", "khong bu", "sot", "lanh bat thuong", "giam hoat dong",
        "not feeding", "feeding poorly", "fever", "feels cold", "reduced activity",
      ]),
  },
];

export function assessSafety(question: string, context: SafetyContext = {}): SafetyAssessment {
  const normalizedQuestion = normalize(question);
  const matched = verifiedRules.filter((rule) => rule.matches(normalizedQuestion, context));
  const order: SafetyLevel[] = ["NORMAL", "MONITOR", "CONTACT_DOCTOR", "URGENT", "EMERGENCY"];
  const level = matched.reduce<SafetyLevel>((current, rule) => order.indexOf(rule.level) > order.indexOf(current) ? rule.level : current, "NORMAL");
  return { level, shouldSeekMedicalCare: order.indexOf(level) >= order.indexOf("CONTACT_DOCTOR"), matchedRuleIds: matched.map((rule) => rule.id) };
}
