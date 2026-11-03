import { describe, expect, it } from "vitest";
import { explicitPrenatalFollowupDate, withPrenatalFollowupDate } from "./prenatal";

describe("prenatal follow-up reminders after retiring the date column", () => {
  it("reads an explicit date appended to existing instructions by the migration", () => {
    expect(explicitPrenatalFollowupDate("Sau 1 tuần\nNgày tái khám: 25/11/2026")?.toISOString()).toBe("2026-11-25T00:00:00.000Z");
  });
  it.each(["25/11/2026", "2026-11-25", "Tái khám ngày 25/11/2026", "ngày 25/11/2026"])("reads the explicitly recorded calendar date %s", (text) => {
    expect(explicitPrenatalFollowupDate(text)?.toISOString()).toBe("2026-11-25T00:00:00.000Z");
  });
  it.each(["Sau 1 tuần", "Khi thai 38 tuần", "Khi có bất thường", "31/02/2026", "29/02/2025", "Ngày tái khám: 25/11/2026\nNgày tái khám: 26/11/2026", ""])("does not invent a reminder for %s", (text) => {
    expect(explicitPrenatalFollowupDate(text)).toBeUndefined();
  });
});


it("replaces an explicit appointment without losing relative advice", () => {
  const note = "Sau 1 tuần hoặc khi đau bụng\nNgày tái khám: 25/11/2026";
  expect(withPrenatalFollowupDate(note, "2026-11-27")).toBe("Sau 1 tuần hoặc khi đau bụng\nNgày tái khám: 27/11/2026");
  expect(withPrenatalFollowupDate(note, "")).toBe("Sau 1 tuần hoặc khi đau bụng");
  expect(withPrenatalFollowupDate(note, "2026-02-30")).toBe(note);
});
