import { HistoryTimelineItem } from "@/components/history-timeline-item";
import { CareIllustration } from "@/components/care-illustration";
import { Thermometer } from "lucide-react";
import { deleteTemperatureAction, saveTemperatureAction } from "@/app/health-actions";
import { CollapsibleRecordForm } from "@/components/collapsible-record-form";
import { Field, SelectField, TextAreaField } from "@/components/form-fields";
import { FormActionBar } from "@/components/form-action-bar";
import { PageHeader } from "@/components/page-header";
import { RecordActions } from "@/components/record-actions";
import { HistoryLoadMore } from "@/components/history-load-more";
import { temperatureMethods } from "@/features/health/validation";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { db } from "@/lib/db";
import { toDateTimeLocal } from "@/lib/date";
import { parseHistoryLimit } from "@/lib/pagination";

export default async function TemperaturePage({ searchParams }: { searchParams: Promise<{ edit?: string; new?: string; saved?: string; limit?: string }> }) {
  const [user, params] = await Promise.all([requireUser(), searchParams]);
  const baby = await getSelectedBaby(user.id);
  if (!baby) return <><PageHeader compact title="Nhiệt độ" backHref="/baby"/><p>Thêm hồ sơ bé để ghi nhiệt độ.</p></>;
  const limit = parseHistoryLimit(params.limit);
  const [history, editing] = await Promise.all([
    db.temperatureEntry.findMany({ where: { babyId: baby.id }, orderBy: [{ measuredAt: "desc" }, { id: "desc" }], take: limit + 1 }),
    params.edit ? db.temperatureEntry.findFirst({ where: { id: params.edit, babyId: baby.id } }) : null,
  ]);
  const rows = history.slice(0, limit), latest = rows[0];
  const dateFormat = new Intl.DateTimeFormat("vi", { timeZone: user.timezone, dateStyle: "short", timeStyle: "short" });
  return <>
    <PageHeader compact title="Nhiệt độ của bé" subtitle={baby.name} backHref="/baby"/>
    <section className="mb-5 flex items-center gap-5 rounded-[2rem] bg-gradient-to-br from-rose-50 to-orange-50 p-6 dark:from-rose-950 dark:to-orange-950">
      <span className="grid size-20 shrink-0 place-items-center rounded-3xl bg-card/80 text-rose-500"><CareIllustration kind="temperature"/></span>
      <div><p className="text-sm text-muted-foreground">Lần đo gần nhất</p><p className="mt-2 text-4xl font-semibold tabular-nums">{latest ? latest.celsius.toFixed(1) : "—"}<span className="ml-2 text-xl">°C</span></p><p className="mt-2 text-xs text-muted-foreground">{latest ? `${temperatureMethods[latest.method as keyof typeof temperatureMethods] ?? latest.method} · ${dateFormat.format(latest.measuredAt)}` : "Chưa có lần đo nào"}</p></div>
    </section>
    {params.saved && <p role="status" className="mb-4 text-sm text-primary">Đã lưu lần đo nhiệt độ.</p>}
    <CollapsibleRecordForm prominent key={editing?.id ?? `new-${rows.length}`} editingId={editing?.id} defaultOpen={!!editing || params.new === "1" || !rows.length} addLabel="Ghi nhiệt độ" closeLabel="Hủy">
      <form id="temperature-form" action={saveTemperatureAction} className="space-y-4 rounded-3xl bg-card p-5 shadow-sm">
        <input type="hidden" name="babyId" value={baby.id}/>{editing && <input type="hidden" name="id" value={editing.id}/>}
        <Field name="celsius" label="Nhiệt độ (°C)" type="number" inputMode="decimal" min="25" max="45" step="0.1" required placeholder="Ví dụ: 36.7" defaultValue={editing?.celsius ?? ""}/>
        <Field name="measuredAt" label="Thời điểm đo" type="datetime-local" required max={toDateTimeLocal(new Date(),user.timezone)} defaultValue={toDateTimeLocal(editing?.measuredAt,user.timezone)}/>
        <SelectField name="method" label="Vị trí đo" defaultValue={editing?.method ?? "AXILLARY"}>{Object.entries(temperatureMethods).map(([key,label])=><option key={key} value={key}>{label}</option>)}</SelectField>
        <TextAreaField name="notes" label="Ghi chú / quan sát" maxLength={2000} defaultValue={editing?.notes ?? ""}/>
      </form>
      <FormActionBar formId="temperature-form" saveAction={saveTemperatureAction} saveLabel={editing ? "Cập nhật lần đo" : "Lưu nhiệt độ"} cancelHref="/tracking/temperature" cancelLabel="Hủy" deleteAction={editing ? deleteTemperatureAction : undefined} deleteId={editing?.id} deleteLabel="Xóa lần đo"/>
    </CollapsibleRecordForm>
    <h2 className="mb-3 mt-7 text-lg font-semibold">Lịch sử nhiệt độ</h2>
    <div className="space-y-3">{rows.map(row=><HistoryTimelineItem key={row.id} at={row.measuredAt} timeZone={user.timezone} showDate><article data-history-card key={row.id} className="flex items-start gap-3 rounded-2xl border bg-card p-4"><Thermometer className="mt-1 size-5 shrink-0 text-rose-500"/><div className="min-w-0 flex-1"><p className="text-xl font-semibold tabular-nums">{row.celsius.toFixed(1)} °C</p><p className="mt-1 text-xs text-muted-foreground">{dateFormat.format(row.measuredAt)} · {temperatureMethods[row.method as keyof typeof temperatureMethods] ?? row.method}</p>{row.notes && <p className="mt-2 whitespace-pre-wrap break-words text-sm text-muted-foreground">{row.notes}</p>}</div><RecordActions id={row.id} editHref={`/tracking/temperature?edit=${row.id}`} deleteAction={deleteTemperatureAction} editLabel="Sửa lần đo" deleteLabel="Xóa lần đo"/></article></HistoryTimelineItem>)}</div>
    <HistoryLoadMore href="/tracking/temperature" currentLimit={limit} hasMore={history.length > limit}/>
  </>;
}
