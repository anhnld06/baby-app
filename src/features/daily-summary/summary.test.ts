import { describe, expect, it } from "vitest";
import { loggedSleepMinutes } from "./summary";

const start = new Date("2026-11-01T12:00:00Z");
const end = new Date("2026-11-02T12:00:00Z");
describe("daily summary", () => {
  it("clips sleep to the last 24 hours and merges overlapping records", () => {
    expect(loggedSleepMinutes([
      { startTime: new Date("2026-11-01T10:00:00Z"), endTime: new Date("2026-11-01T14:00:00Z") },
      { startTime: new Date("2026-11-01T13:00:00Z"), endTime: new Date("2026-11-01T15:00:00Z") },
      { startTime: new Date("2026-11-02T11:00:00Z"), endTime: null },
      { startTime: new Date("2026-11-02T13:00:00Z"), endTime: null },
    ], start, end)).toBe(240);
  });
  it("leaves empty sleep logs at zero and ignores inverted records", () => {
    expect(loggedSleepMinutes([], start, end)).toBe(0);
    expect(loggedSleepMinutes([{ startTime: end, endTime: start }], start, end)).toBe(0);
  });
});
