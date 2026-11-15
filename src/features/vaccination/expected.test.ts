import { describe, expect, it } from "vitest";
import { BABY_SCHEDULE } from "./schedule";
import {
  addSpan,
  basisText,
  earliestText,
  expectedDoseDate,
  isoDay,
  nextExpectedDose,
  planDoses,
  standardAgesLabel,
  suggestNextAppointment,
  warningText,
  type DatedAppointment,
  type DatedRecord,
} from "./expected";

const day = (iso: string) => new Date(`${iso}T00:00:00Z`);
let seq = 0;
const record = (scheduleKey: string | null, administeredAt: string, extra: Partial<DatedRecord> = {}): DatedRecord => ({
  id: `r${++seq}`,
  scheduleKey,
  vaccineName: scheduleKey ?? "Hexaxim",
  doseNumber: null,
  administeredAt: day(administeredAt),
  ...extra,
});
const appointment = (vaccineName: string, scheduledAt: string, doseNumber: number | null = null): DatedAppointment => ({
  id: `a${++seq}`,
  vaccineName,
  doseNumber,
  scheduledAt: day(scheduledAt),
});
const baby = (birth: string, records: DatedRecord[], today: string, appointments: DatedAppointment[] = []) => {
  const plans = planDoses("baby", { birth: day(birth), records, appointments, today });
  return (key: string) => plans.find((plan) => plan.entry.key === key)!;
};
const iso = (date?: Date) => (date ? isoDay(date) : undefined);

