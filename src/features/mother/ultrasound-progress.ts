export const ULTRASOUND_METRICS = [
  { key: "estimatedFetalWeightG", label: "Cân nặng thai ước tính", short: "Cân nặng ước tính", unit: "g" },
  { key: "bpdMm", label: "BPD · Đường kính lưỡng đỉnh", short: "BPD", unit: "mm" },
  { key: "hcMm", label: "HC · Chu vi đầu", short: "HC", unit: "mm" },
  { key: "acMm", label: "AC · Chu vi bụng", short: "AC", unit: "mm" },
  { key: "flMm", label: "FL · Chiều dài xương đùi", short: "FL", unit: "mm" },
  { key: "crlMm", label: "CRL · Chiều dài đầu mông", short: "CRL", unit: "mm" },
  { key: "fetalHeartRate", label: "Tim thai trên phiếu siêu âm", short: "Tim thai", unit: "lần/phút" },
  { key: "ntMm", label: "NT · Độ mờ da gáy", short: "NT", unit: "mm" },
  { key: "afiMm", label: "AFI · Chỉ số ối", short: "AFI", unit: "mm" },
  { key: "estimatedFetalWeightPercentile", label: "Bách phân vị cân nặng ghi trên phiếu", short: "Bách phân vị", unit: "%" },
] as const;

export type UltrasoundMetric = (typeof ULTRASOUND_METRICS)[number]["key"];
export type UltrasoundVisit = {
  id: string;
  day: string;
  recordedAt: string;
  dateLabel: string;
  ageLabel: string;
  facility: string | null;
  fetusCount: number | null;
  values: Record<UltrasoundMetric, number | null>;
};

export function sortUltrasoundVisits(visits: UltrasoundVisit[]) {
  return [...visits].sort((a, b) => a.day.localeCompare(b.day) || a.recordedAt.localeCompare(b.recordedAt) || a.id.localeCompare(b.id));
}

export function ultrasoundSeries(visits: UltrasoundVisit[], metric: UltrasoundMetric) {
  return sortUltrasoundVisits(visits).map((visit, index) => ({
    id: visit.id, index, day: visit.day, dateLabel: visit.dateLabel, ageLabel: visit.ageLabel,
    value: visit.values[metric] != null && Number.isFinite(visit.values[metric]) ? visit.values[metric] : null,
  }));
}

export function previousUltrasoundMeasurement(visits: UltrasoundVisit[], selectedId: string, metric: UltrasoundMetric) {
  // The current schema cannot associate measurements with an individual twin.
  if (visits.some((visit) => (visit.fetusCount ?? 1) > 1)) return null;
  const ordered = sortUltrasoundVisits(visits);
  const index = ordered.findIndex((visit) => visit.id === selectedId);
  const current = ordered[index];
  if (!current || current.values[metric] == null) return null;
  const previous = ordered.slice(0, index).findLast((visit) => visit.values[metric] != null);
  if (!previous) return null;
  return { previous, difference: current.values[metric]! - previous.values[metric]!, sameDay: previous.day === current.day };
}

/** Recorded endpoints, not a growth forecast or a normative assessment. */
export function ultrasoundMeasurementSpan(visits: UltrasoundVisit[], metric: UltrasoundMetric) {
  if (visits.some((visit) => (visit.fetusCount ?? 1) > 1)) return null;
  const measured = sortUltrasoundVisits(visits).filter((visit) => visit.values[metric] != null && Number.isFinite(visit.values[metric]));
  if (measured.length < 2) return null;
  const first = measured[0], last = measured.at(-1)!;
  return { first, last, difference: last.values[metric]! - first.values[metric]!, count: measured.length };
}
