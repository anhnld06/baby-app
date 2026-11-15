/**
 * WHO 2006 LMS reference calculations, adapted from WHO anthro (GPL-3.0).
 * Upstream commit, checksums and license: ./data/provenance.json and LICENSE-WHO-anthro.md.
 * Equations: R/z-score-helper.R; indicators: R/z-score-{weight,length,bmi,head}*.
 * Scope: individual measurements with known sex and integer age; no oedema input.
 */
import wei from "./data/wei.json";
import len from "./data/len.json";
import hc from "./data/hc.json";
import bmi from "./data/bmi.json";
import wfl from "./data/wfl.json";
import wfh from "./data/wfh.json";

export const WHO_STANDARD = "WHO_2006";
export const WHO_ENGINE_VERSION = "local-lms-b776d8a-v1";
export const WHO_LIMITS = {
  ageMonths: 60,
  daysPerMonth: 30.4375,
  standingAgeDays: 731,
  lengthCorrectionCm: 0.7,
  referenceZ: 2,
  flags: { weightAge: [-6, 5], heightAge: [-6, 6], weightHeight: [-5, 5], bmiAge: [-5, 5], headAge: [-5, 5] },
} as const;

type Sex = "1" | "2";
type Lms = readonly number[];
type Table = { "1": number[][]; "2": number[][] };
export type WhoInput = { sex: string; ageInDays: number; weightKg?: number | null; lengthHeightCm?: number | null; headCircumferenceCm?: number | null; measure?: "L" | "H" | null };
export type WhoResult = { standard: string; engineVersion: string; weightAgeZ: number | null; heightAgeZ: number | null; weightHeightZ: number | null; bmiAgeZ: number | null; headAgeZ: number | null; flags: string[] };

export function whoAgeSupported(days: number) {
  return Number.isInteger(days) && days >= 0 && days / WHO_LIMITS.daysPerMonth < WHO_LIMITS.ageMonths;
}
function ageRow(table: Table, sex: Sex, age: number) {
  const row = table[sex][age];
  return row?.[0] === age ? row : null;
}
function lengthRow(table: Table, sex: Sex, cm: number) {
  const rows = table[sex];
  const position = (cm - rows[0][0]) * 10;
  if (position < -1e-8 || position > rows.length - 1 + 1e-8) return null;
  const lower = Math.floor(position + 1e-8);
  const fraction = position - lower;
  if (Math.abs(fraction) < 1e-8) return rows[lower];
  const a = rows[lower]; const b = rows[lower + 1];
  return a && b ? [cm, ...[1, 2, 3].map(i => a[i] + fraction * (b[i] - a[i]))] : null;
}
export function measurementAtZ(row: Lms, z: number) {
  const [, l, m, s] = row;
  return l === 0 ? m * Math.exp(s * z) : m * Math.pow(1 + l * s * z, 1 / l);
}
function score(value: number | null | undefined, row: Lms | null, adjusted = true) {
  if (value == null || !Number.isFinite(value) || value <= 0 || !row) return null;
  const [, l, m, s] = row;
  let z = l === 0 ? Math.log(value / m) / s : (Math.pow(value / m, l) - 1) / (l * s);
  if (adjusted && z > 3) z = 3 + (value - measurementAtZ(row, 3)) / (measurementAtZ(row, 3) - measurementAtZ(row, 2));
  if (adjusted && z < -3) z = -3 + (value - measurementAtZ(row, -3)) / (measurementAtZ(row, -2) - measurementAtZ(row, -3));
  return Number.isFinite(z) ? (Math.round(z * 100) / 100 || 0) : null;
}
export function weightAgeRange(sex: string, days: number) {
  if ((sex !== "1" && sex !== "2") || !whoAgeSupported(days)) return null;
  const row = ageRow(wei, sex, days);
  return row ? { min: measurementAtZ(row, -WHO_LIMITS.referenceZ), median: row[2], max: measurementAtZ(row, WHO_LIMITS.referenceZ) } : null;
}
export function calculateWho(input: WhoInput): WhoResult {
  const result: WhoResult = { standard: WHO_STANDARD, engineVersion: WHO_ENGINE_VERSION, weightAgeZ: null, heightAgeZ: null, weightHeightZ: null, bmiAgeZ: null, headAgeZ: null, flags: [] };
  const { sex, ageInDays: age } = input;
  if ((sex !== "1" && sex !== "2") || !whoAgeSupported(age)) return result;
  let measure = input.measure;
  if (measure === "H" && age / WHO_LIMITS.daysPerMonth < 9) {
    result.flags.push("MEASUREMENT_POSITION_IMPLAUSIBLE"); measure = null;
  }
  let cm = input.lengthHeightCm;
  if (cm != null && (!Number.isFinite(cm) || cm <= 0)) cm = null;
  if (cm != null && age < WHO_LIMITS.standingAgeDays && measure === "H") cm += WHO_LIMITS.lengthCorrectionCm;
  if (cm != null && age >= WHO_LIMITS.standingAgeDays && measure === "L") cm -= WHO_LIMITS.lengthCorrectionCm;
  result.weightAgeZ = score(input.weightKg, ageRow(wei, sex, age));
  result.heightAgeZ = score(cm, ageRow(len, sex, age), false);
  result.headAgeZ = score(input.headCircumferenceCm, ageRow(hc, sex, age), false);
  if (cm != null && input.weightKg != null) {
    result.weightHeightZ = score(input.weightKg, lengthRow(age < WHO_LIMITS.standingAgeDays ? wfl : wfh, sex, cm));
    result.bmiAgeZ = score(input.weightKg / ((cm / 100) ** 2), ageRow(bmi, sex, age));
  }
  const indicators = [
    ["weightAgeZ", "weightAge", "WEIGHT_AGE_IMPLAUSIBLE"], ["heightAgeZ", "heightAge", "HEIGHT_AGE_IMPLAUSIBLE"],
    ["weightHeightZ", "weightHeight", "WEIGHT_HEIGHT_IMPLAUSIBLE"], ["bmiAgeZ", "bmiAge", "BMI_AGE_IMPLAUSIBLE"], ["headAgeZ", "headAge", "HEAD_AGE_IMPLAUSIBLE"],
  ] as const;
  for (const [field, limit, flag] of indicators) {
    const z = result[field]; const [min, max] = WHO_LIMITS.flags[limit];
    if (z != null && (z < min || z > max)) result.flags.push(flag);
  }
  return result;
}
