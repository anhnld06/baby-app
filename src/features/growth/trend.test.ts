import { describe, expect, it } from "vitest";
import { buildGrowthSeries, chartCoordinates, correctedAgeInDays, growthChange } from "@/features/growth/trend";

describe("growth trend", () => {
  const birth = new Date("2026-01-01T00:00:00.000Z");

  it("filters missing values and sorts measurements chronologically", () => {
    const series = buildGrowthSeries([
      { measuredAt: new Date("2026-02-01T00:00:00.000Z"), weightKg: 4.2, heightCm: null, headCircumferenceCm: null },
      { measuredAt: new Date("2026-01-15T00:00:00.000Z"), weightKg: 3.8, heightCm: null, headCircumferenceCm: null },
      { measuredAt: new Date("2026-03-01T00:00:00.000Z"), weightKg: null, heightCm: 58, headCircumferenceCm: null },
    ], birth, "weightKg");

    expect(series.map((point) => point.value)).toEqual([3.8, 4.2]);
    expect(growthChange(series)).toBeCloseTo(0.4);
  });

  it("produces finite chart positions for a single measurement", () => {
    const series = buildGrowthSeries([
      { measuredAt: birth, weightKg: 3.4, heightCm: null, headCircumferenceCm: null },
    ], birth, "weightKg");
    const [point] = chartCoordinates(series);

    expect(Number.isFinite(point.x)).toBe(true);
    expect(Number.isFinite(point.y)).toBe(true);
  });

  it("uses corrected age for a premature baby during the first two years", () => {
    expect(correctedAgeInDays(birth, new Date("2026-03-26T00:00:00.000Z"), 32)).toBe(28);
    expect(correctedAgeInDays(birth, new Date("2028-01-01T00:00:00.000Z"), 32)).toBe(730);
  });

  it("counts age in the account timezone calendar day", () => {
    const dateOfBirth = new Date("2026-01-01T00:00:00.000Z");
    // 2026-01-10 23:30 UTC is already 2026-01-11 in Vietnam.
    const measuredAt = new Date("2026-01-10T23:30:00.000Z");
    expect(correctedAgeInDays(dateOfBirth, measuredAt, null, "UTC")).toBe(9);
    expect(correctedAgeInDays(dateOfBirth, measuredAt, null, "Asia/Ho_Chi_Minh")).toBe(10);
    expect(buildGrowthSeries([{ measuredAt, weightKg: 3.6, heightCm: null, headCircumferenceCm: null }], dateOfBirth, "weightKg", null, "Asia/Ho_Chi_Minh")[0].ageDays).toBe(10);
  });
});
