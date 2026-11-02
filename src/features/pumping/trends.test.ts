import { describe, expect, it } from "vitest";
import { pumpingTrends, pumpingTrendWindow } from "./trends";

const now = new Date("2026-11-02T08:00:00Z");
const zone = "Asia/Ho_Chi_Minh";
const pump = (date: string, amount: number | null, isRunning = false) => ({ startTime: new Date(date), leftAmountMl: amount, rightAmountMl: null, isRunning });

describe("pumping trends", () => {
  it("uses local dates, excludes today, and keeps absent, pending and zero distinct", () => {
    const result = pumpingTrends(now, zone, [
      pump("2026-10-31T17:15:00Z", 0), // Nov 1 locally
      pump("2026-10-31T12:00:00Z", null),
      pump("2026-10-30T12:00:00Z", 50, true),
      pump("2026-11-02T01:00:00Z", 300),
    ], []);
    expect(result.rows.at(-1)).toMatchObject({ day: "2026-11-01", pumpedMl: 0, count: 1 });
    expect(result.rows.at(-2)).toMatchObject({ pumpedMl: null, pending: 1 });
    expect(result.rows.at(-3)).toMatchObject({ pumpedMl: null, count: 0 });
    expect(result.current).toMatchObject({ totalMl: 0, recordedDays: 1, pending: 1 });
    expect(result.changePercent).toBeNull();
  });
  it("compares two fully logged periods without dividing by zero", () => {
    const { days } = pumpingTrendWindow(now, zone);
    const entries = days.map((day, index) => pump(`${day}T05:00:00Z`, index < 7 ? 100 : 150));
    expect(pumpingTrends(now, zone, entries, []).changePercent).toBe(50);
    entries[0].leftAmountMl = null;
    expect(pumpingTrends(now, zone, entries, []).changePercent).toBeNull();
    entries.forEach((item) => { item.leftAmountMl = 0; });
    expect(pumpingTrends(now, zone, entries, []).changePercent).toBeNull();
  });
  it("counts only explicitly measured breast milk bottle feeds", () => {
    const result = pumpingTrends(now, zone, [], [
      { startTime: new Date("2026-11-01T01:00:00Z"), type: "BOTTLE_BREAST_MILK", amountMl: 80 },
      { startTime: new Date("2026-11-01T02:00:00Z"), type: "FORMULA", amountMl: 100 },
      { startTime: new Date("2026-11-01T03:00:00Z"), type: "MIXED", amountMl: 100 },
      { startTime: new Date("2026-11-01T04:00:00Z"), type: "BOTTLE_BREAST_MILK", amountMl: null },
    ]);
    expect(result.rows.at(-1)).toMatchObject({ bottleMl: 80, bottlePending: 1 });
    expect(result.rows[0].bottleMl).toBeNull();
  });
  it("uses calendar days through daylight saving and year boundaries", () => {
    const dst = pumpingTrendWindow(new Date("2026-11-02T15:00:00Z"), "America/New_York");
    expect(dst.days.at(-1)).toBe("2026-11-01");
    expect(dst.end.toISOString()).toBe("2026-11-02T05:00:00.000Z");
    const year = pumpingTrendWindow(new Date("2027-01-02T02:00:00Z"), zone);
    expect(year.days[0]).toBe("2026-12-19");
    expect(year.days.at(-1)).toBe("2027-01-01");
  });
});
