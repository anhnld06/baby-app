/** Reviewed source rules, bundled at runtime. URLs are provenance, never lookup dependencies. */
export const CARE_REFERENCE_VERSION = "2026-11-05-v1";
export const CARE_SOURCES = {
  whoSleep: { name: "WHO · Sleep and activity, 2019", url: "https://www.who.int/publications/i/item/9789241550536" },
  aasmSleep: { name: "AASM · Pediatric sleep consensus, 2016", url: "https://aasm.org/resources/pdf/pressroom/pediatric-sleep-duration-consensus.pdf" },
  wetDiapers: { name: "NHS · Signs of sufficient milk, reviewed 2026", url: "https://www.nhs.uk/baby/breastfeeding-and-bottle-feeding/breastfeeding-problems/enough-milk/" },
} as const;

// Completed calendar months. Total sleep over 24h, including naps.
// WHO supplies 0–3 months; AASM supplies the remaining pediatric ranges.
export const SLEEP_REFERENCE_MASTER = [
  { fromMonths: 0, untilMonths: 4, minHours: 14, maxHours: 17, source: "whoSleep" },
  { fromMonths: 4, untilMonths: 12, minHours: 12, maxHours: 16, source: "aasmSleep" },
  { fromMonths: 12, untilMonths: 36, minHours: 11, maxHours: 14, source: "aasmSleep" },
  { fromMonths: 36, untilMonths: 72, minHours: 10, maxHours: 13, source: "aasmSleep" },
  { fromMonths: 72, untilMonths: 156, minHours: 9, maxHours: 12, source: "aasmSleep" },
  { fromMonths: 156, untilMonths: 216, minHours: 8, maxHours: 10, source: "aasmSleep" },
] as const;
// Conservative application scope: first 6 months, after 5 completed days.
// NHS refers to heavy wet nappies, not all diaper changes. Stool has no fixed daily target here.
export const WET_DIAPER_REFERENCE_MASTER = {
  fromDays: 5, untilMonths: 6, minHeavyWetPer24Hours: 6, source: "wetDiapers",
} as const;
export const FORMULA_REFERENCE_MASTER = {
  fromDays: 7, untilMonths: 6, minMlPerKgPer24Hours: 150, maxMlPerKgPer24Hours: 200,
  maxWeightAgeDays: 30, // App freshness policy, not a clinical threshold.
  frequency: [
    { untilDays: 28, min: 8, max: 12 },
    { untilMonths: 4, min: 6, max: 8 },
    { untilMonths: 6, min: 4, max: 6 },
  ],
} as const;
