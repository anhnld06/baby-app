import { describe, expect, it } from "vitest";
import { analyzeCycles, averageCycleLength, estimatedFertileWindow, estimatedNextPeriod, gestationalAge, periodStartsFromFlowLogs } from "@/features/mother/insights";

describe("mother tracking insights", () => {
  it("calculates average cycle length and ignores implausible gaps", () => {
    const starts = ["2026-01-01", "2026-01-29", "2026-02-26", "2026-06-01"].map((date) => new Date(`${date}T00:00:00Z`));
    expect(averageCycleLength(starts)).toBe(28);
    expect(estimatedNextPeriod(starts)?.toISOString().slice(0, 10)).toBe("2026-06-29");
  });

  it("calculates gestational weeks and days", () => {
    expect(gestationalAge(new Date("2026-01-01T00:00:00Z"), new Date("2026-03-13T00:00:00Z"))).toEqual({ weeks: 10, days: 1 });
  });

  it("groups consecutive flow logs into period starts", () => {
    const dates = ["2026-01-01", "2026-01-02", "2026-01-28", "2026-01-29"].map((date) => new Date(`${date}T00:00:00Z`));
    expect(periodStartsFromFlowLogs(dates).map((date) => date.toISOString().slice(0, 10))).toEqual(["2026-01-01", "2026-01-28"]);
  });

  it("estimates the fertile window around 14 days before the next period", () => {
    const window = estimatedFertileWindow(new Date("2026-02-01T00:00:00Z"));
    expect(window?.ovulation.toISOString().slice(0, 10)).toBe("2026-01-18");
    expect(window?.start.toISOString().slice(0, 10)).toBe("2026-01-13");
    expect(window?.end.toISOString().slice(0, 10)).toBe("2026-01-19");
  });

  it("uses personal settings for a prediction after the first recorded period", () => {
    const starts = [new Date("2026-01-01T00:00:00Z")];
    expect(estimatedNextPeriod(starts, 30)?.toISOString().slice(0, 10)).toBe("2026-01-31");
  });

  it("flags cycle-length variation of eight days or more", () => {
    const starts = ["2026-01-01", "2026-01-27", "2026-03-02", "2026-03-30"].map((date) => new Date(`${date}T00:00:00Z`));
    expect(analyzeCycles(starts)).toMatchObject({ variationDays: 8, irregular: true, confidence: "LOW" });
  });

  it("adjusts estimated ovulation after a positive ovulation test", () => {
    const window = estimatedFertileWindow(
      new Date("2026-02-01T00:00:00Z"),
      14,
      new Date("2026-01-16T00:00:00Z"),
    );
    expect(window?.ovulation.toISOString().slice(0, 10)).toBe("2026-01-17");
  });
});
