import { VaccineDoseGroups } from "@/components/vaccine-dose-groups";
import { VaccinationViewSwitch } from "@/components/vaccination-view-switch";
import { EditRecordLink } from "@/components/edit-record-navigation";
import { BABY_SCHEDULE, MOTHER_PRENATAL_SCHEDULE } from "@/features/vaccination/schedule";
import { babyMilestoneDate, babyMilestoneLabel, findChecklistRecord, recordMatchesEntry, type ChecklistRecord } from "@/features/vaccination/checklist";
import { VaccinationCheck } from "@/components/vaccination-check";

type Record = ChecklistRecord & { administeredAt: Date; appointment?: { id: string } | null };
type Appointment = { id: string; vaccineName: string; doseNumber: number | null; scheduledAt: Date };
export function VaccinationChecklist({ kind, ownerId, name, birth, records, appointments, today, view = "vaccine" }: {
  kind: "baby" | "mother";
  ownerId: string;
  name: string;
  birth?: Date;
  records: Record[];
  appointments: Appointment[];
  today: string;
  view?: string;
}) {
  const entries = kind === "baby" ? [...BABY_SCHEDULE].sort((a, b) => a.dueAgeDays - b.dueAgeDays) : MOTHER_PRENATAL_SCHEDULE;
  const rows = entries.map((entry) => {
    const record = findChecklistRecord(records, entry);
    const appointment = appointments.find((item) => recordMatchesEntry(item, entry));
    const date = birth && "dueAgeDays" in entry ? babyMilestoneDate(birth, entry).toISOString().slice(0, 10) : undefined;
    return { entry, record, appointment, date, milestone: "dueAgeDays" in entry ? babyMilestoneLabel(entry) : `Thai kỳ · mũi ${entry.doseNumber}` };
  });
  const done = rows.filter((row) => row.record).length;
  const next = rows.find((row) => !row.record && row.date && row.date >= today);
  const nextRows = next ? rows.filter((row) => !row.record && row.date === next.date) : [];
  const dateLabel = (day: string) => day.split("-").reverse().join("/");
  const groupOf = (row: typeof rows[number]) => view === "vaccine" ? row.entry.label.replace(/\s*[-–]\s*(mũi|nhắc).*$/i, "").replace(/\s*\(sơ sinh\)/i, "") : row.milestone;
  const groups = [...new Set(rows.map(groupOf))];
  return (
    <section aria-label={`Danh sách mũi tiêm của ${name}`} className="mb-7 space-y-4">
      <div className="rounded-3xl border border-primary/20 bg-secondary/40 p-5">
        <h2 className="text-lg font-semibold">{kind === "baby" ? `Lịch tiêm chủng · ${name}` : `Các mũi tiêm của mẹ · ${name}`}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{done}/{rows.length} mũi đã ghi nhận</p>
        <details className="mt-2 text-xs leading-5 text-muted-foreground"><summary className="min-h-9 cursor-pointer content-center text-primary">Cách ghi nhận mũi tiêm</summary><p>Tích trực tiếp để lưu đã tiêm hôm nay; có thể sửa ngày và thêm thông tin sau.</p></details>
        {next && <div className="mt-3 rounded-2xl bg-background/70 p-3">
          <p className="text-sm font-semibold text-primary">Mốc tiếp theo: {next.milestone} · {dateLabel(next.date!)}</p>
          <details><summary className="min-h-9 cursor-pointer content-center text-xs text-primary">Xem các mũi tại mốc này</summary><ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-5 text-muted-foreground">{nextRows.map((row) => <li key={row.entry.key}>{row.entry.label}</li>)}</ul></details>
        </div>}
        <p className="mt-3 text-xs leading-5 text-muted-foreground">{kind === "baby" ? "Mốc tuổi là lịch tham khảo. Ngày hẹn thực tế và lịch vắc-xin phối hợp theo cơ sở tiêm; không cần tích tất cả lựa chọn thay thế." : "Số mũi và thời điểm tiêm uốn ván tùy tiền sử tiêm, theo lịch cơ sở tiêm."}</p>
      </div>
      <VaccinationViewSwitch />
      {view === "vaccine" ? <VaccineDoseGroups rows={rows} kind={kind} ownerId={ownerId}/> : groups.map((group) => (
        <div key={group} className="space-y-2">
          <h3 className="px-1 text-sm font-semibold">{group}</h3>
          <div className={view === "vaccine" ? "flex gap-3 overflow-x-auto pb-3" : "space-y-2"}>
          {rows.filter((row) => groupOf(row) === group).map(({ entry, record, appointment, date }) => (
            <article key={entry.key} data-schedule-key={entry.key} data-schedule-owner={kind} className={`rounded-2xl border p-4 ${view === "vaccine" ? "w-60 shrink-0" : ""} ${record ? "border-emerald-600/20 bg-emerald-50/40 dark:bg-emerald-950/15" : "border-border/60 bg-card"}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h4 className="min-w-0 flex-1 font-medium">{entry.label}</h4>
                <span className="rounded-full bg-secondary px-2 py-1 text-[11px] text-muted-foreground">{record ? "Đã ghi nhận" : appointment ? "Đã có hẹn" : date && date < today ? "Chưa ghi nhận" : "Sắp tới"}</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {record ? `Đã tiêm ${dateLabel(record.administeredAt.toISOString().slice(0, 10))}` : appointment ? `Ngày hẹn: ${dateLabel(appointment.scheduledAt.toISOString().slice(0, 10))}` : date ? `Mốc tham khảo: ${dateLabel(date)}` : "Theo lịch cơ sở tiêm"}
                {" · "}{entry.program === "free" ? "TCMR" : "Dịch vụ / theo tư vấn"}
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <VaccinationCheck compact={view === "vaccine"} kind={kind} ownerId={ownerId} entryKey={entry.key} label={entry.label} checked={Boolean(record)} />
                {record && <EditRecordLink scroll={false} replace href={record.appointment ? `/vaccination-schedule?edit=${record.appointment.id}&owner=${kind}` : `/vaccination-schedule?record=${record.id}&owner=${kind}`} className="inline-flex min-h-11 items-center text-xs text-primary">Sửa ngày / ghi chú</EditRecordLink>}
                {!record && appointment && <EditRecordLink scroll={false} replace href={`/vaccination-schedule?edit=${appointment.id}&owner=${kind}`} className="inline-flex min-h-11 items-center text-xs text-primary">Sửa ngày hẹn</EditRecordLink>}
              </div>
              {entry.note && <details className="mt-1 text-xs text-muted-foreground"><summary className="min-h-9 cursor-pointer content-center">Lưu ý mũi này</summary><p className="pb-2 leading-5">{entry.note}</p></details>}
            </article>
          ))}
          </div>
        </div>
      ))}
      {kind === "baby" && <a href="https://nihe.org.vn/chuyen-mon/tiem-chung-vac-xin/cac-vac-xin-trong-tiem-chung-mo-rong/" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-xs text-primary">Nguồn mốc TCMR: Viện Vệ sinh dịch tễ Trung ương</a>}
    </section>
  );
}
