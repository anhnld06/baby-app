import { toDateTimeLocal } from "@/lib/date";
export function validDay(value: string | undefined, fallback: string) {
  return value &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
    ? value
    : fallback;
}
export function calendarAgeDays(birth: Date, now: Date, timeZone: string) {
  return Math.max(
    0,
    Math.floor(
      (Date.parse(toDateTimeLocal(now, timeZone).slice(0, 10)) -
        Date.parse(birth.toISOString().slice(0, 10))) /
        86400000,
    ),
  );
}
export function monthDate(birth: Date, months: number) {
  const date = new Date(
    Date.UTC(birth.getUTCFullYear(), birth.getUTCMonth() + months, 1),
  );
  const last = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
  ).getUTCDate();
  date.setUTCDate(Math.min(birth.getUTCDate(), last));
  return date;
}
