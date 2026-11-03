import { scheduledOn } from "@/features/health/validation";
import { toDateTimeLocal } from "@/lib/date";
import type { DuePushReminder } from "./push";

type Schedule = { id: string; babyId: string; active: boolean; startDate: Date; endDate: Date | null; times: string[]; doses: { time: string }[] };

/** Deliver only current slots; never send a stale dose as a new instruction. */
export function medicationPushReminders(schedules: Schedule[], timezone: string, now = new Date()): DuePushReminder[] {
  const local = toDateTimeLocal(now, timezone);
  const day = local.slice(0, 10);
  const minutes = Number(local.slice(11, 13)) * 60 + Number(local.slice(14, 16));
  return schedules.filter(schedule => scheduledOn(schedule, day)).flatMap(schedule =>
    [...new Set(schedule.times)].flatMap(time => {
      if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) return [];
      const slot = Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
      if (slot > minutes || minutes - slot >= 15 || schedule.doses.some(dose => dose.time === time)) return [];
      return [{ uid: `medication-${schedule.id}`, title: "Đến giờ dùng thuốc", description: "Kiểm tra lịch thuốc đã lưu và xác nhận sau khi dùng.", date: new Date(`${day}T00:00Z`), daysBefore: 0, deliveryKey: `medication:${schedule.id}:${day}:${time}`, url: `/tracking/medication?baby=${encodeURIComponent(schedule.babyId)}&date=${day}` }];
    }),
  );
}
