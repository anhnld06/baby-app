import { describe, expect, it } from "vitest";
import { dueDateFromGestationalAge } from "./due-date";

describe("calendar due date from recorded gestational age", () => {
  it("uses both the completed weeks and days on the examination date", () => {
    expect(dueDateFromGestationalAge("2026-02-07", 10, 3)).toBe("2026-09-02");
    expect(dueDateFromGestationalAge("2026-01-12", 6, 2)).toBe("2026-09-05");
  });
  it("uses the examination's calendar day without UTC or daylight-saving shifts", () => {
    expect(dueDateFromGestationalAge("2026-02-07T23:45", 10, 3)).toBe("2026-09-02");
    expect(dueDateFromGestationalAge("2024-02-29", 39, 0)).toBe("2024-03-07");
  });
  it("can calculate dates for examinations after forty weeks", () => {
    expect(dueDateFromGestationalAge("2026-09-09", 41, 0)).toBe("2026-09-02");
  });
  it("does not invent a value from missing age or impossible dates", () => {
    for (const [date, weeks, days] of [
      ["2026-02-07", null, 0], ["2026-02-07", 10, undefined],
      ["2026-02-30", 10, 3], ["", 10, 3], ["2026-02-07", 10, 7],
      ["2026-02-07", 10.5, 0], ["2026-02-07", 0, 0],
      ["2026-02-07", -1, 0], ["2026-02-07", 46, 0],
    ] as const) expect(dueDateFromGestationalAge(date, weeks, days)).toBeUndefined();
  });
});
