import { describe, expect, it } from "vitest";
import {
  appointmentSchema,
  completionSchema,
  appointmentStatus,
  vaccinationDate,
} from "./journal";
import { appointmentReminders } from "./reminders";

describe("vaccination appointments", () => {
  it("keeps the appointment date separate from the actual date", () => {
    const plan = appointmentSchema.parse({
      owner: "baby:b",
      vaccineName: " Vắc-xin A ",
      scheduledAt: "2026-11-05",
    });
    const done = completionSchema.parse({
      administeredAt: "2026-11-02",
      nextScheduledAt: "2026-12-10",
    });
    expect(plan.vaccineName).toBe("Vắc-xin A");
    expect(plan.scheduledAt).toBe("2026-11-05");
    expect(done.administeredAt).toBe("2026-11-02");
    expect(plan.doseNumber).toBeUndefined();
  });
  it("rejects impossible dates, empty names and invalid dose numbers", () => {
    expect(vaccinationDate.safeParse("2026-02-31").success).toBe(false);
    expect(vaccinationDate.safeParse("2028-02-29").success).toBe(true);
    expect(
      appointmentSchema.safeParse({
        owner: "baby:b",
        vaccineName: "  ",
        scheduledAt: "2026-11-01",
      }).success,
    ).toBe(false);
    expect(
      appointmentSchema.safeParse({
        owner: "baby:b",
        vaccineName: "A",
        scheduledAt: "2026-11-01",
        doseNumber: "0",
      }).success,
    ).toBe(false);
    expect(
      completionSchema.safeParse({
        administeredAt: "2026-11-02",
        nextScheduledAt: "2026-11-01",
      }).success,
    ).toBe(false);
  });
  it("labels calendar dates without the server's timezone", () => {
    expect(
      appointmentStatus(new Date("2026-11-02T00:00:00Z"), "2026-11-02"),
    ).toBe("Hôm nay");
    expect(
      appointmentStatus(new Date("2026-11-01T00:00:00Z"), "2026-11-02"),
    ).toBe("Đã qua ngày hẹn");
  });
  it("stops reminders after completion and restores them when undone", () => {
    const item = {
      id: "a",
      vaccineName: "A",
      scheduledAt: new Date("2026-11-02T00:00:00Z"),
      vaccinationRecordId: null,
      motherVaccinationRecordId: null,
    };
    expect(appointmentReminders([item], "2026-11-02")).toHaveLength(1);
    expect(
      appointmentReminders(
        [{ ...item, vaccinationRecordId: "done" }],
        "2026-11-02",
      ),
    ).toEqual([]);
    expect(
      appointmentReminders(
        [{ ...item, motherVaccinationRecordId: "done" }],
        "2026-11-02",
      ),
    ).toEqual([]);
    expect(appointmentReminders([item], "2026-11-02")[0].uid).toBe(
      "vaccination-appointment-a",
    );
    expect(appointmentReminders([item], "2026-11-03")).toEqual([]);
  });
});
