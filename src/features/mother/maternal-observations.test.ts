import { describe, expect, it } from "vitest";
import { lastMaternalNote, maternalMetricSummary, maternalObservations, maternalSeries, type MaternalCheckup } from "./maternal-observations";
import type { PregnancyMeasurement } from "@prisma/client";
const zone = "Asia/Ho_Chi_Minh";
function checkup(id: string, day: string, extra: Partial<MaternalCheckup> = {}): MaternalCheckup {
  return { id, checkedAt: new Date(`${day}T00:00:00Z`), checkedAtTimeKnown: false, gestationalWeek: 20, gestationalDay: 0, facility: null, weightKg: null, bloodPressure: null, maternalPulse: null, edema: null, urineTestResult: null, maternalHealthStatus: null, treatment: null, careInstructions: null, followupInstruction: null, ...extra };
}
function home(id: string, day: string, weightKg: number | null): PregnancyMeasurement {
  return { id, pregnancyId: "pregnancy", measuredOn: new Date(`${day}T00:00:00Z`), weightKg, bellyCm: null, notes: null, createdAt: new Date(`${day}T19:00:00Z`) };
}
describe("maternal data is derived from original records", () => {
  it("reads weight, pressure and maternal pulse without a manual measurement", () => {
    const rows = maternalObservations([checkup("a", "2026-10-01", { weightKg: 58, bloodPressure: "110 / 70", maternalPulse: 90 })], [], zone);
    expect(maternalMetricSummary(rows, "weightKg")?.latest.value).toBe(58);
    expect(rows[0].values).toMatchObject({ systolic: 110, diastolic: 70, pulse: 90 });
    expect(rows[0].editHref).toBe("/mother/pregnancy/checkups?edit=a");
  });
  it("does not lose a mother's measurement when a newer ultrasound has no maternal fields", () => {
    const rows = maternalObservations([checkup("a", "2026-10-01", { weightKg: 58, edema: "ABSENT", careInstructions: "Lời dặn gốc" }), checkup("b", "2026-11-04")], [], zone);
    expect(maternalMetricSummary(rows, "weightKg")?.latest.id).toBe("checkup-a");
    expect(lastMaternalNote(rows, "care")?.id).toBe("checkup-a");
    expect(lastMaternalNote(rows, "edema")?.edema).toBe("ABSENT");
  });
  it("preserves clinic and home measurements on the same day rather than overwriting either", () => {
    const rows = maternalObservations([checkup("a", "2026-11-04", { weightKg: 60 })], [home("b", "2026-11-04", 61)], zone);
    expect(maternalSeries(rows, "weightKg").map((row) => row.value)).toEqual([61, 60]);
    expect(maternalMetricSummary(rows, "weightKg")?.latest.source).toBe("CHECKUP");
    expect(maternalMetricSummary(rows, "weightKg")?.difference).toBeNull();
  });
  it("calculates change against an earlier dated reading and retains its source", () => {
    const rows = maternalObservations([checkup("a", "2026-10-01", { weightKg: 58 }), checkup("b", "2026-11-04", { weightKg: 60 })], [], zone);
    expect(maternalMetricSummary(rows, "weightKg")).toMatchObject({ difference: 2, previous: { id: "checkup-a" }, latest: { id: "checkup-b" } });
  });
  it("keeps malformed pressure as source text without plotting invented zeros", () => {
    const rows = maternalObservations([checkup("a", "2026-10-01", { bloodPressure: "không rõ" })], [], zone);
    expect(maternalSeries(rows, "systolic")).toEqual([]);
    expect(lastMaternalNote(rows, "bloodPressure")?.bloodPressure).toBe("không rõ");
  });
  it("does not confuse fetal heart rate with maternal pulse", () => {
    const record = { ...checkup("a", "2026-10-01", { maternalPulse: 118 }), fetalHeartRate: 150, clinicalFetalHeartRate: 148 };
    expect(maternalObservations([record], [], zone)[0].values.pulse).toBe(118);
  });
  it("uses local calendar dates only when an actual time is known", () => {
    const date = new Date("2026-11-03T19:00:00Z");
    const rows = maternalObservations([checkup("a", "2026-11-03", { checkedAt: date, checkedAtTimeKnown: true }), checkup("b", "2026-11-03", { checkedAt: date, checkedAtTimeKnown: false })], [], zone);
    expect(rows.find((row) => row.id === "checkup-a")?.day).toBe("2026-11-04");
    expect(rows.find((row) => row.id === "checkup-b")?.day).toBe("2026-11-03");
  });
  it("reflects source edits and deletions without maintaining copied measurements", () => {
    const record = checkup("a", "2026-10-01", { weightKg: 58 });
    expect(maternalMetricSummary(maternalObservations([record], [], zone), "weightKg")?.latest.value).toBe(58);
    expect(maternalMetricSummary(maternalObservations([{ ...record, weightKg: 62 }], [], zone), "weightKg")?.latest.value).toBe(62);
    expect(maternalMetricSummary(maternalObservations([], [], zone), "weightKg")).toBeNull();
    expect(record.weightKg).toBe(58);
  });
});
