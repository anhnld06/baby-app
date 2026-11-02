import { toDateTimeLocal, zonedDateTimeToUtc } from "@/lib/date";

export type PumpingChartMode = "day" | "month" | "year";
export type ChartEntry = { id: string; startTime: Date; leftAmountMl: number | null; rightAmountMl: number | null };
export type ChartBucket = { key: string; label: string; totalMl: number | null; leftMl: number; rightMl: number; count: number; measured: number; pending: number; recordedDays: number; partial: boolean };
const dateKey = (d: Date) => d.toISOString().slice(0, 10);

export function pumpingChartPeriod(modeValue: unknown, dateValue: unknown, now: Date, zone: string) {
  const mode: PumpingChartMode = modeValue === "day" || modeValue === "year" ? modeValue : "month";
  const today = toDateTimeLocal(now, zone).slice(0, 10);
  const valid = typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue) && Number(dateValue.slice(0, 4)) >= 1900 && Number(dateValue.slice(0, 4)) <= 2100;
  const parsed = new Date(`${valid ? dateValue : today}T12:00:00Z`);
  const anchor = valid && !Number.isNaN(parsed.getTime()) && dateKey(parsed) === dateValue ? dateValue : today;
  const [year, month, day] = anchor.split("-").map(Number);
  const first = new Date(Date.UTC(year, mode === "year" ? 0 : month - 1, mode === "day" ? day : 1, 12));
  const last = new Date(first);
  if (mode === "day") last.setUTCDate(last.getUTCDate() + 1);
  else if (mode === "month") last.setUTCMonth(last.getUTCMonth() + 1);
  else last.setUTCFullYear(last.getUTCFullYear() + 1);
  const shift = (direction: number) => {
    const shifted = new Date(first);
    if (mode === "day") shifted.setUTCDate(shifted.getUTCDate() + direction);
    else if (mode === "month") shifted.setUTCMonth(shifted.getUTCMonth() + direction);
    else shifted.setUTCFullYear(shifted.getUTCFullYear() + direction);
    return dateKey(shifted);
  };
  return { mode, anchor, firstKey: dateKey(first), endKey: dateKey(last), start: zonedDateTimeToUtc(`${dateKey(first)}T00:00`, zone), end: zonedDateTimeToUtc(`${dateKey(last)}T00:00`, zone), previous: shift(-1), next: shift(1), today };
}

export function pumpingChartData(period: ReturnType<typeof pumpingChartPeriod>, entries: ChartEntry[], zone: string): ChartBucket[] {
  const grouped = new Map<string, ChartEntry[]>();
  const localKey = (entry: ChartEntry) => toDateTimeLocal(entry.startTime, zone).slice(0, 10);
  const filtered = entries.filter((entry) => entry.startTime >= period.start && entry.startTime < period.end);
  if (period.mode === "day") {
    return [...filtered].sort((a, b) => a.startTime.getTime() - b.startTime.getTime() || a.id.localeCompare(b.id)).map((entry) => bucket(entry.id, toDateTimeLocal(entry.startTime, zone).slice(11, 16), [entry], localKey, period.firstKey === period.today));
  }
  for (const entry of filtered) {
    const day = localKey(entry);
    const key = period.mode === "year" ? day.slice(0, 7) : day;
    grouped.set(key, [...(grouped.get(key) ?? []), entry]);
  }
  const rows: ChartBucket[] = [];
  const cursor = new Date(`${period.firstKey}T12:00:00Z`);
  while (dateKey(cursor) < period.endKey) {
    const day = dateKey(cursor);
    const key = period.mode === "year" ? day.slice(0, 7) : day;
    const current = period.mode === "year" ? period.today.slice(0, 7) : period.today;
    rows.push(bucket(key, String(Number(period.mode === "year" ? day.slice(5, 7) : day.slice(8))), grouped.get(key) ?? [], localKey, key === current));
    if (period.mode === "year") cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    else cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return rows;
}

function bucket(key: string, label: string, entries: ChartEntry[], localKey: (entry: ChartEntry) => string, partial: boolean): ChartBucket {
  const measured = entries.filter((entry) => entry.leftAmountMl != null || entry.rightAmountMl != null);
  const leftMl = measured.reduce((sum, entry) => sum + (entry.leftAmountMl ?? 0), 0);
  const rightMl = measured.reduce((sum, entry) => sum + (entry.rightAmountMl ?? 0), 0);
  return { key, label, leftMl, rightMl, totalMl: measured.length ? leftMl + rightMl : null, count: entries.length, measured: measured.length, pending: entries.length - measured.length, recordedDays: new Set(measured.map(localKey)).size, partial };
}
