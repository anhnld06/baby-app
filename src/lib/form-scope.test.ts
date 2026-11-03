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
  it("preserves recorded observations when the visit type changes", () => {
    const input = { pregnancyId: "pregnancy", checkedAt: now, weightKg: 60, bloodPressure: "110/70", crlMm: 20, placentaPosition: "anterior", fetalAnatomy: "recorded", fetalHeartRate: 147, clinicalFetalHeartRate: 140, findings: "note" };
    for (const visitType of ["PRENATAL_VISIT", "ULTRASOUND", "COMBINED"]) {
      expect(pregnancyCheckupSchema.parse({ ...input, visitType })).toMatchObject(input);
    }
  });
  it("keeps independent clinical and ultrasound measurements", () => {
    const result = pregnancyCheckupSchema.parse({ pregnancyId: "pregnancy", checkedAt: "2026-08-07", checkedAtTimeKnown: "false", visitType: "COMBINED", maternalPulse: "118", fetalHeartRate: "150", clinicalFetalHeartRate: "150", bloodPressure: "115/71", edema: "ABSENT", placentaGrade: "2", placentaGradeUpper: "3", followupInstruction: "Sau 1 tuần" });
    expect(result).toMatchObject({ checkedAtTimeKnown: false, maternalPulse: 118, fetalHeartRate: 150, clinicalFetalHeartRate: 150, edema: "ABSENT", placentaGrade: 2, placentaGradeUpper: 3, urineTestResult: null, followupInstruction: "Sau 1 tuần" });
  });
  it("distinguishes unknown edema from explicitly absent edema", () => {
    const input = { pregnancyId: "pregnancy", checkedAt: now, visitType: "COMBINED" };
    expect(pregnancyCheckupSchema.parse({ ...input, edema: "" }).edema).toBeNull();
    expect(pregnancyCheckupSchema.parse({ ...input, edema: "ABSENT" }).edema).toBe("ABSENT");
  });
  it("allows clearing optional treatment and follow-up text", () => {
    expect(pregnancyCheckupSchema.parse({ pregnancyId: "pregnancy", checkedAt: now, visitType: "COMBINED", otherFindings: "", treatment: "", followupInstruction: "" })).toMatchObject({ otherFindings: null, treatment: null, followupInstruction: null });
  });
  it("rejects reversed placental grade ranges and out-of-range percentiles", () => {
    const input = { pregnancyId: "pregnancy", checkedAt: now, visitType: "ULTRASOUND" };
    expect(pregnancyCheckupSchema.safeParse({ ...input, placentaGrade: 3, placentaGradeUpper: 2 }).success).toBe(false);
    expect(pregnancyCheckupSchema.safeParse({ ...input, estimatedFetalWeightPercentile: 101 }).success).toBe(false);
  });
});
