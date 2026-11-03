import { describe, expect, it } from "vitest";
import { ultrasoundMeasurementSpan, previousUltrasoundMeasurement, sortUltrasoundVisits, ultrasoundSeries, ULTRASOUND_METRICS, type UltrasoundVisit } from "./ultrasound-progress";
function visit(id: string, day: string, values: Partial<UltrasoundVisit["values"]> = {}): UltrasoundVisit {
  return { id, day, recordedAt: `${day}T00:00:00.000Z`, dateLabel: day, ageLabel: "20 tuần", facility: null, fetusCount: 1, values: { ...Object.fromEntries(ULTRASOUND_METRICS.map(({ key }) => [key, null])), ...values } as UltrasoundVisit["values"] };
}
describe("individual ultrasound history", () => {
  it("orders by the recorded calendar day and retains separate same-day reports", () => {
    const first = visit("a", "2026-06-01"), second = visit("b", "2026-06-01"), third = visit("c", "2026-07-01");
    const input = [third, second, first];
    expect(sortUltrasoundVisits(input).map((v) => v.id)).toEqual(["a", "b", "c"]);
    expect(input[0]).toBe(third);
  });
  it("keeps missing measurements as gaps and retains a recorded zero", () => {
    const data = [visit("a", "2026-06-01", { bpdMm: 48 }), visit("b", "2026-07-01"), visit("c", "2026-08-01", { bpdMm: 0 })];
    expect(ultrasoundSeries(data, "bpdMm").map((p) => p.value)).toEqual([48, null, 0]);
  });
  it("compares with the previous actual measurement and identifies its report", () => {
    const data = [visit("a", "2026-06-01", { estimatedFetalWeightG: 330 }), visit("b", "2026-07-01"), visit("c", "2026-08-01", { estimatedFetalWeightG: 1100 })];
    const result = previousUltrasoundMeasurement(data, "c", "estimatedFetalWeightG");
    expect(result?.difference).toBe(770);
    expect(result?.previous.id).toBe("a");
    expect(previousUltrasoundMeasurement(data, "b", "estimatedFetalWeightG")).toBeNull();
    expect(previousUltrasoundMeasurement(data, "a", "estimatedFetalWeightG")).toBeNull();
  });
  it("preserves decreases and same-day differences without health classifications", () => {
    const data = [visit("a", "2026-06-01", { fetalHeartRate: 150 }), visit("b", "2026-06-01", { fetalHeartRate: 145 })];
    expect(previousUltrasoundMeasurement(data, "b", "fetalHeartRate")).toMatchObject({ difference: -5, sameDay: true });
  });
  it("does not combine unidentified measurements from multiple fetuses", () => {
    const data = [visit("a", "2026-06-01", { bpdMm: 48 }), { ...visit("b", "2026-07-01", { bpdMm: 60 }), fetusCount: 2 }];
    expect(previousUltrasoundMeasurement(data, "b", "bpdMm")).toBeNull();
  });
  it("handles an empty record history", () => {
    expect(ultrasoundSeries([], "bpdMm")).toEqual([]);
    expect(previousUltrasoundMeasurement([], "missing", "bpdMm")).toBeNull();
  });
});


describe("recorded growth endpoints", () => {
  it("uses measured endpoints across missing records rather than inventing a latest value", () => {
    const rows = [visit("a", "2026-06-01", { estimatedFetalWeightG: 330 }), visit("b", "2026-07-01", { estimatedFetalWeightG: 1100 }), visit("c", "2026-08-01")];
    const span = ultrasoundMeasurementSpan(rows, "estimatedFetalWeightG");
    expect(span?.first.id).toBe("a");
    expect(span?.last.id).toBe("b");
    expect(span).toMatchObject({ difference: 770, count: 2 });
  });
  it("requires two recorded values and does not mix multiple fetuses", () => {
    const first = visit("a", "2026-06-01", { bpdMm: 48 });
    expect(ultrasoundMeasurementSpan([first], "bpdMm")).toBeNull();
    expect(ultrasoundMeasurementSpan([first, { ...visit("b", "2026-07-01", { bpdMm: 60 }), fetusCount: 2 }], "bpdMm")).toBeNull();
  });
  it("retains decreases and avoids presenting them as clinical outcomes", () => {
    expect(ultrasoundMeasurementSpan([visit("a", "2026-06-01", { bpdMm: 60 }), visit("b", "2026-07-01", { bpdMm: 59 })], "bpdMm")).toMatchObject({ difference: -1 });
  });
});
