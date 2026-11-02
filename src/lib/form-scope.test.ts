import { describe, expect, it } from "vitest";
import { babyInsuranceSchema, diaperSchema, growthSchema, motherInsuranceSchema, pregnancyCheckupSchema, pregnancySchema } from "./validation";

const now = new Date("2026-11-02T08:00:00Z");

describe("fields scoped to the selected record type", () => {
  it("clears stool details when a diaper is changed to wet", () => {
    expect(diaperSchema.parse({ babyId: "baby", type: "WET", changedAt: now, stoolColor: "yellow", consistency: "soft", amount: "small", notes: "note" }))
      .toMatchObject({ stoolColor: null, consistency: null, amount: null, notes: "note" });
  });
  it.each(["STOOL", "BOTH"])("keeps stool details for %s", (type) => {
    expect(diaperSchema.parse({ babyId: "baby", type, changedAt: now, stoolColor: "yellow", consistency: "soft", amount: "small" }))
      .toMatchObject({ stoolColor: "yellow", consistency: "soft", amount: "small" });
  });
  it("clears delivery date while preserving historical due dates for an ended pregnancy", () => {
    expect(pregnancySchema.parse({ motherId: "mother", pregnancyStatus: "ENDED", estimatedDueDate: now, actualDeliveryDate: now }))
      .toMatchObject({ estimatedDueDate: now, actualDeliveryDate: null });
    expect(pregnancySchema.parse({ motherId: "mother", pregnancyStatus: "PLANNING", estimatedDueDate: now, actualDeliveryDate: now }))
      .toMatchObject({ estimatedDueDate: null, actualDeliveryDate: null });
    expect(pregnancySchema.parse({ motherId: "mother", pregnancyStatus: "DELIVERED", actualDeliveryDate: now }).actualDeliveryDate).toEqual(now);
  });
  for (const schema of [motherInsuranceSchema, babyInsuranceSchema]) {
    it("limits registered primary care to BHYT for both owner types", () => {
      const input = { motherId: "mother", babyId: "baby", policyNumber: "123", registeredCare: "clinic" };
      expect(schema.parse({ ...input, insuranceType: "BHYT" }).registeredCare).toBe("clinic");
      expect(schema.parse({ ...input, insuranceType: "PRIVATE" }).registeredCare).toBeNull();
      expect(schema.parse({ ...input, insuranceType: "OTHER" }).registeredCare).toBeNull();
    });
  }
  it("clears height and its position when only weight is recorded", () => {
    expect(growthSchema.parse({ babyId: "baby", measuredAt: now, weightKg: 4, heightCm: "", measurementPosition: "RECUMBENT" }))
      .toMatchObject({ weightKg: 4, heightCm: null, measurementPosition: null });
    expect(growthSchema.parse({ babyId: "baby", measuredAt: now, heightCm: 55, measurementPosition: "RECUMBENT" }))
      .toMatchObject({ heightCm: 55, measurementPosition: "RECUMBENT" });
  });
  it("scopes checkup fields while keeping shared clinical findings", () => {
    const input = { pregnancyId: "pregnancy", checkedAt: now, weightKg: 60, bloodPressure: "110/70", crlMm: 20, placentaPosition: "anterior", fetalAnatomy: "recorded", fetalHeartRate: 140, findings: "note" };
    expect(pregnancyCheckupSchema.parse({ ...input, visitType: "PRENATAL_VISIT" }))
      .toMatchObject({ weightKg: 60, crlMm: null, placentaPosition: null, fetalAnatomy: null, fetalHeartRate: 140, findings: "note" });
    expect(pregnancyCheckupSchema.parse({ ...input, visitType: "ULTRASOUND" }))
      .toMatchObject({ weightKg: null, bloodPressure: null, crlMm: 20, fetalHeartRate: 140 });
    expect(pregnancyCheckupSchema.parse({ ...input, visitType: "COMBINED" })).toMatchObject(input);
  });
});
