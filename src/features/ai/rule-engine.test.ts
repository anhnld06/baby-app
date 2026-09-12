import { describe, expect, it } from "vitest";
import { assessSafety } from "@/features/ai/rule-engine";

describe("assistant safety rules", () => {
  it.each([
    "Bé khó thở và tím môi",
    "baby stopped breathing",
    "Con co giật và không đánh thức được",
    "the baby is unresponsive",
  ])("marks an unambiguous emergency: %s", (question) => {
    const result = assessSafety(question, { babyAgeDays: 14 });
    expect(result.level).toBe("EMERGENCY");
    expect(result.shouldSeekMedicalCare).toBe(true);
    expect(result.matchedRuleIds.length).toBeGreaterThan(0);
  });

  it("treats poor feeding in a newborn as urgent", () => {
    expect(assessSafety("Bé bỏ bú", { babyAgeDays: 10 }).level).toBe("URGENT");
  });

  it("does not apply the newborn-only rule after the newborn period", () => {
    expect(assessSafety("Bé bú kém", { babyAgeDays: 90 }).level).toBe("NORMAL");
  });

  it("keeps ordinary knowledge questions normal", () => {
    expect(assessSafety("Khi nào bé bắt đầu ăn dặm?", { babyAgeDays: 120 }).level).toBe("NORMAL");
  });
});
