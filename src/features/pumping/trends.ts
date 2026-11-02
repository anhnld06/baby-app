import { toDateTimeLocal, zonedDateTimeToUtc } from "@/lib/date";
import { pumpingAmount } from "./pumping";

type Pump = { startTime: Date; leftAmountMl: number | null; rightAmountMl: number | null; isRunning: boolean };
type Bottle = { startTime: Date; amountMl: number | null; type: string };

// Calendar arithmetic on date keys keeps local day boundaries correct across DST.
export function pumpingTrendWindow(now: Date, timeZone: string) {
  const today = toDateTimeLocal(now, timeZone).slice(0, 10);
  const days = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(`${today}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() - 14 + index);
    return date.toISOString().slice(0, 10);
  });
  return { days, start: zonedDateTimeToUtc(`${days[0]}T00:00`, timeZone), end: zonedDateTimeToUtc(`${today}T00:00`, timeZone) };
}

export function pumpingTrends(now: Date, timeZone: string, pumps: Pump[], bottles: Bottle[]) {
  const { days } = pumpingTrendWindow(now, timeZone);
  const rows = days.map((day) => {
    const sessions = pumps.filter((item) => !item.isRunning && toDateTimeLocal(item.startTime, timeZone).slice(0, 10) === day);
    const measured = sessions.filter((item) => item.leftAmountMl != null || item.rightAmountMl != null);
    const feeds = bottles.filter((item) => item.type === "BOTTLE_BREAST_MILK" && toDateTimeLocal(item.startTime, timeZone).slice(0, 10) === day);
    const measuredFeeds = feeds.filter((item) => item.amountMl != null);
    return {
      day, count: sessions.length, pending: sessions.length - measured.length,
      pumpedMl: measured.length ? measured.reduce((sum, item) => sum + pumpingAmount(item), 0) : null,
      bottleMl: measuredFeeds.length ? measuredFeeds.reduce((sum, item) => sum + item.amountMl!, 0) : null,
      bottlePending: feeds.length - measuredFeeds.length,
    };
  });
  const summarize = (items: typeof rows) => ({
    totalMl: items.reduce((sum, row) => sum + (row.pumpedMl ?? 0), 0),
    recordedDays: items.filter((row) => row.pumpedMl != null).length,
    pending: items.reduce((sum, row) => sum + row.pending, 0),
    count: items.reduce((sum, row) => sum + row.count, 0),
  });
  const previous = summarize(rows.slice(0, 7));
  const current = summarize(rows.slice(7));
  const comparable = previous.recordedDays === 7 && current.recordedDays === 7 && previous.pending === 0 && current.pending === 0 && previous.totalMl > 0;
  return { rows: rows.slice(7), previous, current, changePercent: comparable ? (current.totalMl - previous.totalMl) / previous.totalMl * 100 : null };
}
