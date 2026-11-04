import { describe, expect, it } from "vitest";
import { prenatalBaseline, type PrenatalBaselineVisit } from "./prenatal-baseline";
const visit = (id: string, day: string, values: Partial<PrenatalBaselineVisit> = {}): PrenatalBaselineVisit => ({ id, checkedAt: new Date(day), checkedAtTimeKnown: false, visitType: "ULTRASOUND", fetusCount: 1, estimatedFetalWeightG: 3100, hcMm: 330, ...values });
describe("prenatal baseline", () => {
  it("uses only the last prenatal ultrasound and converts units without writing birth values", () => {
    const result = prenatalBaseline([visit("old", "2026-10-28"), visit("last", "2026-11-02"), visit("clinic", "2026-11-03", { visitType: "PRENATAL_VISIT" }), visit("after", "2026-11-05")], "2026-11-04", "Asia/Ho_Chi_Minh");
    expect(result).toEqual({ status: "FOUND", id: "last", day: "2026-11-02", weightKg: 3.1, headCm: 33 });
  });
  it("does not fill missing fields with older measurements", () => {
    const result = prenatalBaseline([visit("old", "2026-10-28"), visit("last", "2026-11-02", { estimatedFetalWeightG: null, hcMm: null })], "2026-11-04", "UTC");
    expect(result).toMatchObject({ status: "FOUND", id: "last", weightKg: null, headCm: null });
  });
  it("requires known times for a report on the day of birth and respects local time", () => {
    const rows = [visit("before", "2026-11-03T23:00Z", { checkedAtTimeKnown: true }), visit("after", "2026-11-04T04:00Z", { checkedAtTimeKnown: true })];
    expect(prenatalBaseline(rows, "2026-11-04", "Asia/Ho_Chi_Minh", "08:00")).toMatchObject({ status: "FOUND", id: "before" });
    expect(prenatalBaseline(rows, "2026-11-04", "Asia/Ho_Chi_Minh")).toEqual({ status: "EMPTY" });
  });
  it("does not assign mixed multiple-fetus or ambiguously ordered measurements", () => {
    expect(prenatalBaseline([visit("multi", "2026-11-02", { fetusCount: 2 })], "2026-11-04", "UTC")).toEqual({ status: "MULTIPLE" });
    expect(prenatalBaseline([visit("a", "2026-11-02"), visit("b", "2026-11-02")], "2026-11-04", "UTC")).toEqual({ status: "AMBIGUOUS" });
    expect(prenatalBaseline([], "2026-11-04", "UTC")).toEqual({ status: "EMPTY" });
  });
});
