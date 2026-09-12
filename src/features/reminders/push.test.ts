import { describe, expect, it } from "vitest";
import { remindersDueForPush } from "@/features/reminders/push";

describe("remindersDueForPush", () => {
  it("uses the user's local calendar day", () => {
    const reminders = [{
      uid: "visit-1",
      title: "Tái khám",
      description: "",
      date: new Date("2026-09-12T00:00:00.000Z"),
    }];
    const result = remindersDueForPush(
      reminders,
      "Asia/Bangkok",
      new Date("2026-09-10T18:00:00.000Z"),
    );
    expect(result[0]?.daysBefore).toBe(1);
    expect(result[0]?.deliveryKey).toContain("visit-1");
  });

  it("does not send outside configured offsets", () => {
    const result = remindersDueForPush(
      [{ uid: "x", title: "x", description: "", date: new Date("2026-09-20T00:00:00Z") }],
      "UTC",
      new Date("2026-09-11T00:00:00Z"),
    );
    expect(result).toEqual([]);
  });
});
