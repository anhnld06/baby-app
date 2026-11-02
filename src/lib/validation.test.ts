import { describe, expect, it } from "vitest";
import { feedingSchema, parsePrescriptionItems } from "@/lib/validation";

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
