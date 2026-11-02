import { describe, expect, it } from "vitest";
import { BABY_SCHEDULE } from "./schedule";
import { babyMilestoneDate, findChecklistRecord, recordMatchesEntry, scheduleEntry } from "./checklist";

const entry = (key: string) => BABY_SCHEDULE.find((item) => item.key === key)!;
const record = (name: string, dose: number | null = 1) => ({ id: "record", vaccineName: name, doseNumber: dose });

describe("vaccination checklist", () => {
  it("keeps every later dose visible in chronological reference milestones", () => {
    expect(entry("5in1-1").dueAgeMonths).toBe(2);
    expect(entry("5in1-2").dueAgeMonths).toBe(3);
    expect(entry("5in1-3").dueAgeMonths).toBe(4);
    expect(entry("polio-ipv-2").dueAgeMonths).toBe(9);
    expect(entry("td-7-years").dueAgeMonths).toBe(84);
    expect(new Set(BABY_SCHEDULE.map((item) => item.key)).size).toBe(BABY_SCHEDULE.length);
  });
  it("uses calendar months and clamps end-of-month birthdays", () => {
    expect(babyMilestoneDate(new Date("2026-08-28Z"), entry("5in1-1")).toISOString().slice(0, 10)).toBe("2026-10-28");
    expect(babyMilestoneDate(new Date("2025-12-31Z"), entry("5in1-1")).toISOString().slice(0, 10)).toBe("2026-02-28");
    expect(babyMilestoneDate(new Date("2026-08-28Z"), entry("je-2")).toISOString().slice(0, 10)).toBe("2027-09-11");
  });
  it("recognizes old journal entries and aliases without marking later doses done", () => {
    expect(findChecklistRecord([record("Viêm gan B (mũi 1)")], entry("hepb-birth"))?.id).toBe("record");
    expect(recordMatchesEntry(record("Hexaxim", 1), entry("5in1-1"))).toBe(true);
    expect(recordMatchesEntry(record("Hexaxim", 1), entry("5in1-2"))).toBe(false);
    expect(recordMatchesEntry(record("BCG", null), entry("bcg"))).toBe(true);
    expect(recordMatchesEntry(record("Hexaxim - mũi 2", null), entry("5in1-2"))).toBe(true);
  });
  it("does not confuse oral and injectable polio, or MR with monovalent measles", () => {
    expect(recordMatchesEntry(record("Bại liệt tiêm IPV", 1), entry("polio-1"))).toBe(false);
    expect(recordMatchesEntry(record("OPV", 1), entry("polio-ipv"))).toBe(false);
    expect(recordMatchesEntry(record("Sởi - Rubella", 1), entry("measles-1"))).toBe(false);
    expect(recordMatchesEntry(record("Sởi đơn", 1), entry("measles-1"))).toBe(true);
    expect(recordMatchesEntry(record("IPV", 4), entry("polio-ipv"))).toBe(true);
  });
  it("keeps a stable checklist identity after editing a recording's display name", () => {
    const saved = { ...record("Tên bác sĩ ghi", 8), scheduleKey: "5in1-1" };
    expect(findChecklistRecord([saved], entry("5in1-1"))).toEqual(saved);
    expect(recordMatchesEntry(saved, entry("5in1-2"))).toBe(false);
    expect(scheduleEntry("baby", "not-a-dose")).toBeUndefined();
    expect(scheduleEntry("mother", "tetanus-1")?.doseNumber).toBe(1);
  });
});
