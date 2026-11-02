import { describe, expect, it } from "vitest";
import { pumpingSchema, pumpingSummary } from "./pumping";
import { getLocalDayRange, zonedDateTimeToUtc } from "@/lib/date";

const base = { startTime: new Date("2026-01-01T10:00:00Z") };

describe("pumping journal", () => {
  it("accepts one side, zero yield, decimal amounts and blank optional fields", () => {
    expect(pumpingSchema.parse({ ...base, leftAmountMl: "0", rightAmountMl: "", durationMinutes: "", notes: "" })).toMatchObject({ leftAmountMl: 0, rightAmountMl: undefined, durationMinutes: undefined });
    expect(pumpingSchema.parse({ ...base, rightAmountMl: "42.5" }).rightAmountMl).toBe(42.5);
  });
  it("rejects empty volumes, negative values, invalid duration and future timestamps", () => {
    for (const change of [
      {}, { leftAmountMl: -1 }, { leftAmountMl: "NaN" }, { rightAmountMl: 3001 },
      { leftAmountMl: 1, durationMinutes: -1 }, { leftAmountMl: 1, durationMinutes: 1.5 },
      { leftAmountMl: 1, startTime: new Date(Date.now() + 60_000) },
    ]) expect(pumpingSchema.safeParse({ ...base, ...change }).success).toBe(false);
  });
  it("keeps zero-yield sessions in daily averages and handles empty days", () => {
    expect(pumpingSummary([{ leftAmountMl: 30, rightAmountMl: 40 }, { leftAmountMl: 0 }, { rightAmountMl: 20 }])).toEqual({ count: 3, totalMl: 90, averageMl: 30 });
    expect(pumpingSummary([{ leftAmountMl: 60 }, { leftAmountMl: null, rightAmountMl: null }])).toEqual({ count: 2, totalMl: 60, averageMl: 60 });
    expect(pumpingSummary([])).toEqual({ count: 0, totalMl: 0, averageMl: 0 });
  });
  it("attributes local late-night sessions to the correct day", () => {
    const time = zonedDateTimeToUtc("2026-01-02T00:15", "Asia/Ho_Chi_Minh");
    const { start, end } = getLocalDayRange(time, "Asia/Ho_Chi_Minh");
    expect(time.toISOString()).toBe("2026-01-01T17:15:00.000Z");
    expect(start.toISOString()).toBe("2026-01-01T17:00:00.000Z");
    expect(end.toISOString()).toBe("2026-01-02T17:00:00.000Z");
  });
});
