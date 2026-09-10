import { BABY_SCHEDULE, MOTHER_PRENATAL_SCHEDULE } from "@/features/vaccination/schedule";

export type DueStatus = "UPCOMING" | "DUE" | "OVERDUE" | "DONE";

export type DueItem = {
  key: string;
  label: string;
  dueDate: Date;
  status: DueStatus;
};

const dayMs = 86_400_000;
const OVERDUE_GRACE_DAYS = 14;

function statusFor(dueDate: Date, done: boolean, now: Date): DueStatus {
  if (done) return "DONE";
  if (now.getTime() > dueDate.getTime() + OVERDUE_GRACE_DAYS * dayMs) return "OVERDUE";
  if (now.getTime() >= dueDate.getTime()) return "DUE";
  return "UPCOMING";
}

function matches(vaccineName: string, doseNumber: number | null, matchName: string, entryDose: number) {
  const nameMatches = vaccineName.toLowerCase().includes(matchName);
  const doseMatches = doseNumber === entryDose || (doseNumber === null && entryDose === 1);
  return nameMatches && doseMatches;
}

export function computeMotherDue(
  lastMenstrualPeriod: Date | null | undefined,
  records: { vaccineName: string; doseNumber: number | null }[],
  now = new Date(),
): DueItem[] {
  if (!lastMenstrualPeriod) return [];
  return MOTHER_PRENATAL_SCHEDULE.map((entry) => {
    const dueDate = new Date(lastMenstrualPeriod.getTime() + entry.dueByWeek * 7 * dayMs);
    const done = records.some((record) => matches(record.vaccineName, record.doseNumber, entry.matchName, entry.doseNumber));
    return { key: entry.key, label: entry.label, dueDate, status: statusFor(dueDate, done, now) };
  });
}

export function computeBabyDue(
  dateOfBirth: Date,
  records: { vaccineName: string; doseNumber: number | null }[],
  now = new Date(),
): DueItem[] {
  return BABY_SCHEDULE.map((entry) => {
    const dueDate = new Date(dateOfBirth.getTime() + entry.dueAgeDays * dayMs);
    const done = records.some((record) => matches(record.vaccineName, record.doseNumber, entry.matchName, entry.doseNumber));
    return { key: entry.key, label: entry.label, dueDate, status: statusFor(dueDate, done, now) };
  });
}
