import { differenceInCalendarDays, differenceInMonths, differenceInYears, format } from "date-fns";

type DateTimeParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function partsInTimeZone(date: Date, timeZone: string): DateTimeParts {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  return {
    year: value("year"),
    month: value("month"),
    day: value("day"),
    hour: value("hour"),
    minute: value("minute"),
    second: value("second"),
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function toDateTimeLocal(date: Date = new Date(), timeZone?: string) {
  if (timeZone) {
    const parts = partsInTimeZone(date, timeZone);
    return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`;
  }
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function toDateInputValue(date: Date = new Date()) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

export function formatDateInputDisplay(value: string, includeTime = false) {
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(value);
  if (!match) return "";
  const date = `${match[3]}/${match[2]}/${match[1]}`;
  return includeTime && match[4] && match[5] ? `${date} ${match[4]}:${match[5]}` : date;
}

export function parseDateInputDisplay(value: string, includeTime = false) {
  const pattern = includeTime
    ? /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/
    : /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = pattern.exec(value.trim());
  if (!match) return undefined;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const candidate = new Date(Date.UTC(year, month - 1, day));
  if (
    year < 1900 ||
    year > 2100 ||
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) return undefined;

  const isoDate = `${match[3]}-${match[2]}-${match[1]}`;
  if (!includeTime) return isoDate;
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  if (hour > 23 || minute > 59) return undefined;
  return `${isoDate}T${match[4]}:${match[5]}`;
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

export function zonedDateTimeToUtc(value: string, timeZone: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value);
  if (!match) return new Date(value);

  const wanted = Date.UTC(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(match[4]),
    Number(match[5]),
    Number(match[6] ?? 0),
  );
  let instant = wanted;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const observed = partsInTimeZone(new Date(instant), timeZone);
    const observedAsUtc = Date.UTC(
      observed.year,
      observed.month - 1,
      observed.day,
      observed.hour,
      observed.minute,
      observed.second,
    );
    const correction = wanted - observedAsUtc;
    instant += correction;
    if (correction === 0) break;
  }
  return new Date(instant);
}

export function getLocalDayRange(now = new Date(), timeZone?: string) {
  if (timeZone) {
    const local = partsInTimeZone(now, timeZone);
    const startKey = `${local.year}-${pad(local.month)}-${pad(local.day)}`;
    const nextDate = new Date(Date.UTC(local.year, local.month - 1, local.day + 1));
    const nextKey = `${nextDate.getUTCFullYear()}-${pad(nextDate.getUTCMonth() + 1)}-${pad(nextDate.getUTCDate())}`;
    return {
      start: zonedDateTimeToUtc(`${startKey}T00:00`, timeZone),
      end: zonedDateTimeToUtc(`${nextKey}T00:00`, timeZone),
    };
  }
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}
