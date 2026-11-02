import { describe, expect, it } from "vitest";
import { pumpingChartData, pumpingChartPeriod } from "./chart";
const now = new Date("2026-11-02T08:00:00Z");
const zone = "Asia/Ho_Chi_Minh";
const entry = (id: string, startTime: string, leftAmountMl: number | null, rightAmountMl: number | null = null) => ({ id, startTime: new Date(startTime), leftAmountMl, rightAmountMl });

describe("pumping charts", () => {
  it("defaults to current local month and validates query dates", () => {
    const period = pumpingChartPeriod("invalid", "2026-02-30", now, zone);
    expect(period).toMatchObject({ mode: "month", anchor: "2026-11-02", firstKey: "2026-11-01", endKey: "2026-12-01", previous: "2026-10-01", next: "2026-12-01" });
    expect(period.start.toISOString()).toBe("2026-10-31T17:00:00.000Z");
  });
  it("handles leap years, year rollover and DST day lengths", () => {
    const feb = pumpingChartPeriod("month", "2024-02-29", now, zone);
    expect(pumpingChartData(feb, [], zone)).toHaveLength(29);
    expect(pumpingChartPeriod("month", "2026-12-31", now, zone).next).toBe("2027-01-01");
    const dst = pumpingChartPeriod("day", "2026-11-01", now, "America/New_York");
    expect((dst.end.getTime() - dst.start.getTime()) / 3600000).toBe(25);
  });
  it("distinguishes absent, zero, pending and partially measured days", () => {
    const period = pumpingChartPeriod("month", undefined, now, zone);
    const rows = pumpingChartData(period, [entry("1", "2026-10-31T17:15:00Z", 0), entry("2", "2026-11-02T02:00:00Z", 30, 40), entry("3", "2026-11-02T03:00:00Z", null)], zone);
    expect(rows[0]).toMatchObject({ totalMl: 0, measured: 1, pending: 0, recordedDays: 1 });
    expect(rows[1]).toMatchObject({ totalMl: 70, leftMl: 30, rightMl: 40, count: 2, measured: 1, pending: 1, partial: true });
    expect(rows[2]).toMatchObject({ totalMl: null, recordedDays: 0 });
  });
  it("keeps separate day sessions and excludes entries outside local boundaries", () => {
    const period = pumpingChartPeriod("day", "2026-11-02", now, zone);
    const rows = pumpingChartData(period, [entry("2", "2026-11-02T01:00:00Z", 40), entry("1", "2026-11-01T17:15:00Z", 30), entry("3", "2026-11-02T17:00:00Z", 100)], zone);
    expect(rows.map((row) => [row.key, row.label])).toEqual([["1", "00:15"], ["2", "08:00"]]);
  });
  it("counts unique measured days per month and preserves missing months", () => {
    const period = pumpingChartPeriod("year", "2026-11-02", now, zone);
    const rows = pumpingChartData(period, [entry("1", "2026-11-01T01:00:00Z", 10), entry("2", "2026-11-01T02:00:00Z", 20), entry("3", "2026-11-02T02:00:00Z", 30)], zone);
    expect(rows).toHaveLength(12);
    expect(rows[10]).toMatchObject({ totalMl: 60, count: 3, recordedDays: 2, partial: true });
    expect(rows[0].totalMl).toBeNull();
  });
});
