import { describe, expect, it } from "vitest";
import { durationLabel, pregnancyMeasurementSchema, sessionSummary, trackingSessionSchema } from "./tracking-validation";
const startedAt = Date.now() - 60000;
const base = { pregnancyId: "pregnancy", clientId: "7a13ab90-e91d-4b96-a8ba-f78f7d47aeb3", kind: "KICKS", startedAt, endedAt: startedAt + 60000, events: [{ start: startedAt + 1000 }] };
describe("pregnancy tracking data integrity", () => {
  it("accepts timestamped kicks and completed contractions", () => {
    expect(trackingSessionSchema.safeParse(base).success).toBe(true);
    expect(trackingSessionSchema.safeParse({ ...base, kind: "CONTRACTIONS", events: [{ start: startedAt, end: startedAt + 5000 }] }).success).toBe(true);
  });
  it("rejects future sessions, reversed timestamps and unfinished contractions", () => {
    expect(trackingSessionSchema.safeParse({ ...base, endedAt: Date.now() + 600000 }).success).toBe(false);
    expect(trackingSessionSchema.safeParse({ ...base, endedAt: startedAt - 1 }).success).toBe(false);
    expect(trackingSessionSchema.safeParse({ ...base, kind: "CONTRACTIONS" }).success).toBe(false);
  });
  it("rejects overlapping contractions and events outside their session", () => {
    expect(trackingSessionSchema.safeParse({ ...base, kind: "CONTRACTIONS", events: [{ start: startedAt, end: startedAt + 2000 }, { start: startedAt + 1000, end: startedAt + 3000 }] }).success).toBe(false);
    expect(trackingSessionSchema.safeParse({ ...base, events: [{ start: startedAt - 1 }] }).success).toBe(false);
    expect(trackingSessionSchema.safeParse({ ...base, events: [{ start: base.endedAt + 1 }] }).success).toBe(false);
  });
  it("does not accept a zero-event session or unbounded arrays", () => {
    expect(trackingSessionSchema.safeParse({ ...base, events: [] }).success).toBe(false);
    expect(trackingSessionSchema.safeParse({ ...base, events: Array.from({ length: 501 }, () => ({ start: startedAt })) }).success).toBe(false);
  });
  it("distinguishes contraction duration from start-to-start intervals", () => {
    expect(sessionSummary([{ start: 1000, end: 11000 }, { start: 61000, end: 81000 }], "CONTRACTIONS")).toEqual({ count: 2, averageDurationMs: 15000, averageIntervalMs: 60000 });
    expect(sessionSummary([{ start: 1000 }], "KICKS").averageIntervalMs).toBeNull();
    expect(durationLabel(61500)).toBe("01:01");
  });
});
describe("pregnancy measurements", () => {
  const values = { pregnancyId: "pregnancy", measuredOn: "2026-11-03", weightKg: "60.5", bellyCm: "90" };
  it("keeps decimal measurements without inferring missing values", () => {
    expect(pregnancyMeasurementSchema.parse({ ...values, bellyCm: "" })).toMatchObject({ weightKg: 60.5, bellyCm: undefined });
  });
  it("requires at least one plausible positive measurement", () => {
    for (const override of [{ weightKg: "", bellyCm: "" }, { weightKg: "-1" }, { bellyCm: "251" }, { weightKg: "NaN" }]) expect(pregnancyMeasurementSchema.safeParse({ ...values, ...override }).success).toBe(false);
  });
  it("does not silently normalize invalid calendar dates", () => {
    expect(pregnancyMeasurementSchema.safeParse({ ...values, measuredOn: "2026-02-30" }).success).toBe(false);
  });
});