describe("expected dose dates", () => {
  it("shifts the next dose after a late previous dose (recommended interval) and shows the earliest date", () => {
    const plan = baby("2026-08-01", [record("5in1-1", "2026-10-30")], "2026-11-09");
    const dose2 = plan("5in1-2");
    expect(iso(dose2.ageDate)).toBe("2026-11-01");
    expect(iso(dose2.expected)).toBe("2026-11-30");
    expect(iso(dose2.earliest)).toBe("2026-11-27");
    expect(dose2.basis).toBe("interval");
    expect(dose2.estimated).toBe(false);
    expect(dose2.status).toBe("upcoming");
    expect(basisText(dose2)).toBe("1 tháng sau mũi 1 (tiêm 30/10)");
    expect(earliestText(dose2)).toBe("sớm nhất 27/11/2026");
  });

  it("chains the third dose from the projected second dose and labels it ước tính", () => {
    const plan = baby("2026-08-01", [record("5in1-1", "2026-10-30")], "2026-11-09");
    const dose3 = plan("5in1-3");
    expect(iso(dose3.expected)).toBe("2026-12-30");
    expect(iso(dose3.earliest)).toBe("2026-12-28");
    expect(dose3.estimated).toBe(true);
    expect(dose3.previous?.source).toBe("projected");
    expect(basisText(dose3)).toBe("ước tính · 1 tháng sau mũi 2");
  });

  it("keeps the age-based date when the previous dose was on time or early", () => {
    const onTime = baby("2026-08-30", [record("5in1-1", "2026-10-30")], "2026-11-09")("5in1-2");
    expect(iso(onTime.expected)).toBe("2026-11-30");
    expect(onTime.basis).toBe("age");
    expect(basisText(onTime)).toBe("theo tuổi 3 tháng");
    const early = baby("2026-01-15", [record("5in1-1", "2026-03-10")], "2026-03-20")("5in1-2");
    expect(iso(early.expected)).toBe("2026-04-15");
    expect(early.basis).toBe("age");
  });

  it("clamps calendar months at month end", () => {
    expect(isoDay(addSpan(day("2026-03-31"), { months: 1 }))).toBe("2026-04-30");
    expect(isoDay(addSpan(day("2026-01-31"), { days: 28 }))).toBe("2026-02-28");
    const plan = baby("2025-12-31", [record("5in1-1", "2026-03-31")], "2026-04-01");
    expect(iso(plan("5in1-2").expected)).toBe("2026-04-30");
    expect(iso(plan("5in1-2").earliest)).toBe("2026-04-28");
  });

  it("uses age milestones when the previous dose is missing, and an appointment when one is saved", () => {
    const missing = baby("2026-08-01", [], "2026-09-01")("5in1-2");
    expect(iso(missing.expected)).toBe("2026-11-01");
    expect(missing.basis).toBe("age");
    const plan = baby("2026-01-15", [], "2026-04-01", [appointment("5 trong 1 / 6 trong 1 - mũi 1", "2026-04-20")]);
    expect(plan("5in1-1").status).toBe("booked");
    expect(iso(plan("5in1-2").expected)).toBe("2026-05-20");
    expect(basisText(plan("5in1-2"))).toBe("ước tính · 1 tháng sau mũi 1 (hẹn 20/04)");
    expect(iso(plan("5in1-3").expected)).toBe("2026-06-20");
  });

  it("names the other series for a booster and never restarts a late series", () => {
    const plan = baby("2026-01-15", [record("5in1-1", "2026-03-15"), record("5in1-2", "2026-04-15"), record("5in1-3", "2027-06-01")], "2027-06-02");
    const booster = plan("5in1-booster");
    expect(iso(booster.expected)).toBe("2027-12-01");
    expect(basisText(booster)).toBe("6 tháng sau mũi 3 của 5 trong 1 / 6 trong 1 (tiêm 01/06)");
  });

  it("warns instead of shifting rotavirus past the 6-month limit", () => {
    const late = baby("2026-01-15", [record("rotavirus-1", "2026-06-20")], "2026-06-21")("rotavirus-2");
    expect(late.status).toBe("too-late");
    expect(warningText(late, "2026-06-21")).toBe("Cần hoàn thành trước 15/07/2026 — hỏi cơ sở tiêm, không tự dời quá mốc này.");
    const fits = baby("2026-01-15", [record("rotavirus-1", "2026-06-01")], "2026-06-02")("rotavirus-2");
    expect(iso(fits.expected)).toBe("2026-07-01");
    expect(fits.status).toBe("upcoming");
    const missed = baby("2026-01-15", [], "2026-07-15");
    expect(missed("rotavirus-1").status).toBe("too-late");
    expect(missed("rotavirus-2").status).toBe("too-late");
    expect(warningText(missed("rotavirus-2"), "2026-07-15")).toContain("Đã quá mốc phải hoàn thành (15/07/2026)");
  });

  it("lets a saved appointment win and warns when it is earlier than the minimum interval", () => {
    const early = baby("2026-08-01", [record("5in1-1", "2026-10-30")], "2026-11-09", [appointment("Hexaxim", "2026-11-20", 2)])("5in1-2");
    expect(early.status).toBe("booked");
    expect(early.appointmentTooEarly).toBe(true);
    expect(warningText(early, "2026-11-09")).toBe("Ngày hẹn sớm hơn khoảng cách tối thiểu (sớm nhất 27/11/2026) — kiểm tra lại với cơ sở tiêm.");
    const fine = baby("2026-08-01", [record("5in1-1", "2026-10-30")], "2026-11-09", [appointment("Hexaxim", "2026-12-05", 2)])("5in1-2");
    expect(fine.appointmentTooEarly).toBe(false);
  });

  it("does not use a record without a dose number as the previous dose when it is ambiguous", () => {
    const single = baby("2026-08-01", [record(null, "2026-10-30")], "2026-11-09")("5in1-2");
    expect(single.basis).toBe("interval");
    const two = baby("2026-08-01", [record(null, "2026-10-30"), record(null, "2026-11-05")], "2026-11-09")("5in1-2");
    expect(two.unknownPrevious).toBe(true);
    expect(two.basis).toBe("age");
    expect(basisText(two)).toBe("theo tuổi 3 tháng · mũi trước thiếu số mũi nên chưa tính khoảng cách");
    // "Hexaxim" without a number dated after an explicit later dose is not trusted as dose 1.
    const contradicted = baby("2026-08-01", [record(null, "2026-12-01"), record(null, "2026-11-15", { doseNumber: 3 })], "2026-12-02")("5in1-2");
    expect(contradicted.unknownPrevious).toBe(true);
    expect(contradicted.previous).toBeUndefined();
    // An explicitly numbered previous dose is always used.
    const numbered = baby("2026-08-01", [record(null, "2026-12-01"), record(null, "2026-11-01", { doseNumber: 2 })], "2026-12-02")("5in1-3");
    expect(numbered.previous?.source).toBe("record");
    expect(iso(numbered.expected)).toBe("2026-12-01");
  });

  it("uses the account-timezone day for status and date-only values without shifting", () => {
    const at = (today: string) => baby("2026-08-01", [record("5in1-1", "2026-10-30")], today)("5in1-2").status;
    expect(at("2026-11-29")).toBe("upcoming");
    expect(at("2026-11-30")).toBe("due");
    expect(at("2026-12-14")).toBe("due");
    expect(at("2026-12-15")).toBe("overdue");
    const withTime = baby("2026-08-01", [{ ...record("5in1-1", "2026-10-30"), administeredAt: new Date("2026-10-30T16:59:00Z") }], "2026-11-09")("5in1-2");
    expect(iso(withTime.expected)).toBe("2026-11-30");
    expect(warningText(baby("2026-08-01", [record("5in1-1", "2026-10-30")], "2026-12-15")("5in1-2"), "2026-12-15"))
      .toBe("Quá hạn — tiêm bù sớm, không cần tiêm lại từ đầu.");
  });

  it("computes the mother's tetanus dose 2 from dose 1 only", () => {
    const none = planDoses("mother", { records: [], appointments: [], today: "2026-04-01" });
    expect(none.map((plan) => plan.status)).toEqual(["unscheduled", "unscheduled"]);
    const plans = planDoses("mother", { records: [record("tetanus-1", "2026-03-31")], appointments: [], today: "2026-04-01" });
    expect(iso(plans[1].expected)).toBe("2026-04-30");
    expect(basisText(plans[1])).toBe("1 tháng sau mũi 1 (tiêm 31/03)");
    expect(earliestText(plans[1])).toBeUndefined();
  });

  it("leaves unsourced series on age milestones", () => {
    const plan = baby("2026-01-15", [record("meningo-bc-1", "2026-09-01")], "2026-09-02");
    expect(plan("meningo-bc-2").basis).toBe("age");
    expect(plan("mr-booster").previous).toBeUndefined();
  });

  it("labels standard ages and picks the home-screen dose", () => {
    const series = (prefix: string) => BABY_SCHEDULE.filter((entry) => entry.key.startsWith(prefix) && entry.key !== "5in1-booster");
    expect(standardAgesLabel(series("5in1-"))).toBe("2 → 3 → 4 tháng tuổi");
    expect(standardAgesLabel(series("je-"))).toBe("1 tuổi → 1 tuổi + 14 ngày → 2 tuổi");
    const plans = planDoses("baby", { birth: day("2026-08-01"), records: [record("5in1-1", "2026-10-30"), record("polio-1", "2026-10-30"), record("rotavirus-1", "2026-10-30"), record("hepb-birth", "2026-08-01"), record("bcg", "2026-08-01")], appointments: [], today: "2026-11-09" });
    expect(nextExpectedDose(plans, "2026-11-09")?.entry.key).toBe("5in1-2");
    expect(nextExpectedDose(plans, "2026-11-09", { aheadDays: 7 })).toBeUndefined();
  });

  it("suggests the next appointment from the completion date", () => {
    const entry = BABY_SCHEDULE.find((item) => item.key === "5in1-1")!;
    const next = suggestNextAppointment("baby", entry, day("2026-10-30"), day("2026-08-01"));
    expect(next?.entry.key).toBe("5in1-2");
    expect(iso(next?.date)).toBe("2026-11-30");
    expect(next?.text).toBe("Gợi ý: mũi 2 dự kiến 30/11/2026 (sớm nhất 27/11) nếu tiêm hôm nay.");
    expect(suggestNextAppointment("baby", BABY_SCHEDULE.find((item) => item.key === "bcg")!, day("2026-10-30"))).toBeUndefined();
    expect(expectedDoseDate({})).toBeUndefined();
  });
});
