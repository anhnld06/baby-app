const dayMs = 86_400_000;

export type PredictionConfidence = "LOW" | "MEDIUM" | "HIGH";

export function cycleLengths(starts: Date[]) {
  const ordered = [...starts].sort((a, b) => a.getTime() - b.getTime());
  return ordered
    .slice(1)
    .map((date, index) => Math.round((date.getTime() - ordered[index].getTime()) / dayMs))
    .filter((days) => days >= 15 && days <= 60);
}

export function averageCycleLength(starts: Date[]) {
  const intervals = cycleLengths(starts).slice(-12);
  if (!intervals.length) return undefined;
  return Math.round(intervals.reduce((sum, days) => sum + days, 0) / intervals.length);
}

export function analyzeCycles(starts: Date[]) {
  const lengths = cycleLengths(starts).slice(-12);
  const variationDays = lengths.length >= 2 ? Math.max(...lengths) - Math.min(...lengths) : undefined;
  const irregular = variationDays !== undefined && variationDays >= 8;
  const confidence: PredictionConfidence = lengths.length >= 5 && !irregular
    ? "HIGH"
    : lengths.length >= 2 && !irregular
      ? "MEDIUM"
      : "LOW";
  return { lengths, variationDays, irregular, confidence };
}

export function estimatedNextPeriod(starts: Date[], fallbackCycleLength?: number) {
  const average = averageCycleLength(starts) ?? fallbackCycleLength;
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

export function estimatedFertileWindow(nextPeriod?: Date, lutealPhaseDays = 14, positiveOvulationTest?: Date) {
  if (!nextPeriod) return undefined;
  const ovulation = positiveOvulationTest
    ? new Date(positiveOvulationTest.getTime() + dayMs)
    : new Date(nextPeriod.getTime() - lutealPhaseDays * dayMs);
  return {
    start: new Date(ovulation.getTime() - 5 * dayMs),
    end: new Date(ovulation.getTime() + dayMs),
    ovulation,
  };
}
