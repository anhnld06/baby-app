import type { BabyScheduleEntry, MotherScheduleEntry } from "./schedule";
// Group presentation only; schedule keys and dose matching stay unchanged.
export function vaccineGroupName(entry: BabyScheduleEntry | MotherScheduleEntry) {
  return entry.label.replace(/\s*[-–]\s*(mũi|liều|nhắc).*$/i, "").replace(/\s*\(sơ sinh\)/i, "");
}
