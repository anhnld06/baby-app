import { describe, expect, it } from "vitest";
import {
  ageInDays,
  formatAge,
  formatDateInputDisplay,
  formatDuration,
  getLocalDayRange,
  parseDateInputDisplay,
  toDateTimeLocal,
  zonedDateTimeToUtc,
} from "@/lib/date";

describe("date presentation", () => {
  it("formats minutes for Vietnamese", () => expect(formatDuration(135, "vi")).toBe("2g 15p"));
  it("returns newborn age in days", () => expect(formatAge(new Date("2026-08-28T00:00:00Z"), new Date("2026-09-08T00:00:00Z"), "vi")).toBe("11 ngày tuổi"));
  it("does not return a negative baby age", () => expect(ageInDays(new Date("2027-01-01"), new Date("2026-01-01"))).toBe(0));
  it("formats ISO dates as day/month/year", () => {
    expect(formatDateInputDisplay("2026-09-10")).toBe("10/09/2026");
    expect(formatDateInputDisplay("2026-09-10T03:15", true)).toBe("10/09/2026 03:15");
  });
  it("parses valid Vietnamese date input and rejects impossible dates", () => {
    expect(parseDateInputDisplay("10/09/2026")).toBe("2026-09-10");
    expect(parseDateInputDisplay("10/09/2026 03:15", true)).toBe("2026-09-10T03:15");
    expect(parseDateInputDisplay("31/02/2026")).toBeUndefined();
  });
  it("converts a Bangkok wall-clock time to the correct UTC instant", () => {
    expect(zonedDateTimeToUtc("2026-09-11T08:15", "Asia/Bangkok").toISOString())
      .toBe("2026-09-11T01:15:00.000Z");
    expect(toDateTimeLocal(new Date("2026-09-11T01:15:00.000Z"), "Asia/Bangkok"))
      .toBe("2026-09-11T08:15");
  });
  it("builds today boundaries in the user's timezone", () => {
    const range = getLocalDayRange(new Date("2026-09-10T18:00:00.000Z"), "Asia/Bangkok");
    expect(range.start.toISOString()).toBe("2026-09-10T17:00:00.000Z");
    expect(range.end.toISOString()).toBe("2026-09-11T17:00:00.000Z");
  });
});
