import type { CalendarReminder } from "@/features/calendar/ics";

type Appointment = {
  id: string;
  vaccineName: string;
  scheduledAt: Date;
  vaccinationRecordId: string | null;
  motherVaccinationRecordId: string | null;
};
export function appointmentReminders(
  appointments: Appointment[],
  today: string,
): CalendarReminder[] {
  return appointments
    .filter(
      (item) =>
        !item.vaccinationRecordId &&
        !item.motherVaccinationRecordId &&
        item.scheduledAt.toISOString().slice(0, 10) >= today,
    )
    .map((item) => ({
      uid: `vaccination-appointment-${item.id}`,
      title: `Lịch tiêm: ${item.vaccineName}`,
      date: item.scheduledAt,
      description:
        "Ngày hẹn gia đình đã lưu. Mở Tiêm chủng trong Vani Family để xác nhận đã tiêm hoặc đổi ngày.",
    }));
}
