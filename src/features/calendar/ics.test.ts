import { describe, expect, it } from "vitest";
import { buildIcsCalendar, escapeIcsText } from "@/features/calendar/ics";

describe("ICS calendar", () => {
  it("escapes reserved text characters", () => {
    expect(escapeIcsText("A, B; C\\D\nE")).toBe("A\\, B\\; C\\\\D\\nE");
  });

  it("creates an all-day event with two reminders", () => {
    const calendar = buildIcsCalendar([{
      uid: "visit-1",
      title: "Tái khám cho bé",
      date: new Date("2026-10-12T00:00:00.000Z"),
      description: "Mốc do gia đình đã lưu.",
    }], new Date("2026-09-11T01:00:00.000Z"));

    expect(calendar).toContain("DTSTART;VALUE=DATE:20261012");
    expect(calendar).toContain("TRIGGER:-P7D");
    expect(calendar).toContain("TRIGGER:-P1D");
    expect(calendar).toContain("UID:visit-1@vani-family");
  });
});

