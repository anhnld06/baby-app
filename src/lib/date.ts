import { differenceInCalendarDays, differenceInMonths, differenceInYears, format } from "date-fns";

export function toDateTimeLocal(date: Date = new Date()) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function toDateInputValue(date: Date = new Date()) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

export function formatDuration(totalMinutes: number, locale = "vi") {
  const minutes = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (locale === "vi") return hours > 0 ? `${hours}g ${rest}p` : `${rest}p`;
  return hours > 0 ? `${hours}h ${rest}m` : `${rest}m`;
}

export function formatAge(dateOfBirth: Date, now = new Date(), locale = "vi") {
  const days = Math.max(0, differenceInCalendarDays(now, dateOfBirth));
  if (days < 31) return locale === "vi" ? `${days} ngày tuổi` : `${days} days old`;
  const months = differenceInMonths(now, dateOfBirth);
  if (months < 24) return locale === "vi" ? `${months} tháng tuổi` : `${months} months old`;
  const years = differenceInYears(now, dateOfBirth);
  return locale === "vi" ? `${years} tuổi` : `${years} years old`;
}

export function formatDateOfBirth(date: Date) {
  return format(date, "dd/MM/yyyy");
}

export type GreetingPeriod = "morning" | "noon" | "afternoon" | "evening";

export function greetingPeriod(date: Date, timeZone: string): GreetingPeriod {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", hourCycle: "h23" }).format(date),
  );
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 13) return "noon";
  if (hour >= 13 && hour < 18) return "afternoon";
  return "evening";
}

export function formatDateTime(date: Date, timeZone: string, locale: "vi" | "en" = "vi") {
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    timeZone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function ageInDays(dateOfBirth: Date, now = new Date()) {
  return Math.max(0, differenceInCalendarDays(now, dateOfBirth));
}

export function getLocalDayRange(now = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}
