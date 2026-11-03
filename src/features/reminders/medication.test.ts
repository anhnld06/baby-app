import { describe, expect, it } from "vitest";
import { medicationPushReminders } from "./medication";
import { pregnancyJourneyReminder } from "./pregnancy-journey";
import { remindersDueForPush } from "./push";
const schedule = { id: "s1", babyId: "b2", active: true, startDate: new Date("2026-11-01T00:00Z"), endDate: new Date("2026-11-05T00:00Z"), times: ["08:00", "18:00"], doses: [] };
describe("device reminders", () => {
  it("uses local time, skips future and stale slots, and keeps delivery identity", () => {
    const now = new Date("2026-11-04T01:05Z");
    const reminders = medicationPushReminders([schedule], "Asia/Ho_Chi_Minh", now);
    expect(reminders).toHaveLength(1);
    expect(reminders[0].deliveryKey).toBe("medication:s1:2026-11-04:08:00");
    expect(reminders[0].url).toContain("baby=b2");
    expect(medicationPushReminders([schedule], "Asia/Ho_Chi_Minh", new Date("2026-11-04T01:15Z"))).toEqual([]);
    expect(medicationPushReminders([schedule], "UTC", now)).toEqual([]);
  });
  it("skips confirmed, stopped, expired and not-started schedules", () => {
    for (const override of [{ doses: [{ time: "08:00" }] }, { active: false }, { endDate: new Date("2026-11-03") }, { startDate: new Date("2026-11-05") }]) {
      expect(medicationPushReminders([{ ...schedule, ...override }], "Asia/Ho_Chi_Minh", new Date("2026-11-04T01:00Z"))).toEqual([]);
    }
  });
  it("keeps slots unique and rejects malformed times", () => {
    expect(medicationPushReminders([{ ...schedule, times: ["08:00", "08:00", "bad"] }], "UTC", new Date("2026-11-04T08:00Z"))).toHaveLength(1);
  });
  it("reminds only on the start of a pregnancy week, preferring due date", () => {
    const pregnancy = { id: "p", pregnancyStatus: "PREGNANT", lastMenstrualPeriod: new Date("2026-01-01"), estimatedDueDate: new Date("2027-03-24") };
    const now = new Date("2026-11-03T18:00Z"); // local Nov 4: week 20
    const candidates = pregnancyJourneyReminder(pregnancy, "Asia/Ho_Chi_Minh", now);
    expect(candidates[0].title).toContain("20");
    expect(remindersDueForPush(candidates, "Asia/Ho_Chi_Minh", now)).toHaveLength(1);
    expect(remindersDueForPush(candidates, "Asia/Ho_Chi_Minh", new Date("2026-11-02T18:00Z"))).toEqual([]);
    expect(remindersDueForPush(candidates, "Asia/Ho_Chi_Minh", new Date("2026-11-04T18:00Z"))).toEqual([]);
    expect(pregnancyJourneyReminder({ ...pregnancy, pregnancyStatus: "DELIVERED" }, "UTC", now)).toEqual([]);
    expect(pregnancyJourneyReminder({ id: "x", pregnancyStatus: "PREGNANT" }, "UTC", now)).toEqual([]);
  });
});
