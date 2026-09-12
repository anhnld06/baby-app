export type CalendarReminder = {
  uid: string;
  title: string;
  date: Date;
  description: string;
};

export function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function icsDate(date: Date) {
  return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(date.getUTCDate()).padStart(2, "0")}`;
}

function icsTimestamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function event(reminder: CalendarReminder, generatedAt: Date) {
  return [
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(reminder.uid)}@vani-family`,
    `DTSTAMP:${icsTimestamp(generatedAt)}`,
    `DTSTART;VALUE=DATE:${icsDate(reminder.date)}`,
    `SUMMARY:${escapeIcsText(reminder.title)}`,
    `DESCRIPTION:${escapeIcsText(reminder.description)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P7D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcsText(`Còn 7 ngày: ${reminder.title}`)}`,
    "END:VALARM",
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcsText(`Ngày mai: ${reminder.title}`)}`,
    "END:VALARM",
    "END:VEVENT",
  ].join("\r\n");
}

export function buildIcsCalendar(reminders: CalendarReminder[], generatedAt = new Date()) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Vani Family//Family reminders//VI",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...reminders
      .sort((left, right) => left.date.getTime() - right.date.getTime())
      .map((reminder) => event(reminder, generatedAt)),
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

