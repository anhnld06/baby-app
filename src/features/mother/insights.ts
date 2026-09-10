const dayMs = 86_400_000;

export function averageCycleLength(starts: Date[]) {
  const ordered = [...starts].sort((a, b) => a.getTime() - b.getTime());
  const intervals = ordered
    .slice(1)
    .map((date, index) => Math.round((date.getTime() - ordered[index].getTime()) / dayMs))
    .filter((days) => days >= 15 && days <= 60);
  if (!intervals.length) return undefined;
  return Math.round(intervals.reduce((sum, days) => sum + days, 0) / intervals.length);
}

export function estimatedNextPeriod(starts: Date[]) {
  const average = averageCycleLength(starts);
  if (!average || !starts.length) return undefined;
  const latest = [...starts].sort((a, b) => b.getTime() - a.getTime())[0];
  return new Date(latest.getTime() + average * dayMs);
}

export function gestationalAge(lmp?: Date | null, now = new Date()) {
  if (!lmp || now < lmp) return undefined;
  const totalDays = Math.floor((now.getTime() - lmp.getTime()) / dayMs);
  return { weeks: Math.floor(totalDays / 7), days: totalDays % 7 };
}

export function periodStartsFromFlowLogs(dates: Date[]) {
  const ordered = [...dates].sort((a, b) => a.getTime() - b.getTime());
  return ordered.filter((date, index) => {
    if (index === 0) return true;
    return (date.getTime() - ordered[index - 1].getTime()) / dayMs > 10;
  });
}

export function estimatedFertileWindow(nextPeriod?: Date) {
  if (!nextPeriod) return undefined;
  const ovulation = new Date(nextPeriod.getTime() - 14 * dayMs);
  return {
    start: new Date(ovulation.getTime() - 5 * dayMs),
    end: new Date(ovulation.getTime() + dayMs),
    ovulation,
  };
}
