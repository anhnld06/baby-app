import Link from "next/link";
import { VaccineDoseGroups, type ChecklistPlan } from "@/components/vaccine-dose-groups";
import { VaccinationViewSwitch } from "@/components/vaccination-view-switch";
import { EditRecordLink } from "@/components/edit-record-navigation";
import { VaccinationCheck } from "@/components/vaccination-check";
import {
  STATUS_LABEL,
  basisText,
  bookingHref,
  earliestText,
  formatDay,
  isoDay,
  warningText,
} from "@/features/vaccination/expected";

const statusTone: Record<string, string> = {
  due: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100",
  overdue: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-100",
  "too-late": "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-100",
};

/** Date a pending dose is planned for: the saved appointment wins over the computed date. */
const plannedDate = (plan: ChecklistPlan) => plan.appointment?.scheduledAt ?? (plan.status === "too-late" ? undefined : plan.expected);

export function VaccinationChecklist({ kind, ownerId, name, plans, today, view = "vaccine" }: {
  kind: "baby" | "mother";
  ownerId: string;
  name: string;
  plans: ChecklistPlan[];
  /** Account-timezone day, "YYYY-MM-DD". */
  today: string;
  view?: string;
}) {
  const done = plans.filter((plan) => plan.record).length;
  const upcoming = plans
    .filter((plan) => !plan.record && plannedDate(plan) && isoDay(plannedDate(plan)!) >= today)
    .sort((a, b) => plannedDate(a)!.getTime() - plannedDate(b)!.getTime());
  const next = upcoming[0];
  const nextRows = next ? upcoming.filter((plan) => isoDay(plannedDate(plan)!) === isoDay(plannedDate(next)!)) : [];
  const overdue = plans.filter((plan) => plan.status === "overdue" && plan.entry.program === "free").length;
  const groups = [...new Set(plans.map((plan) => plan.milestone))];
  return (
    <section aria-label={`Danh sách mũi tiêm của ${name}`} className="mb-7 space-y-4">
      <div className="rounded-3xl border border-primary/20 bg-secondary/40 p-5">
        <h2 className="text-lg font-semibold">{kind === "baby" ? `Lịch tiêm chủng · ${name}` : `Các mũi tiêm của mẹ · ${name}`}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{done}/{plans.length} mũi đã ghi nhận</p>
        {next && <div className="mt-3 rounded-2xl bg-background/70 p-3">
          <p className="text-sm font-semibold text-primary">Tiếp theo: {next.appointment ? "hẹn" : "dự kiến"} {formatDay(plannedDate(next)!)}</p>
          <ul className="mt-1 space-y-1 text-xs leading-5 text-muted-foreground">{nextRows.map((plan) => <li key={plan.entry.key}>{plan.entry.label}{plan.appointment ? " · đã có hẹn" : ` · ${basisText(plan)}`}</li>)}</ul>
        </div>}
        {overdue > 0 && <p className="mt-3 rounded-2xl bg-rose-50 p-3 text-xs leading-5 text-rose-900 dark:bg-rose-950/40 dark:text-rose-100">{overdue} mũi TCMR quá hạn — nên tiêm bù sớm, không cần tiêm lại từ đầu.</p>}
        <details className="mt-2 text-xs leading-5 text-muted-foreground">
          <summary className="min-h-9 cursor-pointer content-center text-primary">Cách tính ngày dự kiến</summary>
          <p>Ngày dự kiến theo mốc tuổi của lịch tiêm; nếu mũi trước tiêm muộn, mũi sau lùi theo khoảng cách khuyến nghị giữa các mũi (“sớm nhất” là khoảng cách tối thiểu). Mũi trước chưa tiêm thì ngày của mũi sau là ước tính. Tiêm muộn không phải tiêm lại từ đầu.</p>
          <p className="mt-2">Đây là ngày tham khảo, không tự tạo nhắc nhở. Ngày hẹn đã lưu luôn được ưu tiên; ngày chính xác theo cơ sở tiêm.</p>
          <p className="mt-2">Tích một mũi để ghi đã tiêm và chọn ngày tiêm thực tế; có thể sửa ngày và thêm thông tin sau.</p>
        </details>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">{kind === "baby" ? "Lịch vắc-xin phối hợp theo cơ sở tiêm; không cần tích tất cả lựa chọn thay thế." : "Số mũi và thời điểm tiêm uốn ván tùy tiền sử tiêm, theo lịch cơ sở tiêm."}</p>
      </div>
      <VaccinationViewSwitch />
      {view === "vaccine" ? <VaccineDoseGroups plans={plans} kind={kind} ownerId={ownerId} today={today} /> : groups.map((group) => (
        <div key={group} className="space-y-2">
          <h3 className="px-1 text-sm font-semibold">{group}</h3>
          <div className="space-y-2">
          {plans.filter((plan) => plan.milestone === group).map((plan) => {
            const { entry, record, appointment } = plan;
            const warning = warningText(plan, today);
            const earliest = earliestText(plan);
            const pendingDate = !record && !appointment && plan.status !== "too-late" ? plan.expected : undefined;
            const confirm = plan.basis === "interval" ? plan.previous?.interval.confirm : undefined;
            return (
            <article key={entry.key} data-schedule-key={entry.key} data-schedule-owner={kind} data-dose-status={plan.status} className={`rounded-2xl border p-4 ${record ? "border-emerald-600/20 bg-emerald-50/40 dark:bg-emerald-950/15" : "border-border/60 bg-card"}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h4 className="min-w-0 flex-1 font-medium">{entry.label}</h4>
                <span className={`rounded-full px-2 py-1 text-xs ${statusTone[plan.status] ?? "bg-secondary text-muted-foreground"}`}>{STATUS_LABEL[plan.status]}</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {record ? `Đã tiêm ${formatDay(record.administeredAt)}` : appointment ? `Ngày hẹn: ${formatDay(appointment.scheduledAt)}` : pendingDate ? <strong className="font-semibold text-foreground">Dự kiến {formatDay(pendingDate)}</strong> : plan.status === "too-late" ? "Chưa ghi nhận" : "Theo lịch cơ sở tiêm"}
                {" · "}{entry.program === "free" ? "TCMR" : "Dịch vụ / theo tư vấn"}
              </p>
              {pendingDate && <p className="text-xs leading-5 text-muted-foreground">{basisText(plan)}{earliest ? ` · ${earliest}` : ""}</p>}
              {confirm && !record && <p className="text-xs leading-5 text-muted-foreground">{confirm}</p>}
              {warning && <p className="mt-1 rounded-xl bg-amber-50 px-2 py-1 text-xs leading-5 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">{warning}</p>}
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <VaccinationCheck kind={kind} ownerId={ownerId} entryKey={entry.key} label={entry.label} checked={Boolean(record)} today={today} />
                {record && <EditRecordLink scroll={false} replace href={record.appointment ? `/vaccination-schedule?edit=${record.appointment.id}&owner=${kind}` : `/vaccination-schedule?record=${record.id}&owner=${kind}`} className="inline-flex min-h-11 items-center text-xs text-primary">Sửa ngày / ghi chú</EditRecordLink>}
                {!record && appointment && <EditRecordLink scroll={false} replace href={`/vaccination-schedule?edit=${appointment.id}&owner=${kind}`} className="inline-flex min-h-11 items-center text-xs text-primary">Sửa ngày hẹn</EditRecordLink>}
                {pendingDate && <Link replace href={bookingHref(plan)} className="inline-flex min-h-11 items-center text-xs text-primary">Đặt hẹn ngày này</Link>}
              </div>
              {entry.note && <details className="mt-1 text-xs text-muted-foreground"><summary className="min-h-9 cursor-pointer content-center">Lưu ý mũi này</summary><p className="pb-2 leading-5">{entry.note}</p></details>}
            </article>
            );
          })}
          </div>
        </div>
      ))}
      {kind === "baby" && <a href="https://nihe.org.vn/chuyen-mon/tiem-chung-vac-xin/cac-vac-xin-trong-tiem-chung-mo-rong/" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-xs text-primary">Nguồn mốc TCMR: Viện Vệ sinh dịch tễ Trung ương</a>}
    </section>
  );
}
