/**
 * Expected ("Dự kiến") dates for scheduled doses.
 *
 * expected = max(age-based recommended date, previous dose date + RECOMMENDED
 * interval). The earliest valid date ("sớm nhất") is previous + MINIMUM
 * interval and is only shown as detail. When the previous dose is not given
 * yet, its appointment or its own expected date is used and the later dose is
 * labelled "ước tính". A late dose never restarts a series. A saved
 * appointment always wins over the computed date. Display only: nothing here
 * creates reminders, push notifications or calendar events.
 *
 * All dates are UTC date-only values (as stored by `dateFromInput`); `today`
 * is the account-timezone calendar day as "YYYY-MM-DD".
 */
import {
  addCalendarMonths,
  babyMilestoneDate,
  babyMilestoneLabel,
  findChecklistRecord,
  hasUnknownDose,
  recordMatchesEntry,
  type ChecklistRecord,
  type ScheduleEntry,
} from "./checklist";
import { vaccineGroupName } from "./groups";
import {
  BABY_DOSE_INTERVALS,
  BABY_SCHEDULE,
  MOTHER_DOSE_INTERVALS,
  MOTHER_PRENATAL_SCHEDULE,
  type BabyScheduleEntry,
  type DoseInterval,
  type Span,
} from "./schedule";

export type OwnerKind = "baby" | "mother";
export type DatedRecord = ChecklistRecord & { administeredAt: Date };
export type DatedAppointment = { id: string; vaccineName: string; doseNumber: number | null; scheduledAt: Date };

/** Days after the expected date during which a dose counts as "Đến hạn" rather than "Quá hạn". */
export const DUE_WINDOW_DAYS = 14;
const dayMs = 86_400_000;

export type DoseStatus = "done" | "booked" | "upcoming" | "due" | "overdue" | "too-late" | "unscheduled";

export type PreviousDose = {
  entry: ScheduleEntry;
  date: Date;
  /** Where the previous date comes from: given, booked, or itself computed. */
  source: "record" | "appointment" | "projected";
  interval: DoseInterval;
};

export type DosePlan<R extends DatedRecord = DatedRecord, A extends DatedAppointment = DatedAppointment> = {
  kind: OwnerKind;
  entry: ScheduleEntry;
  record?: R;
  appointment?: A;
  /** Age milestone label, e.g. "3 tháng" (baby) or "Thai kỳ · mũi 2" (mother). */
  milestone: string;
  ageDate?: Date;
  /** Computed date; also set for booked doses so the booking link can prefill it. */
  expected?: Date;
  /** Previous dose + minimum interval. */
  earliest?: Date;
  basis: "age" | "interval" | "none";
  /** The interval-based date hangs on a previous dose that is not given yet. */
  estimated: boolean;
  previous?: PreviousDose;
  /** The previous dose is recorded but its dose number is ambiguous, so its date is not used. */
  unknownPrevious: boolean;
  /** Must be given before this date (rotavirus). */
  deadline?: Date;
  status: DoseStatus;
  /** The saved appointment is earlier than previous dose + minimum interval. */
  appointmentTooEarly: boolean;
};

