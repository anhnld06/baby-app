import { describe, it, expect } from "vitest";
import { dailyCareStats } from "./stats";
const d = (s: string) => new Date(s);
describe("daily care statistics", () => {
  it("distinguishes unlogged days, measured zero, missing ml and mixed bottle amounts", () => {
    const rows = dailyCareStats(
      d("2026-11-02T08:00:00Z"),
      3,
      "Asia/Ho_Chi_Minh",
      [
        { startTime: d("2026-11-01T03:00Z"), type: "FORMULA", amountMl: 0 },
        { startTime: d("2026-11-02T03:00Z"), type: "MIXED", amountMl: 30 },
        { startTime: d("2026-11-02T04:00Z"), type: "FORMULA", amountMl: null },
        {
          startTime: d("2026-11-02T05:00Z"),
          type: "BREASTFEEDING",
          amountMl: null,
        },
      ],
      [],
      [],
    );
    expect(rows.map((r) => r.milk)).toEqual([null, 0, 30]);
    expect(rows[2]).toMatchObject({ feeds: 3, missingMilk: 1, current: true });
  });
  it("splits cross-midnight sleep and clips active sleep to now", () => {
    const rows = dailyCareStats(
      d("2026-11-02T01:00Z"),
      2,
      "Asia/Ho_Chi_Minh",
      [],
      [
        { startTime: d("2026-11-01T16:00Z"), endTime: d("2026-11-01T18:00Z") },
        { startTime: d("2026-11-02T00:00Z"), endTime: null },
      ],
      [{ changedAt: d("2026-11-01T17:00Z") }],
    );
    expect(rows.map((r) => r.sleep)).toEqual([1, 2]);
    expect(rows.map((r) => r.diapers)).toEqual([null, 1]);
  });
  it("uses a 25 hour local day when daylight saving ends", () => {
    const rows = dailyCareStats(
      d("2026-11-02T05:00Z"),
      2,
      "America/New_York",
      [],
      [{ startTime: d("2026-11-01T04:00Z"), endTime: d("2026-11-02T05:00Z") }],
      [],
    );
    expect(rows[0].sleep).toBe(25);
    expect(rows[1].sleep).toBeNull();
  });
});
