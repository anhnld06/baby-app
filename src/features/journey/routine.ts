import { zonedDateTimeToUtc } from "@/lib/date";
export const ROUTINE_PRESETS = {
  EASY3: {
    title: "EASY 3 · mẫu 3 giờ",
    feedingMinutes: 25,
    awakeMinutes: 35,
    sleepMinutes: 120,
  },
  EASY35: {
    title: "EASY 3.5 · mẫu 3,5 giờ",
    feedingMinutes: 25,
    awakeMinutes: 65,
    sleepMinutes: 120,
  },
  EASY4: {
    title: "EASY 4 · mẫu 4 giờ",
    feedingMinutes: 30,
    awakeMinutes: 90,
    sleepMinutes: 120,
  },
} as const;
export function presetForAge(days: number): keyof typeof ROUTINE_PRESETS {
  return days < 90 ? "EASY3" : days < 150 ? "EASY35" : "EASY4";
}
export type RoutineSettings = {
  method: string;
  dayStart: string;
  dayEnd: string;
  feedingMinutes: number;
  awakeMinutes: number;
  sleepMinutes: number;
  adaptToLogs: boolean;
};
export type RoutineActual = {
  id: string;
  kind: "feed" | "sleep" | "wake";
  start: Date;
  end: Date | null;
  active: boolean;
  detail: string;
  href: string;
};
export type RoutineRow = {
  id: string;
  kind: "feed" | "play" | "sleep" | "wake";
  planned: Date;
  expectedEnd: Date;
  actual?: RoutineActual;
};
export function resolveRoutine(settings: RoutineSettings | null, days: number) {
  const method =
    !settings || settings.method === "AUTO"
      ? presetForAge(days)
      : settings.method;
  const preset =
    ROUTINE_PRESETS[method as keyof typeof ROUTINE_PRESETS] ??
    ROUTINE_PRESETS.EASY3;
  const resolved: RoutineSettings = {
    method: "AUTO",
    dayStart: "06:30",
    dayEnd: "19:00",
    adaptToLogs: true,
    ...ROUTINE_PRESETS.EASY3,
    ...settings,
    ...(settings?.method === "CUSTOM" ? {} : preset),
  };
  return { method, settings: resolved };
}
export function buildRoutine(
  day: string,
  timeZone: string,
  settings: RoutineSettings,
  actuals: RoutineActual[],
): RoutineRow[] {
  const start = zonedDateTimeToUtc(`${day}T${settings.dayStart}`, timeZone);
  const end = zonedDateTimeToUtc(`${day}T${settings.dayEnd}`, timeZone);
  const used = new Set<string>();
  const rows: RoutineRow[] = [];
  let cursor = start.getTime();
  let previousActual = -Infinity;
  const add = (kind: RoutineRow["kind"], minutes: number, index: number) => {
    const planned = new Date(cursor);
    const candidates = actuals.filter(
      (a) =>
        a.kind === kind &&
        !used.has(a.id + a.kind) &&
        a.start.getTime() >= previousActual &&
        Math.abs(a.start.getTime() - cursor) <= 90 * 60000,
    );
    const actual = candidates.sort(
      (a, b) =>
        Math.abs(a.start.getTime() - cursor) -
        Math.abs(b.start.getTime() - cursor),
    )[0];
    if (actual) {
      used.add(actual.id + actual.kind);
      previousActual = actual.start.getTime();
    }
    let expected = cursor + minutes * 60000;
    if (actual && settings.adaptToLogs)
      expected =
        kind === "wake"
          ? actual.start.getTime()
          : (actual.end?.getTime() ?? actual.start.getTime() + minutes * 60000);
    rows.push({
      id: `${day}-${kind}-${index}`,
      kind,
      planned,
      expectedEnd: new Date(expected),
      actual,
    });
    cursor =
      actual && settings.adaptToLogs
        ? Math.max(actual.start.getTime(), expected)
        : expected;
  };
  add("wake", 0, 0);
  for (let i = 0; cursor < end.getTime() && i < 16; i++) {
    add("feed", settings.feedingMinutes, i);
    if (cursor >= end.getTime()) break;
    add("play", settings.awakeMinutes, i);
    if (cursor >= end.getTime()) break;
    add(
      "sleep",
      Math.min(
        settings.sleepMinutes,
        Math.max(1, (end.getTime() - cursor) / 60000),
      ),
      i,
    );
    if (cursor < end.getTime()) add("wake", 0, i + 1);
  }
  // Every actual record remains visible even when too far from a planned slot.
  for (const actual of actuals)
    if (!used.has(actual.id + actual.kind))
      rows.push({
        id: `actual-${actual.kind}-${actual.id}`,
        kind: actual.kind,
        planned: actual.start,
        expectedEnd: actual.end ?? actual.start,
        actual,
      });
  return rows.sort(
    (a, b) =>
      (a.actual?.start.getTime() ?? a.planned.getTime()) -
      (b.actual?.start.getTime() ?? b.planned.getTime()),
  );
}
