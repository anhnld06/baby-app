import { recordMatchesEntry, babyMilestoneDate } from "./checklist";
import { BABY_SCHEDULE, MOTHER_PRENATAL_SCHEDULE, type VaccineProgram, type VaccineTier } from "@/features/vaccination/schedule";

export type DueStatus = "UPCOMING" | "DUE" | "OVERDUE" | "DONE";

export type DueItem = {
  key: string;
  label: string;
  dueDate: Date;
  status: DueStatus;
  program: VaccineProgram;
  tier: VaccineTier;
  priceRangeVnd?: string;
  note?: string;
};

const dayMs = 86_400_000;
const OVERDUE_GRACE_DAYS = 14;

function statusFor(dueDate: Date, done: boolean, now: Date): DueStatus {
  if (done) return "DONE";
  if (now.getTime() > dueDate.getTime() + OVERDUE_GRACE_DAYS * dayMs) return "OVERDUE";
  if (now.getTime() >= dueDate.getTime()) return "DUE";
  return "UPCOMING";
}

export function computeMotherDue(
  lastMenstrualPeriod: Date | null | undefined,
  records: { vaccineName: string; doseNumber: number | null }[],
  now = new Date(),
): DueItem[] {
  if (!lastMenstrualPeriod) return [];
  return MOTHER_PRENATAL_SCHEDULE.map((entry) => {
    const dueDate = new Date(lastMenstrualPeriod.getTime() + entry.dueByWeek * 7 * dayMs);
    const done = records.some((record) => recordMatchesEntry(record, entry));
    return {
      key: entry.key,
      label: entry.label,
      dueDate,
      status: statusFor(dueDate, done, now),
      program: entry.program,
      tier: entry.tier,
      priceRangeVnd: entry.priceRangeVnd,
      note: entry.note,
    };
  });
}

export function computeBabyDue(
  dateOfBirth: Date,
  records: { vaccineName: string; doseNumber: number | null }[],
  now = new Date(),
): DueItem[] {
  return BABY_SCHEDULE.map((entry) => {
    const dueDate = babyMilestoneDate(dateOfBirth, entry);
    const done = records.some((record) => recordMatchesEntry(record, entry));
    return {
      key: entry.key,
      label: entry.label,
      dueDate,
      status: statusFor(dueDate, done, now),
      program: entry.program,
      tier: entry.tier,
      priceRangeVnd: entry.priceRangeVnd,
      note: entry.note,
    };
  });
}
