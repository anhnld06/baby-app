import { differenceInMonths } from "date-fns";
import { FORMULA_REFERENCE_MASTER as rules } from "@/features/care-reference/master";

export const feedingSources = {
  formula: "https://www.derbyshirefamilyhealthservice.nhs.uk/our-services/0-5-years/infant-feeding-and-nutrition/formula-feeding",
  frequency: "https://www2.hse.ie/babies-children/bottle-feeding/preparing-baby-formula/",
  newborn: "https://www.cdc.gov/infant-toddler-nutrition/formula-feeding/how-much-and-how-often.html",
  breastfeeding: "https://www.cdc.gov/infant-toddler-nutrition/breastfeeding/how-much-and-how-often.html",
  signs: "https://www.nhs.uk/baby/breastfeeding-and-bottle-feeding/breastfeeding-problems/enough-milk/",
};

export type FeedRecord = { type: string; amountMl: number | null; endTime: Date | null };

// Formula volume: NHS 150–200 ml/kg/24h, after the first week to under 6 months.
// Frequency: CDC for newborns; HSE for older formula-fed infants.
// These are reference ranges, never diagnostic minimums or catch-up prescriptions.
export function feedingReference(birth: Date, day: string, gestationalWeeks?: number | null, weight?: { weightKg: number | null; measuredAt: Date } | null) {
  const date = new Date(`${day}T00:00:00Z`);
  const birthDay = new Date(birth.toISOString().slice(0, 10));
  const days = Math.floor((date.getTime() - birthDay.getTime()) / 86400000);
  const months = differenceInMonths(date, birthDay);
  const premature = gestationalWeeks != null && gestationalWeeks < 37;
  const supported = days >= 0 && months < rules.untilMonths && !premature;
  const weightAge = weight ? (date.getTime() - new Date(weight.measuredAt.toISOString().slice(0, 10)).getTime()) / 86400000 : Infinity;
  // Product freshness rule; not a medical threshold. Never use a future weigh-in.
  const freshWeight = weight?.weightKg != null && Number.isFinite(weight.weightKg) && weight.weightKg > 0 && weightAge >= 0 && weightAge <= rules.maxWeightAgeDays;
  const frequency = days < rules.frequency[0].untilDays ? rules.frequency[0] : months < rules.frequency[1].untilMonths ? rules.frequency[1] : rules.frequency[2];
  return {
    days, months, premature,
    feeds: supported ? { min: frequency.min, max: frequency.max } : null,
    volume: supported && days >= rules.fromDays && freshWeight ? { min: Math.round(weight!.weightKg! * rules.minMlPerKgPer24Hours), max: Math.round(weight!.weightKg! * rules.maxMlPerKgPer24Hours) } : null,
    weight: freshWeight ? weight : null,
  };
}

export function feedingTotals(feeds: FeedRecord[]) {
  const bottles = feeds.filter(f => f.type !== "BREASTFEEDING");
  return {
    count: feeds.length,
    ml: bottles.reduce((sum, f) => sum + (f.amountMl ?? 0), 0),
    direct: feeds.some(f => f.type === "BREASTFEEDING" || f.type === "MIXED"),
    formulaOnly: feeds.length > 0 && feeds.every(f => f.type === "FORMULA"),
    pending: bottles.filter(f => f.amountMl == null).length,
    active: feeds.some(f => f.type === "BREASTFEEDING" && f.endTime == null),
  };
}

export function compareFeeding(ml: number, range: { min: number; max: number } | null, eligible: boolean) {
  if (!eligible || !range) return { status: "unknown", delta: 0 } as const;
  if (ml < range.min) return { status: "low", delta: range.min - ml } as const;
  if (ml > range.max) return { status: "high", delta: ml - range.max } as const;
  return { status: "within", delta: 0 } as const;
}
