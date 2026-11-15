import { describe, expect, it } from "vitest";
import { buildIcsCalendar, escapeIcsText } from "@/features/calendar/ics";

describe("ICS calendar", () => {
  it("escapes reserved text characters", () => {
    expect(escapeIcsText("A, B; C\\D\nE")).toBe("A\\, B\\; C\\\\D\\nE");
  });

  it("escapes CRLF, lone CR and LF so no raw line break reaches the calendar", () => {
    expect(escapeIcsText("a\r\nb\rc\nd")).toBe("a\\nb\\nc\\nd");
    const calendar = buildIcsCalendar([{
      uid: "visit-2",
      title: "Khám\rSUMMARY:giả mạo",
      date: new Date("2026-10-12T00:00:00.000Z"),
      description: "Dòng 1\r\nDòng 2",
    }], new Date("2026-09-11T01:00:00.000Z"));
    expect(calendar).toContain("SUMMARY:Khám\\nSUMMARY:giả mạo");
    expect(calendar.split("\r\n").some((line) => line.startsWith("SUMMARY:giả mạo"))).toBe(false);
    expect(calendar.replace(/\r\n/g, "")).not.toMatch(/[\r\n]/);
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

