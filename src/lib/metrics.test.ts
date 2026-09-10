import { describe, expect, it } from "vitest";
import { averageCompletedDurationMinutes, averageGapMinutes, durationMinutes, longestDurationMinutes, totalDurationMinutes } from "@/lib/metrics";

const date = (minute: number) => new Date(`2026-09-08T00:${String(minute).padStart(2, "0")}:00.000Z`);

describe("tracking duration calculations", () => {
  it("calculates a completed duration", () => expect(durationMinutes(date(0), date(15), date(30))).toBe(15));
  it("uses now for an open session", () => expect(durationMinutes(date(0), null, date(20))).toBe(20));
  it("never returns a negative duration", () => expect(durationMinutes(date(20), date(10), date(30))).toBe(0));
  it("totals open and completed sessions", () => expect(totalDurationMinutes([{ startTime: date(0), endTime: date(10) }, { startTime: date(15), endTime: null }], date(30))).toBe(25));
  it("averages completed sessions only", () => expect(averageCompletedDurationMinutes([{ startTime: date(0), endTime: date(10) }, { startTime: date(15), endTime: date(35) }, { startTime: date(40), endTime: null }])).toBe(15));
  it("finds the longest session", () => expect(longestDurationMinutes([{ startTime: date(0), endTime: date(10) }, { startTime: date(15), endTime: date(35) }], date(40))).toBe(20));
  it("calculates average gap between sessions", () => expect(averageGapMinutes([{ startTime: date(0), endTime: date(10) }, { startTime: date(20), endTime: date(25) }, { startTime: date(40), endTime: date(45) }])).toBe(12.5));
});
