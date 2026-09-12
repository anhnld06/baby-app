import type { CalendarReminder } from "@/features/calendar/ics";

export type DuePushReminder = CalendarReminder & {
  daysBefore: number;
  deliveryKey: string;
};

function utcDayIndex(date: Date) {
  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000,
  );
}

function localDayIndex(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return Math.floor(
    Date.UTC(Number(value.year), Number(value.month) - 1, Number(value.day)) /
      86_400_000,
  );
}

export function remindersDueForPush(
  reminders: CalendarReminder[],
  timezone: string,
  now = new Date(),
  offsets = [7, 1, 0],
): DuePushReminder[] {
  const today = localDayIndex(now, timezone);
  return reminders.flatMap((reminder) => {
    const daysBefore = utcDayIndex(reminder.date) - today;
    if (!offsets.includes(daysBefore)) return [];
    const dateKey = reminder.date.toISOString().slice(0, 10);
    return [{
      ...reminder,
      daysBefore,
      deliveryKey: `${reminder.uid}:${dateKey}:${daysBefore}`,
    }];
  });
}
