import { describe, expect, it } from "vitest";
import { parsePrescriptionItems } from "@/lib/validation";

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
