import { describe, expect, it } from "vitest";
import { diaperSchema, feedingSchema, growthSchema, motherDailyHealthLogSchema, parsePrescriptionItems, sleepSchema } from "@/lib/validation";

describe("feeding fields by type", () => {
  const entry = { babyId: "baby-1", startTime: new Date("2026-11-02T08:00:00Z"), leftBreastDuration: 10, rightBreastDuration: 5, firstSide: "LEFT", amountMl: 90, milkType: "Formula A" };

  it.each(["BOTTLE_BREAST_MILK", "FORMULA"])("clears breast fields for %s, including when editing", (type) => {
    expect(feedingSchema.parse({ ...entry, type })).toMatchObject({ leftBreastDuration: null, rightBreastDuration: null, firstSide: null, amountMl: 90 });
  });
  it("does not attach formula details to expressed breast milk", () => {
    expect(feedingSchema.parse({ ...entry, type: "BOTTLE_BREAST_MILK" }).milkType).toBeNull();
  });
  it("clears bottle fields for direct breastfeeding", () => {
    expect(feedingSchema.parse({ ...entry, type: "BREASTFEEDING" })).toMatchObject({ amountMl: null, milkType: null, leftBreastDuration: 10, firstSide: "LEFT" });
  });
  it("preserves both groups for mixed feeding", () => {
    expect(feedingSchema.parse({ ...entry, type: "MIXED" })).toMatchObject(entry);
  });
  it("clears optional fields when left blank and accepts measured zero", () => {
    expect(feedingSchema.parse({ babyId: entry.babyId, startTime: entry.startTime, type: "FORMULA", amountMl: 0 })).toMatchObject({ amountMl: 0, milkType: null, leftBreastDuration: null, firstSide: null });
  });
});

function formDataFrom(entries: [string, string][]) {
  const formData = new FormData();
  for (const [key, value] of entries) formData.set(key, value);
  return formData;
}

describe("parsePrescriptionItems", () => {
  it("reconstructs indexed rows in order", () => {
    const formData = formDataFrom([
      ["items.1.medicineName", "Paracetamol"],
      ["items.1.dosage", "250mg"],
      ["items.0.medicineName", "Vitamin D3"],
      ["items.0.durationDays", "30"],
    ]);
    expect(parsePrescriptionItems(formData)).toEqual([
      { medicineName: "Vitamin D3", dosage: undefined, frequency: undefined, durationDays: 30, instructions: undefined },
      { medicineName: "Paracetamol", dosage: "250mg", frequency: undefined, durationDays: undefined, instructions: undefined },
    ]);
  });

  it("drops rows without a medicine name", () => {
    const formData = formDataFrom([
      ["items.0.medicineName", ""],
      ["items.0.dosage", "5ml"],
    ]);
    expect(parsePrescriptionItems(formData)).toEqual([]);
  });

  it("ignores unrelated form fields", () => {
    const formData = formDataFrom([
      ["babyId", "baby-1"],
      ["items.0.medicineName", "Oresol"],
    ]);
    expect(parsePrescriptionItems(formData)).toEqual([
      { medicineName: "Oresol", dosage: undefined, frequency: undefined, durationDays: undefined, instructions: undefined },
    ]);
  });
});

describe("tracking time bounds", () => {
  const minutesFromNow = (minutes: number) => new Date(Date.now() + minutes * 60_000);

  it("rejects timestamps more than a few minutes in the future but tolerates clock drift", () => {
    const base = { babyId: "baby-1", type: "FORMULA", amountMl: 60 };
    expect(feedingSchema.safeParse({ ...base, startTime: minutesFromNow(2) }).success).toBe(true);
    const future = feedingSchema.safeParse({ ...base, startTime: minutesFromNow(30) });
    expect(future.success).toBe(false);
    expect(future.error?.issues[0]?.message).toBe("Giờ bắt đầu bú không thể ở tương lai");
    expect(diaperSchema.safeParse({ babyId: "baby-1", type: "WET", changedAt: minutesFromNow(60) }).success).toBe(false);
    expect(growthSchema.safeParse({ babyId: "baby-1", measuredAt: minutesFromNow(60 * 24), weightKg: 4 }).success).toBe(false);
    expect(sleepSchema.safeParse({ babyId: "baby-1", type: "NAP", startTime: minutesFromNow(-30), endTime: minutesFromNow(30) }).success).toBe(false);
  });

  it("allows in-progress entries without an end time", () => {
    expect(sleepSchema.safeParse({ babyId: "baby-1", type: "NIGHT", startTime: minutesFromNow(-600) }).success).toBe(true);
    expect(feedingSchema.safeParse({ babyId: "baby-1", type: "BREASTFEEDING", startTime: minutesFromNow(-10) }).success).toBe(true);
  });

  it("bounds sleep to 24 hours and feeding to 6 hours", () => {
    const start = new Date("2026-11-01T00:00:00Z");
    const after = (hours: number) => new Date(start.getTime() + hours * 3_600_000);
    expect(sleepSchema.safeParse({ babyId: "b", type: "NIGHT", startTime: start, endTime: after(24) }).success).toBe(true);
    expect(sleepSchema.safeParse({ babyId: "b", type: "NIGHT", startTime: start, endTime: after(24 * 30) }).error?.issues[0]?.path).toEqual(["endTime"]);
    expect(feedingSchema.safeParse({ babyId: "b", type: "BREASTFEEDING", startTime: start, endTime: after(6) }).success).toBe(true);
    expect(feedingSchema.safeParse({ babyId: "b", type: "BREASTFEEDING", startTime: start, endTime: after(7) }).success).toBe(false);
    expect(feedingSchema.safeParse({ babyId: "b", type: "BREASTFEEDING", startTime: start, leftBreastDuration: 400 }).success).toBe(false);
  });

  it("bounds the mother's daily weight", () => {
    const log = { motherId: "m", loggedAt: "2026-11-01" };
    expect(motherDailyHealthLogSchema.safeParse({ ...log, weightKg: "62.5" }).success).toBe(true);
    expect(motherDailyHealthLogSchema.safeParse({ ...log, weightKg: "625" }).success).toBe(false);
  });
});