export const utcDay = (date: Date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
export const isoDay = (date: Date) => date.toISOString().slice(0, 10);
/** dd/mm/yyyy */
export const formatDay = (date: Date) => isoDay(date).split("-").reverse().join("/");
/** dd/mm */
export const formatShortDay = (date: Date) => formatDay(date).slice(0, 5);

export function addSpan(date: Date, span: Span) {
  const result = addCalendarMonths(utcDay(date), span.months ?? 0);
  result.setUTCDate(result.getUTCDate() + (span.days ?? 0));
  return result;
}

export function spanLabel(span: Span) {
  const parts: string[] = [];
  if (span.months) parts.push(span.months % 12 === 0 ? `${span.months / 12} năm` : `${span.months} tháng`);
  if (span.days) parts.push(span.days % 7 === 0 ? `${span.days / 7} tuần` : `${span.days} ngày`);
  return parts.join(" ") || "0 ngày";
}

export const doseIntervals = (kind: OwnerKind) => (kind === "baby" ? BABY_DOSE_INTERVALS : MOTHER_DOSE_INTERVALS);
export const scheduleEntries = (kind: OwnerKind): ScheduleEntry[] =>
  kind === "baby" ? [...BABY_SCHEDULE].sort((a, b) => a.dueAgeDays - b.dueAgeDays) : MOTHER_PRENATAL_SCHEDULE;

/** The dose that follows `key` in its series, if a sourced interval links them. */
export function nextDoseEntry(kind: OwnerKind, key: string) {
  const next = Object.entries(doseIntervals(kind)).find(([, interval]) => interval.after === key)?.[0];
  return next ? scheduleEntries(kind).find((entry) => entry.key === next) : undefined;
}

export const isBabyEntry = (entry: ScheduleEntry): entry is BabyScheduleEntry => "dueAgeDays" in entry;

export const isOralDose = (entry: ScheduleEntry) =>
  entry.key.startsWith("rotavirus") || (entry.key.startsWith("polio-") && !entry.key.startsWith("polio-ipv"));
export const doseName = (entry: ScheduleEntry) => `${isOralDose(entry) ? "liều" : "mũi"} ${entry.doseNumber}`;

export const milestoneLabel = (entry: ScheduleEntry) =>
  "dueAgeDays" in entry ? babyMilestoneLabel(entry) : `Thai kỳ · mũi ${entry.doseNumber}`;

/** Pure rule: later of the age-based date and previous + recommended interval. */
export function expectedDoseDate({ ageDate, previous }: { ageDate?: Date; previous?: { date: Date; interval: DoseInterval } }) {
  const byInterval = previous ? addSpan(previous.date, previous.interval.recommended) : undefined;
  const earliest = previous ? addSpan(previous.date, previous.interval.min) : undefined;
  const age = ageDate ? utcDay(ageDate) : undefined;
  if (!age && !byInterval) return undefined;
  const basis: "age" | "interval" = byInterval && (!age || byInterval.getTime() > age.getTime()) ? "interval" : "age";
  return { date: basis === "interval" ? byInterval! : age!, basis, earliest };
}

function statusFor(expected: Date, today: string, deadline?: Date): DoseStatus {
  if (deadline && (expected.getTime() >= deadline.getTime() || today >= isoDay(deadline))) return "too-late";
  const day = isoDay(expected);
  if (today < day) return "upcoming";
  if (today <= isoDay(new Date(expected.getTime() + DUE_WINDOW_DAYS * dayMs))) return "due";
  return "overdue";
}

/**
 * Plans every scheduled dose for one person. `appointments` should be the
 * pending (not yet completed) appointments of that person.
 */
export function planDoses<R extends DatedRecord, A extends DatedAppointment>(
  kind: OwnerKind,
  { birth, records, appointments, today }: { birth?: Date | null; records: R[]; appointments: A[]; today: string },
): DosePlan<R, A>[] {
  const entries = scheduleEntries(kind);
  const intervals = doseIntervals(kind);
  const plans = new Map<string, DosePlan<R, A>>();

  // A record that only counts as dose 1 by default is not trusted as the
  // previous dose when another undetermined record or an earlier-dated later
  // dose of the same series makes its position unclear.
  const ambiguous = (record: R, entry: ScheduleEntry) => {
    if (!hasUnknownDose(record)) return false;
    if (records.filter((item) => hasUnknownDose(item) && recordMatchesEntry(item, entry)).length > 1) return true;
    const group = vaccineGroupName(entry);
    return entries.some((other) => {
      if (vaccineGroupName(other) !== group || other.doseNumber <= entry.doseNumber) return false;
      const later = findChecklistRecord(records, other);
      return later && later.id !== record.id && later.administeredAt.getTime() <= record.administeredAt.getTime();
    });
  };

  const plan = (entry: ScheduleEntry): DosePlan<R, A> => {
    const cached = plans.get(entry.key);
    if (cached) return cached;
    const record = findChecklistRecord(records, entry);
    const appointment = record ? undefined : appointments.find((item) => recordMatchesEntry(item, entry));
    const ageDate = birth && isBabyEntry(entry) ? babyMilestoneDate(birth, entry) : undefined;
    const deadline = birth && "completeBeforeAgeMonths" in entry && entry.completeBeforeAgeMonths
      ? addCalendarMonths(birth, entry.completeBeforeAgeMonths)
      : undefined;
    const interval = intervals[entry.key];
    let previous: PreviousDose | undefined;
    let unknownPrevious = false;
    const previousEntry = interval && entries.find((item) => item.key === interval.after);
    if (interval && previousEntry) {
      const before = plan(previousEntry);
      if (before.record) {
        if (ambiguous(before.record, previousEntry)) unknownPrevious = true;
        else previous = { entry: previousEntry, date: utcDay(before.record.administeredAt), source: "record", interval };
      } else if (before.appointment) {
        previous = { entry: previousEntry, date: utcDay(before.appointment.scheduledAt), source: "appointment", interval };
      } else if (before.expected && before.status !== "too-late") {
        previous = { entry: previousEntry, date: before.expected, source: "projected", interval };
      }
    }
    const computed = expectedDoseDate({ ageDate, previous });
    const basis = computed?.basis ?? "none";
    let status: DoseStatus;
    if (record) status = "done";
    else if (appointment) status = "booked";
    else if (!computed) status = "unscheduled";
    else status = statusFor(computed.date, today, deadline);
    const appointmentTooEarly = Boolean(
      appointment && computed?.earliest && previous && previous.source !== "projected" &&
        utcDay(appointment.scheduledAt).getTime() < computed.earliest.getTime(),
    );
    const result: DosePlan<R, A> = {
      kind,
      entry,
      record,
      appointment,
      milestone: milestoneLabel(entry),
      ageDate,
      expected: computed?.date,
      earliest: computed?.earliest,
      basis,
      estimated: basis === "interval" && previous?.source !== "record",
      previous,
      unknownPrevious,
      deadline,
      status,
      appointmentTooEarly,
    };
    plans.set(entry.key, result);
    return result;
  };

  return entries.map(plan);
}

function previousName(plan: DosePlan) {
  const previous = plan.previous!;
  const sameGroup = vaccineGroupName(previous.entry) === vaccineGroupName(plan.entry);
  return `${doseName(previous.entry)}${sameGroup ? "" : ` của ${vaccineGroupName(previous.entry)}`}`;
}

/** Small text explaining the expected date, e.g. "1 tháng sau mũi 1 (tiêm 30/10)". */
export function basisText(plan: DosePlan) {
  if (plan.basis === "interval" && plan.previous) {
    const { previous } = plan;
    const span = spanLabel(previous.interval.recommended);
    const when = previous.source === "record" ? ` (tiêm ${formatShortDay(previous.date)})`
      : previous.source === "appointment" ? ` (hẹn ${formatShortDay(previous.date)})` : "";
    return `${plan.estimated ? "ước tính · " : ""}${span} sau ${previousName(plan)}${when}`;
  }
  if (plan.basis === "age") {
    const age = plan.kind === "baby" ? `theo tuổi ${plan.milestone}` : "theo lịch";
    return plan.unknownPrevious ? `${age} · ${doseName(plan.entry).replace(/\d+$/, "")}trước thiếu số mũi nên chưa tính khoảng cách` : age;
  }
  return "Theo lịch cơ sở tiêm";
}

/** "sớm nhất dd/mm/yyyy" when the minimum interval allows an earlier date. */
export function earliestText(plan: DosePlan) {
  return plan.earliest && plan.expected && plan.earliest.getTime() < plan.expected.getTime()
    ? `sớm nhất ${formatDay(plan.earliest)}`
    : undefined;
}

export const STATUS_LABEL: Record<DoseStatus, string> = {
  done: "Đã ghi nhận",
  booked: "Đã có hẹn",
  upcoming: "Sắp tới",
  due: "Đến hạn",
  overdue: "Quá hạn",
  "too-late": "Quá tuổi",
  unscheduled: "Theo cơ sở tiêm",
};

/** Extra warning for a pending dose, if any. */
export function warningText(plan: DosePlan, today: string) {
  if (plan.status === "overdue") return "Quá hạn — tiêm bù sớm, không cần tiêm lại từ đầu.";
  if (plan.status === "too-late" && plan.deadline) {
    return today >= isoDay(plan.deadline)
      ? `Đã quá mốc phải hoàn thành (${formatDay(plan.deadline)}) — hỏi cơ sở tiêm.`
      : `Cần hoàn thành trước ${formatDay(plan.deadline)} — hỏi cơ sở tiêm, không tự dời quá mốc này.`;
  }
  if (plan.appointmentTooEarly && plan.earliest)
    return `Ngày hẹn sớm hơn khoảng cách tối thiểu (sớm nhất ${formatDay(plan.earliest)}) — kiểm tra lại với cơ sở tiêm.`;
  return undefined;
}

/** "Lịch chuẩn" ages for a series, e.g. "2 → 3 → 4 tháng tuổi". */
export function standardAgesLabel(entries: ScheduleEntry[]) {
  if (!entries.every((entry) => "dueAgeDays" in entry)) return "trong thai kỳ";
  const babyEntries = entries as Extract<ScheduleEntry, { dueAgeDays: number }>[];
  const plainMonths = babyEntries.every((entry) => entry.dueAgeMonths !== undefined && entry.dueAgeMonths > 0 && entry.dueAgeMonths < 12 && !entry.offsetDays);
  const ages = plainMonths ? babyEntries.map((entry) => String(entry.dueAgeMonths)) : babyEntries.map(babyMilestoneLabel);
  const unique = ages.filter((age, index) => ages.indexOf(age) === index);
  return plainMonths ? `${unique.join(" → ")} tháng tuổi` : unique.join(" → ");
}

/** The next dose still to give in a series (first not done), for headers. */
export function nextInSeries<P extends DosePlan>(plans: P[]) {
  return plans.find((plan) => plan.status !== "done");
}

/**
 * The computed dose to show on the home screen when no saved appointment
 * covers it: TCMR doses only, due within the next `aheadDays` and not more
 * than `behindDays` overdue (older gaps stay on the vaccination screen).
 */
export function nextExpectedDose<P extends DosePlan>(plans: P[], today: string, { aheadDays = 60, behindDays = 30 } = {}) {
  const from = isoDay(new Date(new Date(`${today}T00:00:00Z`).getTime() - behindDays * dayMs));
  const to = isoDay(new Date(new Date(`${today}T00:00:00Z`).getTime() + aheadDays * dayMs));
  return plans
    .filter((plan) => plan.entry.program === "free" && plan.expected && ["upcoming", "due", "overdue"].includes(plan.status))
    .filter((plan) => isoDay(plan.expected!) >= from && isoDay(plan.expected!) <= to)
    .sort((a, b) => a.expected!.getTime() - b.expected!.getTime())[0];
}

export const bookingHref = (plan: DosePlan) => `/vaccination-schedule?owner=${plan.kind}&book=${encodeURIComponent(plan.entry.key)}#dat-hen`;

/**
 * Suggested "Ngày hẹn tiếp theo" when completing an appointment for `entry`
 * on `administeredOn`: the next dose of the series, if one is linked.
 */
export function suggestNextAppointment(kind: OwnerKind, entry: ScheduleEntry, administeredOn: Date, birth?: Date | null) {
  const next = nextDoseEntry(kind, entry.key);
  if (!next) return undefined;
  const ageDate = birth && isBabyEntry(next) ? babyMilestoneDate(birth, next) : undefined;
  const computed = expectedDoseDate({ ageDate, previous: { date: administeredOn, interval: doseIntervals(kind)[next.key] } });
  if (!computed) return undefined;
  const earliest = computed.earliest && computed.earliest.getTime() < computed.date.getTime() ? ` (sớm nhất ${formatShortDay(computed.earliest)})` : "";
  return {
    entry: next,
    date: computed.date,
    earliest: computed.earliest,
    text: `Gợi ý: ${doseName(next)} dự kiến ${formatDay(computed.date)}${earliest} nếu tiêm hôm nay.`,
  };
}
