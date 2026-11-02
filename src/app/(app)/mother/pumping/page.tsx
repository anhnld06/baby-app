import { PumpingTrends } from "@/components/pumping-trends";
import { pumpingTrends, pumpingTrendWindow } from "@/features/pumping/trends";
import { getSelectedBaby } from "@/lib/data";
import { PumpingTimer } from "@/components/pumping-timer";
import { Droplets, UserRound } from "lucide-react";
import { savePumpingAction, deletePumpingAction } from "@/app/pumping-actions";
import { CollapsibleRecordForm } from "@/components/collapsible-record-form";
import { FeatureLink } from "@/components/feature-link";
import { Field, TextAreaField } from "@/components/form-fields";
import { FormActionBar } from "@/components/form-action-bar";
import { HistoryLoadMore } from "@/components/history-load-more";
import { MetricGrid } from "@/components/metric-grid";
import { PageHeader } from "@/components/page-header";
import { RecordActions } from "@/components/record-actions";
import { pumpingAmount, pumpingSummary } from "@/features/pumping/pumping";
import { requireUser } from "@/lib/auth";
import { formatDuration, getLocalDayRange, toDateTimeLocal } from "@/lib/date";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/i18n";
import { parseHistoryLimit } from "@/lib/pagination";

export default async function PumpingPage({ searchParams }: {
  searchParams: Promise<{ edit?: string; limit?: string; new?: string }>;
}) {
  const [user, locale, params] = await Promise.all([requireUser(), getLocale(), searchParams]);
  const vi = locale === "vi";
  const title = vi ? "Nhật ký hút sữa" : "Pumping journal";
  const mother = await db.mother.findUnique({ where: { userId: user.id } });
  if (!mother) return <>
    <PageHeader title={title} backHref="/mother" />
    <FeatureLink href="/profile/mother" icon={UserRound} title={vi ? "Tạo hồ sơ mẹ" : "Create mother's profile"} description={vi ? "Thêm hồ sơ mẹ trước khi ghi cữ hút sữa." : "Add a mother profile before logging pumping sessions."} />
  </>;
  const now = new Date();
  const { start, end } = getLocalDayRange(now, user.timezone);
  const baby = await getSelectedBaby(user.id);
  const window = pumpingTrendWindow(now, user.timezone);
  const limit = parseHistoryLimit(params.limit);
  const [history, today, editing, active, trendEntries, bottles] = await Promise.all([
    db.pumpingEntry.findMany({ where: { motherId: mother.id, isRunning: false }, orderBy: [{ startTime: "desc" }, { id: "desc" }], take: limit + 1 }),
    db.pumpingEntry.findMany({ where: { motherId: mother.id, isRunning: false, startTime: { gte: start, lt: end } } }),
    params.edit ? db.pumpingEntry.findFirst({ where: { id: params.edit, motherId: mother.id, isRunning: false } }) : null,
    db.pumpingEntry.findFirst({ where: { motherId: mother.id, isRunning: true } }),
    db.pumpingEntry.findMany({ where: { motherId: mother.id, isRunning: false, startTime: { gte: window.start, lt: window.end } } }),
    baby ? db.feeding.findMany({ where: { babyId: baby.id, type: "BOTTLE_BREAST_MILK", startTime: { gte: window.start, lt: window.end } }, select: { startTime: true, type: true, amountMl: true } }) : [],
  ]);
  const items = history.slice(0, limit);
  const summary = pumpingSummary(today);
  const number = (value: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);
  const addLabel = vi ? "Ghi cữ hút sữa" : "Log pumping session";
  const cancelLabel = vi ? "Hủy" : "Cancel";
  const dateFormat = new Intl.DateTimeFormat(locale, { timeZone: user.timezone, day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  return <>
    <PageHeader title={title} subtitle={mother.name} backHref="/mother" />
    <PumpingTimer locale={locale} active={active ? { id: active.id, startTime: active.startTime.toISOString() } : undefined} />
    <MetricGrid items={[
      { label: vi ? "Cữ hút hôm nay" : "Sessions today", value: String(summary.count) },
      { label: vi ? "Tổng hôm nay" : "Total today", value: `${number(summary.totalMl)} ml` },
      { label: vi ? "Trung bình mỗi cữ" : "Average per session", value: today.some((item) => item.leftAmountMl != null || item.rightAmountMl != null) ? `${number(summary.averageMl)} ml` : "—" },
      { label: vi ? "Từ cữ hút gần nhất" : "Since last session", value: items[0] ? formatDuration(Math.max(0, (now.getTime() - items[0].startTime.getTime()) / 60_000), locale) : "—" },
    ]} />
    {params.edit && !editing && <p role="alert" className="mb-4 text-sm text-destructive">{vi ? "Không tìm thấy cữ hút sữa." : "Pumping session not found."}</p>}
    <CollapsibleRecordForm key={`${editing?.id ?? "new"}-${params.new ?? ""}-${items.length}`} defaultOpen={!!editing || params.new === "1"} addLabel={addLabel} closeLabel={cancelLabel}>
      <form id="pumping-form" action={savePumpingAction} className="space-y-4 rounded-2xl bg-card p-5 shadow-sm">
        {editing && <input type="hidden" name="id" value={editing.id} />}
        <Field name="startTime" type="datetime-local" required label={vi ? "Thời điểm bắt đầu" : "Start time"} defaultValue={toDateTimeLocal(editing?.startTime, user.timezone)} />
        <Field name="durationMinutes" type="number" min="1" max="1440" step="1" inputMode="numeric" label={vi ? "Thời lượng hút (phút, tùy chọn)" : "Duration (minutes, optional)"} defaultValue={editing?.durationMinutes ?? ""} />
        <p className="text-sm text-muted-foreground">{vi ? "Nhập lượng sữa ít nhất một bên. Có thể ghi 0 ml; để trống bên không hút. Tổng lượng được cộng từ hai bên." : "Enter milk volume for at least one side. Zero is allowed; leave the unused side blank. Both sides are added for the total."}</p>
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <Field name="leftAmountMl" type="number" min="0" max="3000" step="0.1" inputMode="decimal" label={vi ? "Bên trái (ml)" : "Left breast (ml)"} defaultValue={editing?.leftAmountMl ?? ""} />
          <Field name="rightAmountMl" type="number" min="0" max="3000" step="0.1" inputMode="decimal" label={vi ? "Bên phải (ml)" : "Right breast (ml)"} defaultValue={editing?.rightAmountMl ?? ""} />
        </div>
        <TextAreaField name="notes" maxLength={1000} label={vi ? "Ghi chú" : "Notes"} defaultValue={editing?.notes ?? ""} />
      </form>
      <FormActionBar formId="pumping-form" saveAction={savePumpingAction} saveLabel={editing ? (vi ? "Cập nhật" : "Update") : (vi ? "Lưu" : "Save")} cancelHref={editing || params.new === "1" ? "/mother/pumping" : undefined} cancelLabel={cancelLabel} />
    </CollapsibleRecordForm>
    <PumpingTrends trend={pumpingTrends(now, user.timezone, trendEntries, bottles)} babyName={baby?.name} locale={locale} />
    <h2 className="mb-2 mt-7 text-lg font-semibold">{vi ? "Lịch sử hút sữa" : "Pumping history"}</h2>
    <div className="space-y-2">
      {items.map((item) => <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><Droplets className="size-5" /></span>
        <div className="min-w-0 flex-1">
          <p className="font-medium">{item.leftAmountMl == null && item.rightAmountMl == null ? (vi ? "Chưa nhập lượng sữa" : "Milk volume pending") : `${number(pumpingAmount(item))} ml`}{item.durationMinutes != null ? ` · ${item.durationMinutes} ${vi ? "phút" : "min"}` : ""}</p>
          <p className="text-sm text-muted-foreground">{dateFormat.format(item.startTime)}</p>
          <p className="text-sm text-muted-foreground">{vi ? "Trái" : "Left"}: {item.leftAmountMl == null ? "—" : `${number(item.leftAmountMl)} ml`} · {vi ? "Phải" : "Right"}: {item.rightAmountMl == null ? "—" : `${number(item.rightAmountMl)} ml`}</p>
          {item.notes && <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">{item.notes}</p>}
        </div>
        <RecordActions id={item.id} editHref={`/mother/pumping?edit=${item.id}`} deleteAction={deletePumpingAction} editLabel={vi ? "Sửa" : "Edit"} deleteLabel={vi ? "Xóa" : "Delete"} />
      </div>)}
      {!items.length && <p className="text-sm text-muted-foreground">{vi ? "Chưa có cữ hút sữa. Ghi cữ đầu tiên để bắt đầu theo dõi." : "No pumping sessions yet. Log your first session to start tracking."}</p>}
    </div>
    <HistoryLoadMore href="/mother/pumping" currentLimit={limit} hasMore={history.length > limit} />
  </>;
}
