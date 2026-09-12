import "server-only";

import { computeBabyDue, computeMotherDue } from "@/features/vaccination/due";
import type { CalendarReminder } from "@/features/calendar/ics";
import { selectRelevantPregnancy } from "@/features/mother/pregnancy";
import { getLocalDayRange } from "@/lib/date";
import { db } from "@/lib/db";

export async function listUserReminders(
  userId: string,
  timezone: string,
  now = new Date(),
  onlyBabyId?: string,
) {
  const [babies, mother] = await Promise.all([
    db.baby.findMany({
      where: { userId, ...(onlyBabyId ? { id: onlyBabyId } : {}) },
      include: {
        vaccinationRecords: {
          select: { id: true, vaccineName: true, doseNumber: true, nextDueAt: true },
        },
        medicalVisits: {
          select: { id: true, nextVisitAt: true },
        },
      },
    }),
    db.mother.findUnique({
      where: { userId },
      include: {
        vaccinationRecords: { select: { vaccineName: true, doseNumber: true } },
        medicalVisits: { select: { id: true, nextVisitAt: true } },
        pregnancies: {
          orderBy: { createdAt: "desc" },
          include: { checkups: { select: { id: true, nextCheckupAt: true } } },
        },
      },
    }),
  ]);
  const pregnancy = selectRelevantPregnancy(mother?.pregnancies ?? []);
  const { start: today } = getLocalDayRange(now, timezone);
  const reminders: CalendarReminder[] = [];

  for (const baby of babies) {
    const due = computeBabyDue(baby.dateOfBirth, baby.vaccinationRecords).filter(
      (item) =>
        (item.status === "UPCOMING" || item.status === "DUE") && item.dueDate >= today,
    );
    reminders.push(
      ...due.map((item) => ({
        uid: `baby-${baby.id}-vaccine-${item.key}`,
        title: `Vani Family: ${item.label}`,
        date: item.dueDate,
        description: "Mốc tham khảo. Hãy xác nhận lịch phù hợp với cơ sở tiêm chủng hoặc bác sĩ.",
      })),
      ...baby.vaccinationRecords.flatMap((record) =>
        record.nextDueAt && record.nextDueAt >= today
          ? [{
              uid: `vaccine-followup-${record.id}`,
              title: `Lịch tiêm tiếp theo của ${baby.name}`,
              date: record.nextDueAt,
              description: "Ngày hẹn do gia đình đã lưu trong Vani Family.",
            }]
          : [],
      ),
      ...baby.medicalVisits.flatMap((visit) =>
        visit.nextVisitAt && visit.nextVisitAt >= today
          ? [{
              uid: `baby-visit-${visit.id}`,
              title: `Tái khám cho ${baby.name}`,
              date: visit.nextVisitAt,
              description: "Ngày tái khám do gia đình đã lưu trong Vani Family.",
            }]
          : [],
      ),
    );
  }

  if (mother) {
    if (
      pregnancy?.pregnancyStatus === "PREGNANT" &&
      pregnancy.lastMenstrualPeriod
    ) {
      reminders.push(
        ...computeMotherDue(
          pregnancy.lastMenstrualPeriod,
          mother.vaccinationRecords,
        )
          .filter(
            (item) =>
              (item.status === "UPCOMING" || item.status === "DUE") &&
              item.dueDate >= today,
          )
          .map((item) => ({
            uid: `mother-vaccine-${item.key}`,
            title: `Vani Family: ${item.label}`,
            date: item.dueDate,
            description: "Mốc tham khảo. Hãy xác nhận lịch phù hợp với cơ sở tiêm chủng hoặc bác sĩ.",
          })),
      );
    }
    reminders.push(
      ...mother.medicalVisits.flatMap((visit) =>
        visit.nextVisitAt && visit.nextVisitAt >= today
          ? [{
              uid: `mother-visit-${visit.id}`,
              title: `Lịch tái khám của ${mother.name}`,
              date: visit.nextVisitAt,
              description: "Ngày tái khám do gia đình đã lưu trong Vani Family.",
            }]
          : [],
      ),
      ...(pregnancy?.checkups ?? []).flatMap((checkup) =>
        checkup.nextCheckupAt && checkup.nextCheckupAt >= today
          ? [{
              uid: `pregnancy-checkup-${checkup.id}`,
              title: "Lịch khám thai tiếp theo",
              date: checkup.nextCheckupAt,
              description: "Ngày khám do gia đình đã lưu trong Vani Family.",
            }]
          : [],
      ),
    );
  }

  return reminders;
}
