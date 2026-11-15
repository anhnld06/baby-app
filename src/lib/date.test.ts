import { describe, expect, it } from "vitest";
import {
  ageInDays,
  formatAge,
  formatDateInputDisplay,
  formatDuration,
  getLocalDayRange,
  parseDateInputDisplay,
  toDateInputValue,
  toDateTimeLocal,
  zonedDateTimeToUtc,
} from "@/lib/date";

describe("date presentation", () => {
  it("formats minutes for Vietnamese", () => expect(formatDuration(135)).toBe("2g 15p"));
  it("returns newborn age in days", () => expect(formatAge(new Date("2026-08-28T00:00:00Z"), new Date("2026-09-08T00:00:00Z"))).toBe("11 ngày tuổi"));
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

describe("age in the account timezone", () => {
  // 2026-09-08 01:00 in Vietnam is still 2026-09-07 in UTC.
  const earlyMorningVietnam = new Date("2026-09-07T18:00:00Z");
  const birth = new Date("2026-08-28T00:00:00Z"); // @db.Date

  it("counts the account's calendar day regardless of the server timezone", () => {
    expect(ageInDays(birth, earlyMorningVietnam, "Asia/Ho_Chi_Minh")).toBe(11);
    expect(formatAge(birth, earlyMorningVietnam, "Asia/Ho_Chi_Minh")).toBe("11 ngày tuổi");
    expect(ageInDays(birth, earlyMorningVietnam, "UTC")).toBe(10);
  });

  it("uses account calendar months and years", () => {
    const dob = new Date("2025-11-09T00:00:00Z");
    // 2026-11-09 06:00 in Vietnam (still Nov 8 in UTC): exactly 12 months.
    expect(formatAge(dob, new Date("2026-11-08T23:00:00Z"), "Asia/Ho_Chi_Minh")).toBe("12 tháng tuổi");
    expect(formatAge(new Date("2023-11-09T00:00:00Z"), new Date("2026-11-08T23:00:00Z"), "Asia/Bangkok")).toBe("3 tuổi");
  });

  it("formats date inputs for the account day and for @db.Date columns", () => {
    expect(toDateInputValue(earlyMorningVietnam, "Asia/Ho_Chi_Minh")).toBe("2026-09-08");
    expect(toDateInputValue(new Date("2026-09-08T00:00:00Z"), "UTC")).toBe("2026-09-08");
  });
});
