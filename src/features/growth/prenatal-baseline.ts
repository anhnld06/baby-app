export type PrenatalBaselineVisit = {
  id: string; checkedAt: Date; checkedAtTimeKnown: boolean; visitType: string;
  fetusCount: number | null; estimatedFetalWeightG: number | null; hcMm: number | null;
};
/** Never converts ultrasound estimates into birth measurements or postnatal WHO input. */
export function prenatalBaseline(visits: PrenatalBaselineVisit[], birthDay: string, timeZone: string, birthTime?: string | null) {
  const calendarDay = (visit: PrenatalBaselineVisit) => visit.checkedAtTimeKnown ? new Intl.DateTimeFormat("en-CA", { timeZone }).format(visit.checkedAt) : visit.checkedAt.toISOString().slice(0, 10);
  const clock = (visit: PrenatalBaselineVisit) => new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(visit.checkedAt);
  const eligible = visits.filter((visit) => {
    if (visit.visitType === "PRENATAL_VISIT") return false;
    const day = calendarDay(visit);
    return day < birthDay || (day === birthDay && !!birthTime && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(birthTime) && visit.checkedAtTimeKnown && clock(visit) < birthTime);
  });
  if (visits.some((visit) => (visit.fetusCount ?? 1) > 1)) return { status: "MULTIPLE" as const };
  eligible.sort((a, b) => calendarDay(b).localeCompare(calendarDay(a)) || (a.checkedAtTimeKnown && b.checkedAtTimeKnown ? b.checkedAt.getTime() - a.checkedAt.getTime() : 0));
  if (!eligible.length) return { status: "EMPTY" as const };
  const day = calendarDay(eligible[0]);
  const tied = eligible.filter((visit) => calendarDay(visit) === day);
  if (tied.length > 1 && tied.some((visit) => !visit.checkedAtTimeKnown)) return { status: "AMBIGUOUS" as const };
  if (tied.length > 1 && tied[0].checkedAt.getTime() === tied[1].checkedAt.getTime()) return { status: "AMBIGUOUS" as const };
  const last = eligible[0];
  return { status: "FOUND" as const, id: last.id, day, weightKg: last.estimatedFetalWeightG == null ? null : last.estimatedFetalWeightG / 1000, headCm: last.hcMm == null ? null : last.hcMm / 10 };
}

export function initialGrowthBaseline(birth: { birthWeightKg: number | null; birthHeadCircumferenceCm: number | null; birthLengthCm: number | null }, prenatal: { weightKg: number | null; headCm: number | null } | null) {
  const resolve = (actual: number | null, estimate: number | null) => actual != null
    ? { value: actual, source: "BIRTH" as const }
    : estimate != null ? { value: estimate, source: "PRENATAL" as const } : { value: null, source: "MISSING" as const };
  return {
    weight: resolve(birth.birthWeightKg, prenatal?.weightKg ?? null),
    head: resolve(birth.birthHeadCircumferenceCm, prenatal?.headCm ?? null),
    length: resolve(birth.birthLengthCm, null),
  };
}
