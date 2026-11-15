import Link from "next/link";
import { CalendarClock, Clock3, Info, TriangleAlert } from "lucide-react";
import { EditRecordLink } from "@/components/edit-record-navigation";
import { VaccinationCheck } from "@/components/vaccination-check";
import { vaccineGroupName } from "@/features/vaccination/groups";
import {
  basisText,
  bookingHref,
  doseName,
  earliestText,
  formatDay,
  isOralDose,
  nextInSeries,
  standardAgesLabel,
  warningText,
  type DatedAppointment,
  type DatedRecord,
  type DosePlan,
} from "@/features/vaccination/expected";

export type ChecklistPlan = DosePlan<DatedRecord & { appointment?: { id: string } | null }, DatedAppointment>;

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const cellTone: Record<string, string> = {
  due: "text-amber-800 dark:text-amber-200",
  overdue: "text-rose-700 dark:text-rose-300",
  "too-late": "text-rose-700 dark:text-rose-300",
};

function nextLine(plan: ChecklistPlan | undefined, total: number, unit: string) {
  if (!plan) return `Đã ghi nhận đủ ${total} ${unit}`;
  const name = capitalize(doseName(plan.entry));
  if (plan.appointment) return `Tiếp theo: ${name} · hẹn ${formatDay(plan.appointment.scheduledAt)}`;
  if (plan.status === "too-late") return `Tiếp theo: ${name} · đã quá mốc tuổi — hỏi cơ sở tiêm`;
  if (plan.expected) return `Tiếp theo: ${name} · dự kiến ${formatDay(plan.expected)}`;
  return `Tiếp theo: ${name} · theo lịch cơ sở tiêm`;
}

