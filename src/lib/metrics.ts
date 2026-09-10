export type TimedEntry = { startTime: Date; endTime: Date | null };

export function durationMinutes(start: Date, end: Date | null, now = new Date()) {
  return Math.max(0, (Math.min((end ?? now).getTime(), now.getTime()) - start.getTime()) / 60_000);
}

export function totalDurationMinutes(entries: TimedEntry[], now = new Date()) {
  return entries.reduce((total, entry) => total + durationMinutes(entry.startTime, entry.endTime, now), 0);
}

export function averageCompletedDurationMinutes(entries: TimedEntry[]) {
  const completed = entries.filter((entry): entry is TimedEntry & { endTime: Date } => entry.endTime !== null);
  if (completed.length === 0) return 0;
  return completed.reduce((total, entry) => total + durationMinutes(entry.startTime, entry.endTime, entry.endTime), 0) / completed.length;
}

export function longestDurationMinutes(entries: TimedEntry[], now = new Date()) {
  return entries.reduce((longest, entry) => Math.max(longest, durationMinutes(entry.startTime, entry.endTime, now)), 0);
}

export function averageGapMinutes(entries: TimedEntry[]) {
  if (entries.length < 2) return 0;
  const sorted = [...entries].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  const gaps = sorted.slice(1).map((entry, index) => Math.max(0, (entry.startTime.getTime() - (sorted[index].endTime ?? sorted[index].startTime).getTime()) / 60_000));
  return gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
}
