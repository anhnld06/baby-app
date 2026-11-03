import type { PregnancyCheckup, PregnancyMeasurement } from "@prisma/client";
import { toDateTimeLocal } from "@/lib/date";

export type MaternalMetric = "weightKg" | "bellyCm" | "systolic" | "diastolic" | "pulse";
export type MaternalObservation = {
  id: string; source: "CHECKUP" | "HOME"; sourceLabel: string; day: string; dateLabel: string;
  recordedAt: string; editHref: string; ageLabel: string | null; facility: string | null;
  values: Record<MaternalMetric, number | null>;
  bloodPressure: string | null; edema: string | null; urine: string | null; healthStatus: string | null;
  treatment: string | null; care: string | null; followup: string | null; notes: string | null;
};
export const MATERNAL_METRICS = [
  { key: "weightKg", label: "Cân nặng mẹ", unit: "kg", chart: "Diễn biến cân nặng mẹ" },
  { key: "systolic", label: "Huyết áp tâm thu", unit: "mmHg", chart: "Diễn biến huyết áp tâm thu" },
  { key: "diastolic", label: "Huyết áp tâm trương", unit: "mmHg", chart: "Diễn biến huyết áp tâm trương" },
  { key: "pulse", label: "Mạch mẹ", unit: "lần/phút", chart: "Diễn biến mạch mẹ" },
  { key: "bellyCm", label: "Vòng bụng mẹ", unit: "cm", chart: "Diễn biến vòng bụng mẹ" },
] as const;
export type MaternalCheckup = Pick<PregnancyCheckup, "id" | "checkedAt" | "checkedAtTimeKnown" | "gestationalWeek" | "gestationalDay" | "facility" | "weightKg" | "bloodPressure" | "maternalPulse" | "edema" | "urineTestResult" | "maternalHealthStatus" | "treatment" | "careInstructions" | "followupInstruction">;

export function maternalObservations(checkups: MaternalCheckup[], measurements: PregnancyMeasurement[], timeZone: string): MaternalObservation[] {
  const rows: MaternalObservation[] = checkups.map((item) => {
    const bp = /^\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*$/.exec(item.bloodPressure ?? "");
    const day = item.checkedAtTimeKnown ? toDateTimeLocal(item.checkedAt, timeZone).slice(0, 10) : item.checkedAt.toISOString().slice(0, 10);
    return { id: `checkup-${item.id}`, source: "CHECKUP", sourceLabel: "Phiếu khám", day, dateLabel: dateLabel(day), recordedAt: item.checkedAt.toISOString(), editHref: `/mother/pregnancy/checkups?edit=${item.id}`, ageLabel: item.gestationalWeek == null ? null : `${item.gestationalWeek} tuần ${item.gestationalDay} ngày`, facility: item.facility,
      values: { weightKg: item.weightKg, bellyCm: null, systolic: bp ? Number(bp[1]) : null, diastolic: bp ? Number(bp[2]) : null, pulse: item.maternalPulse }, bloodPressure: item.bloodPressure?.trim() || null,
      edema: item.edema, urine: item.urineTestResult?.trim() || null, healthStatus: item.maternalHealthStatus?.trim() || null, treatment: item.treatment?.trim() || null, care: item.careInstructions?.trim() || null, followup: item.followupInstruction?.trim() || null, notes: null };
  });
  for (const item of measurements) {
    const day = item.measuredOn.toISOString().slice(0, 10);
    rows.push({ id: `home-${item.id}`, source: "HOME", sourceLabel: "Đo thêm ở nhà", day, dateLabel: dateLabel(day), recordedAt: item.createdAt.toISOString(), editHref: `/mother/pregnancy/health/measurements?date=${day}`, ageLabel: null, facility: null,
      values: { weightKg: item.weightKg, bellyCm: item.bellyCm, systolic: null, diastolic: null, pulse: null }, bloodPressure: null, edema: null, urine: null, healthStatus: null, treatment: null, care: null, followup: null, notes: item.notes });
  }
  return rows.sort((a, b) => a.day.localeCompare(b.day) || (a.source !== b.source ? a.source === "CHECKUP" ? 1 : -1 : a.recordedAt.localeCompare(b.recordedAt)) || a.id.localeCompare(b.id));
}
function dateLabel(day: string) { return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`)); }

export function maternalSeries(observations: MaternalObservation[], metric: MaternalMetric) {
  return observations.flatMap((row) => row.values[metric] != null && Number.isFinite(row.values[metric]) ? [{ ...row, value: row.values[metric]! }] : []);
}
export function maternalMetricSummary(observations: MaternalObservation[], metric: MaternalMetric) {
  const rows = maternalSeries(observations, metric);
  const latest = rows.at(-1);
  if (!latest) return null;
  const previous = rows.slice(0, -1).findLast((row) => row.day < latest.day);
  return { latest, previous: previous ?? null, difference: previous ? latest.value - previous.value : null, count: rows.length };
}
export function lastMaternalNote(observations: MaternalObservation[], field: "edema" | "urine" | "healthStatus" | "treatment" | "care" | "followup" | "bloodPressure") {
  return observations.findLast((row) => row.source === "CHECKUP" && row[field] != null && row[field]!.trim() !== "") ?? null;
}
