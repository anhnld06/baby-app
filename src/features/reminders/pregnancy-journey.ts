import type { CalendarReminder } from "@/features/calendar/ics";
import { pregnancyAge } from "@/features/mother/pregnancy";

/** Weekly educational reminder, not an automatically prescribed appointment. */
export function pregnancyJourneyReminder(pregnancy: { id: string; pregnancyStatus: string; estimatedDueDate?: Date | null; lastMenstrualPeriod?: Date | null }, timezone: string, now = new Date()): CalendarReminder[] {
  const age = pregnancyAge(pregnancy, now, timezone);
  if (!age || age.weeks < 4 || age.weeks > 40) return [];
  const baseline = pregnancy.estimatedDueDate ? pregnancy.estimatedDueDate.getTime() - 280 * 86400000 : pregnancy.lastMenstrualPeriod!.getTime();
  return [{ uid: `pregnancy-week-${pregnancy.id}-${age.weeks}`, title: `Hành trình yêu thương · tuần ${age.weeks}`, description: "Xem tuần thai, kiểm tra lịch khám và lời dặn đã lưu. Việc bổ sung thực hiện theo hướng dẫn riêng của bác sĩ.", date: new Date(baseline + age.weeks * 7 * 86400000), pushOffsets: [0], url: "/mother/pregnancy" }];
}
