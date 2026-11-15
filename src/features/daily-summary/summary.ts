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
