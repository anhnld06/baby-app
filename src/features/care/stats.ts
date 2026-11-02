import {
  getLocalDayRange,
  zonedDateTimeToUtc,
  toDateTimeLocal,
} from "@/lib/date";
import { totalDurationWithinRangeMinutes } from "@/lib/metrics";
export function dailyCareStats(
  now: Date,
  days: number,
  timeZone: string,
  feedings: { startTime: Date; amountMl: number | null; type: string }[],
  sleeps: { startTime: Date; endTime: Date | null }[],
  diapers: { changedAt: Date }[],
  endDay?: string,
) {
  const today = toDateTimeLocal(now, timeZone).slice(0, 10);
  return Array.from({ length: days }, (_, i) => {
    const calendar = new Date(`${endDay ?? today}T12:00:00Z`);
    calendar.setUTCDate(calendar.getUTCDate() - days + 1 + i);
    const day = calendar.toISOString().slice(0, 10);
    const { start, end } = getLocalDayRange(
      zonedDateTimeToUtc(`${day}T12:00`, timeZone),
      timeZone,
    );
    const feeds = feedings.filter(
      (f) => f.startTime >= start && f.startTime < end,
    );
    const bottles = feeds.filter((f) => f.type !== "BREASTFEEDING");
    const measured = bottles.filter((f) => f.amountMl != null);
    const loggedSleep = sleeps.filter(
      (s) => s.startTime < end && (s.endTime == null || s.endTime > start),
    );
    const changes = diapers.filter(
      (d) => d.changedAt >= start && d.changedAt < end,
    );
    return {
      day,
      current: day === today,
      feeds: feeds.length || null,
      milk: measured.length
        ? measured.reduce((sum, f) => sum + f.amountMl!, 0)
        : null,
      missingMilk: bottles.length - measured.length,
      sleep: loggedSleep.length
        ? totalDurationWithinRangeMinutes(loggedSleep, start, end, now) / 60
        : null,
      diapers: changes.length || null,
    };
  });
}
