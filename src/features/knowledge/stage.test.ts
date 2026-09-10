import { describe, expect, it } from "vitest";
import { stageForAge } from "@/features/knowledge/stage";

describe("age-aware knowledge routing", () => {
  it.each([
    [0, "NEWBORN_0_28_DAYS"],
    [28, "NEWBORN_0_28_DAYS"],
    [29, "INFANT_1_3_MONTHS"],
    [92, "INFANT_3_6_MONTHS"],
    [183, "INFANT_6_12_MONTHS"],
    [366, "TODDLER"],
  ] as const)("routes age %i days to %s", (days, expected) => {
    expect(stageForAge(days)).toBe(expected);
  });
});
