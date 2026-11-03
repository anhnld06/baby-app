import { describe, expect, it } from "vitest";
import { ageMonthsOn, matchesSupplement, supplementTopics } from "./supplements";

describe("supplement reference stages", () => {
  it("uses completed calendar months and rejects dates before birth", () => {
    const birth = new Date("2026-01-15T00:00Z");
    expect(ageMonthsOn(birth, "2026-07-14")).toBe(5);
    expect(ageMonthsOn(birth, "2026-07-15")).toBe(6);
    expect(ageMonthsOn(birth, "2025-12-31")).toBeUndefined();
    expect(ageMonthsOn(birth, "invalid")).toBeUndefined();
  });
  it("changes context at 6 and 12 months and limits the catalog to its sourced ages", () => {
    expect(supplementTopics(5)[1].context).toContain("Dưới 6 tháng");
    expect(supplementTopics(6)[1].context).toContain("thực phẩm giàu sắt");
    expect(supplementTopics(11)[0].context).toContain("Dưới 12 tháng");
    expect(supplementTopics(12)[0].context).toContain("12–23 tháng");
    expect(supplementTopics(23)).toHaveLength(2);
    expect(supplementTopics(24)).toEqual([]);
    expect(supplementTopics(undefined)).toEqual([]);
  });
  it("recognizes existing aliases without treating unrelated combination products as equivalent", () => {
    const vitaminD = supplementTopics(2)[0];
    expect(matchesSupplement(" Vitamin D3 ", vitaminD)).toBe(true);
    expect(matchesSupplement("Vitamin D + K2", vitaminD)).toBe(false);
  });
});
