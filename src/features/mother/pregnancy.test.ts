import { describe, expect, it } from "vitest";
import { pregnancyAge, selectRelevantPregnancy } from "@/features/mother/pregnancy";

describe("selectRelevantPregnancy", () => {
  it("prefers an active pregnancy over a newer closed record", () => {
    const active = { id: "active", pregnancyStatus: "PREGNANT" as const, createdAt: new Date("2025-01-01") };
    const closed = { id: "closed", pregnancyStatus: "DELIVERED" as const, createdAt: new Date("2026-01-01") };
    expect(selectRelevantPregnancy([closed, active])?.id).toBe("active");
  });

  it("falls back to the newest record when none is active", () => {
    const old = { id: "old", pregnancyStatus: "ENDED" as const, createdAt: new Date("2025-01-01") };
    const recent = { id: "recent", pregnancyStatus: "DELIVERED" as const, createdAt: new Date("2026-01-01") };
    expect(selectRelevantPregnancy([old, recent])?.id).toBe("recent");
  });
});

describe("pregnancyAge", () => {
  it("prefers established due date over a conflicting LMP", () => {
    const age = pregnancyAge({ pregnancyStatus: "PREGNANT", estimatedDueDate: new Date("2026-12-01"), lastMenstrualPeriod: new Date("2026-01-01") }, new Date("2026-11-03T12:00:00Z"));
    expect(age).toMatchObject({ weeks: 36, days: 0, source: "Ngày dự sinh đã lưu" });
  });
  it("uses the user's calendar day", () => {
    const data = { pregnancyStatus: "PREGNANT", lastMenstrualPeriod: new Date("2026-11-01") };
    expect(pregnancyAge(data, new Date("2026-11-02T18:00:00Z"), "Asia/Ho_Chi_Minh")?.days).toBe(2);
    expect(pregnancyAge(data, new Date("2026-11-02T18:00:00Z"), "UTC")?.days).toBe(1);
  });
  it("stops calculating for closed and planned pregnancies", () => {
    for (const pregnancyStatus of ["ENDED", "DELIVERED", "PLANNING"]) {
      expect(pregnancyAge({ pregnancyStatus, lastMenstrualPeriod: new Date("2026-01-01") })).toBeUndefined();
    }
  });
  it("does not calculate ages outside a supported pregnancy", () => {
    expect(pregnancyAge({ pregnancyStatus: "PREGNANT", lastMenstrualPeriod: new Date("2020-01-01") })).toBeUndefined();
    expect(pregnancyAge({ pregnancyStatus: "PREGNANT" })).toBeUndefined();
  });
});