export function VaccineDoseGroups({ plans, kind, ownerId, today }: { plans: ChecklistPlan[]; kind: "baby" | "mother"; ownerId: string; today: string }) {
  const groups = [...new Set(plans.map((plan) => vaccineGroupName(plan.entry)))];
  return <div className="divide-y divide-border/60 overflow-hidden rounded-[2rem] border bg-card">{groups.map((group) => {
    const doses = plans.filter((plan) => vaccineGroupName(plan.entry) === group);
    const notes = [...new Set(doses.flatMap((plan) => plan.entry.note ? [plan.entry.note] : []))];
    const combo = group.includes("6 trong 1");
    const free = doses.some((plan) => plan.entry.program === "free");
    const unit = doses.every((plan) => isOralDose(plan.entry)) ? "liều" : "mũi";
    const next = nextInSeries(doses);
    const shifted = doses.some((plan) => !plan.record && !plan.appointment && plan.basis === "interval" && plan.previous?.source === "record");
    const details = doses.flatMap((plan) => {
      if (plan.record) return [];
      const lines = [warningText(plan, today), !plan.appointment && plan.status !== "too-late" ? earliestText(plan) : undefined, plan.basis === "interval" ? plan.previous?.interval.confirm : undefined]
        .filter((line): line is string => Boolean(line));
      return lines.map((line) => ({ key: `${plan.entry.key}-${line}`, text: `${capitalize(doseName(plan.entry))}: ${line}`, warning: line === warningText(plan, today) }));
    });
    const bookable = next && !next.appointment && next.expected && next.status !== "too-late" ? next : undefined;
    return <article key={group} data-vaccine-group className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2"><h3 className="text-base font-semibold sm:text-lg">{group}</h3><span className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium ${combo || !free ? "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-200" : "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-200"}`}><span className="size-1.5 rounded-full bg-current"/>{combo ? "TCMR / dịch vụ" : free ? "Tiêm chủng mở rộng" : "Tiêm dịch vụ"}</span></div>
      <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground"><Clock3 className="mt-0.5 size-4 shrink-0"/><span>Lịch chuẩn: {standardAgesLabel(doses.map((plan) => plan.entry))} · {doses.length} {unit}</span></p>
      <p data-series-next className="mt-1 flex items-start gap-2 text-sm font-semibold"><CalendarClock className="mt-0.5 size-4 shrink-0 text-primary"/><span>{nextLine(next, doses.length, unit)}</span></p>
      {shifted && <p className="mt-2 rounded-xl bg-secondary/60 px-3 py-2 text-xs leading-5 text-muted-foreground">Mũi trước tiêm muộn nên các mũi sau lùi theo khoảng cách giữa các mũi — không cần tiêm lại từ đầu. Ngày chính xác theo hẹn của cơ sở tiêm.</p>}
      {notes.length > 0 && <div className="mt-2 flex items-start gap-2 text-xs leading-5 text-muted-foreground"><Info className="mt-0.5 size-4 shrink-0"/><div><p>{notes[0]}</p>{notes.length > 1 && <details><summary className="min-h-9 cursor-pointer content-center text-primary">Lưu ý từng mũi</summary>{notes.slice(1).map((note) => <p key={note} className="mt-2">{note}</p>)}</details>}</div></div>}
      <div className="mt-5 grid gap-x-2 gap-y-4" style={{ gridTemplateColumns: `repeat(${doses.length >= 4 ? 4 : 3},minmax(0,1fr))` }}>{doses.map((plan) => {
        const { entry, record, appointment } = plan;
        const oral = isOralDose(entry);
        const label = `${capitalize(doseName(entry))}${oral ? " (uống)" : ""}`;
        const href = record ? record.appointment ? `/vaccination-schedule?edit=${record.appointment.id}&owner=${kind}` : `/vaccination-schedule?record=${record.id}&owner=${kind}` : appointment ? `/vaccination-schedule?edit=${appointment.id}&owner=${kind}` : undefined;
        const pendingDate = !record && !appointment && plan.status !== "too-late" ? plan.expected : undefined;
        return <div key={entry.key} data-schedule-key={entry.key} data-schedule-owner={kind} data-dose-status={plan.status} className="min-w-0 text-center">
          <VaccinationCheck compact kind={kind} ownerId={ownerId} entryKey={entry.key} label={entry.label} doseLabel={label} checked={!!record} today={today}/>
          {record ? <p className="mt-1 text-xs leading-5 text-teal-700 dark:text-teal-300">{formatDay(record.administeredAt)}</p>
            : appointment ? <p className="mt-1 text-xs leading-5 text-muted-foreground">Hẹn {formatDay(appointment.scheduledAt)}{plan.appointmentTooEarly && <TriangleAlert aria-label="Hẹn sớm hơn khoảng cách tối thiểu" className="ml-1 inline size-3.5 text-amber-600"/>}</p>
            : pendingDate ? <><p className={`mt-1 text-xs font-semibold leading-4 ${cellTone[plan.status] ?? "text-foreground"}`}>Dự kiến<br/>{formatDay(pendingDate)}</p><p className="mt-1 text-xs leading-4 text-muted-foreground">{basisText(plan)}</p></>
            : <p className={`mt-1 text-xs leading-5 ${cellTone[plan.status] ?? "text-muted-foreground"}`}>{plan.status === "too-late" ? "Quá mốc tuổi" : plan.milestone}</p>}
          {href && <EditRecordLink scroll={false} replace href={href} className="inline-flex min-h-11 items-center justify-center text-xs text-primary">{record ? "Sửa ngày" : "Sửa hẹn"}</EditRecordLink>}
        </div>;
      })}</div>
      {details.length > 0 && <ul className="mt-4 space-y-1 text-xs leading-5">{details.map((line) => <li key={line.key} className={line.warning ? "text-amber-900 dark:text-amber-100" : "text-muted-foreground"}>{line.text}</li>)}</ul>}
      {bookable && <Link replace href={bookingHref(bookable)} className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-primary">Đặt hẹn ngày này ({doseName(bookable.entry)} · {formatDay(bookable.expected!)})</Link>}
    </article>;
  })}</div>;
}
