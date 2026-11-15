import { BABY_SCHEDULE, MOTHER_PRENATAL_SCHEDULE } from "./schedule";
import type { BabyScheduleEntry, MotherScheduleEntry } from "./schedule";

export type ChecklistRecord = {
  id: string;
  scheduleKey?: string | null;
  vaccineName: string;
  doseNumber: number | null;
};
export type ScheduleEntry = BabyScheduleEntry | MotherScheduleEntry;
const normalize = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/gi, "d").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export function recordMatchesEntry(record: Omit<ChecklistRecord, "id">, entry: ScheduleEntry) {
  if (record.scheduleKey) return record.scheduleKey === entry.key;
  const name = normalize(record.vaccineName);
  // Separate monovalent measles from MR/MMR and oral polio from injectable IPV.
  if (entry.key === "measles-1" && /\b(rubella|mmr|mr)\b/.test(name)) return false;
  if (entry.key.startsWith("polio-") && !entry.key.startsWith("polio-ipv") && /\b(ipv|imovax)\b/.test(name)) return false;
  const named = entry.matchNames.some((alias) => ` ${name} `.includes(` ${normalize(alias)} `)) || name === normalize(entry.label);
  const writtenDose = name.match(/\b(?:mui|lieu)\s+(\d+)\b/);
  const doseNumber = record.doseNumber ?? (writtenDose ? Number(writtenDose[1]) : null);
  const dose = doseNumber === entry.doseNumber || (doseNumber === null && entry.doseNumber === 1);
  // Older versions numbered the first standalone IPV as dose 4 after three OPV doses.
  const legacyIpv = entry.key === "polio-ipv" && record.doseNumber === 4;
  return named && (dose || legacyIpv);
}

/**
 * True when nothing on the record says which dose it was (no schedule key,
 * no dose number, no "mũi N" in the name), so it only counts as dose 1 by
 * default.
 */
export function hasUnknownDose(record: Omit<ChecklistRecord, "id">) {
  return !record.scheduleKey && record.doseNumber === null && !/\b(?:mui|lieu)\s+\d+\b/.test(normalize(record.vaccineName));
}

export function findChecklistRecord<T extends ChecklistRecord>(records: T[], entry: ScheduleEntry) {
  return records.find((record) => record.scheduleKey === entry.key) ?? records.find((record) => recordMatchesEntry(record, entry));
}

export function scheduleEntry(kind: "baby" | "mother", key: string): ScheduleEntry | undefined {
  return (kind === "baby" ? BABY_SCHEDULE : MOTHER_PRENATAL_SCHEDULE).find((entry) => entry.key === key);
}

/** Calendar months from `date` (UTC day), clamped to the last day of the target month. */
export function addCalendarMonths(date: Date, months: number) {
  const result = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(date.getUTCDate(), lastDay));
  return result;
}

export function babyMilestoneDate(birth: Date, entry: BabyScheduleEntry) {
  if (entry.dueAgeMonths === undefined) return new Date(birth.getTime() + entry.dueAgeDays * 86_400_000);
  const date = addCalendarMonths(birth, entry.dueAgeMonths);
  date.setUTCDate(date.getUTCDate() + (entry.offsetDays ?? 0));
  return date;
}

export function babyMilestoneLabel(entry: BabyScheduleEntry) {
  const months = entry.dueAgeMonths;
  if (months === 0) return "Sơ sinh";
  if (months !== undefined) {
    const age = months % 12 === 0 ? `${months / 12} tuổi` : `${months} tháng`;
    return `${age}${entry.offsetDays ? ` + ${entry.offsetDays} ngày` : ""}`;
  }
  return `${entry.dueAgeDays} ngày tuổi`;
}
