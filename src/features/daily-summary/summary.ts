import { differenceInMonths } from "date-fns";

export function loggedSleepMinutes(entries: { startTime: Date; endTime: Date | null }[], start: Date, end: Date) {
  const intervals = entries.map((entry) => [Math.max(start.getTime(), entry.startTime.getTime()), Math.min(end.getTime(), (entry.endTime ?? end).getTime())])
    .filter(([a, b]) => b > a).sort((a, b) => a[0] - b[0]);
  let total = 0;
  let lastEnd = start.getTime();
  for (const [a, b] of intervals) {
    total += Math.max(0, b - Math.max(a, lastEnd));
    lastEnd = Math.max(lastEnd, b);
  }
  return total / 60_000;
}

export function sleepReference(dateOfBirth: Date, now: Date) {
  const months = differenceInMonths(now, dateOfBirth);
  if (months < 4) return null;
  if (months < 12) return { min: 12, max: 16 };
  if (months < 36) return { min: 11, max: 14 };
  if (months < 72) return { min: 10, max: 13 };
  if (months < 156) return { min: 9, max: 12 };
  if (months < 216) return { min: 8, max: 10 };
  return null;
}
