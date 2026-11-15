import { describe, expect, it } from "vitest";
import { compareFeeding, feedingReference, feedingTotals } from "./reference";
const birth = new Date("2026-08-01T00:00:00Z");
const weight = { weightKg: 5, measuredAt: new Date("2026-09-25T00:00:00Z") };
describe("feeding references", () => {
  it("selects age-specific frequency and calculates formula volume from a recent weight", () => {
    expect(feedingReference(birth, "2026-10-01", 40, weight)).toMatchObject({ feeds: { min: 6, max: 8 }, volume: { min: 750, max: 1000 } });
    expect(feedingReference(birth, "2026-12-01", 40).feeds).toEqual({ min: 4, max: 6 });
    expect(feedingReference(birth, "2026-08-03", 40).feeds).toEqual({ min: 8, max: 12 });
  });
  it("does not apply daily formula ranges to the first week, preterm babies, future birth dates or babies aged 6 months", () => {
    for (const [day, weeks] of [["2026-08-03", 40], ["2026-10-01", 35], ["2026-07-31", 40], ["2027-02-01", 40]] as const) {
      expect(feedingReference(birth, day, weeks, weight).volume).toBeNull();
    }
  });
  it("rejects missing, stale, future and invalid weights", () => {
    expect(feedingReference(birth, "2026-10-01", 40).volume).toBeNull();
    for (const w of [{ ...weight, measuredAt: new Date("2026-08-01") }, { ...weight, measuredAt: new Date("2026-10-02") }, { ...weight, weightKg: 0 }]) {
      expect(feedingReference(birth, "2026-10-01", 40, w).volume).toBeNull();
    }
  });
  it("includes recorded mixed bottle volumes without estimating direct breastfeeding", () => {
    expect(feedingTotals([
      { type: "MIXED", amountMl: 80, endTime: new Date() },
      { type: "BREASTFEEDING", amountMl: null, endTime: null },
      { type: "FORMULA", amountMl: null, endTime: null },
      { type: "FORMULA", amountMl: 0, endTime: null },
    ])).toEqual({ count: 4, ml: 80, direct: true, formulaOnly: false, pending: 1, active: true });
  });
  it("only compares eligible completed logs and reports differences to the nearest boundary", () => {
    const range = { min: 750, max: 1000 };
    expect(compareFeeding(100, range, false).status).toBe("unknown");
    expect(compareFeeding(700, range, true)).toEqual({ status: "low", delta: 50 });
    expect(compareFeeding(1050, range, true)).toEqual({ status: "high", delta: 50 });
    expect(compareFeeding(750, range, true).status).toBe("within");
    expect(compareFeeding(1000, range, true).status).toBe("within");
    expect(compareFeeding(800, null, true).status).toBe("unknown");
  });
});
