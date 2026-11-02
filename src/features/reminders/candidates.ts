import "server-only";

import type { CalendarReminder } from "@/features/calendar/ics";
import { selectRelevantPregnancy } from "@/features/mother/pregnancy";
import { toDateTimeLocal } from "@/lib/date";
import { appointmentReminders } from "@/features/vaccination/reminders";
import { db } from "@/lib/db";

export async function listUserReminders(
  userId: string,
  timezone: string,
  now = new Date(),
  onlyBabyId?: string,
) {
  const [babies, mother, appointments] = await Promise.all([
    db.baby.findMany({
      where: { userId, ...(onlyBabyId ? { id: onlyBabyId } : {}) },
      include: {
        medicalVisits: {
          select: { id: true, nextVisitAt: true },
        },
      },
    }),
    db.mother.findUnique({
      where: { userId },
      include: {
        medicalVisits: { select: { id: true, nextVisitAt: true } },
        pregnancies: {
          orderBy: { createdAt: "desc" },
          include: { checkups: { select: { id: true, nextCheckupAt: true } } },
        },
      },
    }),
    db.vaccinationAppointment.findMany({
      where: {
        vaccinationRecordId: null,
        motherVaccinationRecordId: null,
        OR: [
          { baby: { userId, ...(onlyBabyId ? { id: onlyBabyId } : {}) } },
          { mother: { userId } },
        ],
      },
    }),
  ]);
  const pregnancy = selectRelevantPregnancy(mother?.pregnancies ?? []);
  const todayString = toDateTimeLocal(now, timezone).slice(0, 10);
  const today = new Date(`${todayString}T00:00:00Z`);
  const reminders: CalendarReminder[] = appointmentReminders(
    appointments,
    todayString,
  );

  for (const baby of babies) {
    reminders.push(
      ...baby.medicalVisits.flatMap((visit) =>
        visit.nextVisitAt && visit.nextVisitAt >= today
          ? [
              {
                uid: `baby-visit-${visit.id}`,
                title: `Tái khám cho ${baby.name}`,
                date: visit.nextVisitAt,
                description:
                  "Ngày tái khám do gia đình đã lưu trong Vani Family.",
              },
            ]
          : [],
      ),
    );
  }

  if (mother) {
    reminders.push(
      ...mother.medicalVisits.flatMap((visit) =>
        visit.nextVisitAt && visit.nextVisitAt >= today
          ? [
              {
                uid: `mother-visit-${visit.id}`,
                title: `Lịch tái khám của ${mother.name}`,
                date: visit.nextVisitAt,
                description:
                  "Ngày tái khám do gia đình đã lưu trong Vani Family.",
              },
            ]
          : [],
      ),
      ...(pregnancy?.checkups ?? []).flatMap((checkup) =>
        checkup.nextCheckupAt && checkup.nextCheckupAt >= today
          ? [
              {
                uid: `pregnancy-checkup-${checkup.id}`,
                title: "Lịch khám thai tiếp theo",
                date: checkup.nextCheckupAt,
                description: "Ngày khám do gia đình đã lưu trong Vani Family.",
              },
            ]
          : [],
      ),
    );
  }

  return reminders;
}
