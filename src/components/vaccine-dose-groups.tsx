import { Clock3, Info } from "lucide-react";
import { EditRecordLink } from "@/components/edit-record-navigation";
import { VaccinationCheck } from "@/components/vaccination-check";
import { vaccineGroupName } from "@/features/vaccination/groups";
import type { ChecklistRecord, ScheduleEntry } from "@/features/vaccination/checklist";
type Row = {entry:ScheduleEntry;record?:ChecklistRecord & {administeredAt:Date;appointment?:{id:string}|null};appointment?:{id:string;scheduledAt:Date};milestone:string};
export function VaccineDoseGroups({rows,kind,ownerId}:{rows:Row[];kind:"baby"|"mother";ownerId:string}) {
  const groups=[...new Set(rows.map(row=>vaccineGroupName(row.entry)))];
  const dateLabel=(date:Date)=>date.toISOString().slice(0,10).split('-').reverse().join('/');
  return <div className="divide-y divide-border/60 overflow-hidden rounded-[2rem] border bg-card">{groups.map(group=>{
    const doses=rows.filter(row=>vaccineGroupName(row.entry)===group);
    const ages=[...new Set(doses.map(row=>row.milestone))];
    const notes=[...new Set(doses.flatMap(row=>row.entry.note ? [row.entry.note] : []))];
    const combo=group.includes("6 trong 1");
    const free=doses.some(row=>row.entry.program==="free");
    return <article key={group} data-vaccine-group className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2"><h3 className="text-base font-semibold sm:text-lg">{group}</h3><span className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-medium ${combo || !free ? "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-200" : "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-200"}`}><span className="size-1.5 rounded-full bg-current"/>{combo ? "TCMR / dịch vụ" : free ? "Tiêm chủng mở rộng" : "Tiêm dịch vụ"}</span></div>
      <p className="mt-3 flex items-start gap-2 text-sm font-medium"><Clock3 className="mt-0.5 size-4 shrink-0 text-muted-foreground"/><span>{ages.length>1 ? `${ages[0]} → ${ages.at(-1)}` : ages[0]} · {doses.length} mũi / liều tham khảo</span></p>
      {notes.length>0 && <div className="mt-2 flex items-start gap-2 text-xs leading-5 text-muted-foreground"><Info className="mt-0.5 size-4 shrink-0"/><div><p>{notes[0]}</p>{notes.length>1 && <details><summary className="min-h-9 cursor-pointer content-center text-primary">Lưu ý từng mũi</summary>{notes.slice(1).map(note=><p key={note} className="mt-2">{note}</p>)}</details>}</div></div>}
      <div className="mt-5 grid gap-x-2 gap-y-4" style={{gridTemplateColumns:`repeat(${doses.length >= 4 ? 4 : 3},minmax(0,1fr))`}}>{doses.map(({entry,record,appointment,milestone})=>{
        const oral=entry.key.startsWith("rotavirus") || entry.key.startsWith("polio-") && !entry.key.startsWith("polio-ipv");
        const label=`${oral ? "Liều" : "Mũi"} ${entry.doseNumber}${oral ? " (uống)" : ""}`;
        const href=record ? record.appointment ? `/vaccination-schedule?edit=${record.appointment.id}&owner=${kind}` : `/vaccination-schedule?record=${record.id}&owner=${kind}` : appointment ? `/vaccination-schedule?edit=${appointment.id}&owner=${kind}` : undefined;
        return <div key={entry.key} data-schedule-key={entry.key} data-schedule-owner={kind} className="min-w-0 text-center"><VaccinationCheck compact kind={kind} ownerId={ownerId} entryKey={entry.key} label={entry.label} doseLabel={label} checked={!!record}/><p className={`mt-1 text-[11px] leading-5 ${record ? "text-teal-700 dark:text-teal-300" : "text-muted-foreground"}`}>{record ? dateLabel(record.administeredAt) : appointment ? `Hẹn ${dateLabel(appointment.scheduledAt)}` : milestone}</p>{href && <EditRecordLink scroll={false} replace href={href} className="inline-flex min-h-11 items-center justify-center text-[11px] text-primary">{record ? "Sửa ngày" : "Sửa hẹn"}</EditRecordLink>}</div>;
      })}</div>
    </article>;
  })}</div>;
}
