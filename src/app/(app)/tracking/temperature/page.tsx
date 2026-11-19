import { CareBentoHero, CareEmptyState } from "@/components/care-bento-hero";
import { HistoryTimelineItem } from "@/components/history-timeline-item";
import { TemperatureIcon as Thermometer } from "@/components/app-icons";
import {
  deleteTemperatureAction,
  saveTemperatureAction,
} from "@/app/health-actions";
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

function temperatureBadge(celsius: number) {
  if (celsius >= 38) {
    return {
      label: "Sốt · Cần theo dõi",
      tone: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
    };
  }
  if (celsius >= 37.5) {
    return {
      label: "Ấm người",
      tone: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
    };
  }
  return {
    label: "Ổn định",
    tone: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  };
}

export default async function TemperaturePage({
  searchParams,
}: {
  searchParams: Promise<{
    edit?: string;
    new?: string;
    saved?: string;
    limit?: string;
  }>;
}) {
  const [user, params] = await Promise.all([requireUser(), searchParams]);
  const baby = await getSelectedBaby(user.id);
  if (!baby)
    return (
      <>
        <PageHeader compact title="Nhiệt độ" backHref="/baby" />
        <p>Thêm hồ sơ bé để ghi nhiệt độ.</p>
      </>
    );
  const limit = parseHistoryLimit(params.limit);
  const [history, editing] = await Promise.all([
    db.temperatureEntry.findMany({
      where: { babyId: baby.id },
      orderBy: [{ measuredAt: "desc" }, { id: "desc" }],
      take: limit + 1,
    }),
    params.edit
      ? db.temperatureEntry.findFirst({
          where: { id: params.edit, babyId: baby.id },
        })
      : null,
  ]);
  const rows = history.slice(0, limit);
  const latest = rows[0];
  const latestStatus = latest ? temperatureBadge(latest.celsius) : null;
  const dateFormat = new Intl.DateTimeFormat("vi", {
    timeZone: user.timezone,
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <>
      <PageHeader
        compact
        title="Nhiệt độ của bé"
        subtitle={baby.name}
        backHref="/baby"
      />
      <CareBentoHero
        kind="temperature"
        tone="rose"
        eyebrow="Lần đo gần nhất"
        badge={
          latestStatus && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${latestStatus.tone}`}
            >
              {latestStatus.label}
            </span>
          )
        }
        title={
          <span className="text-3xl font-semibold tabular-nums sm:text-4xl">
            {latest ? latest.celsius.toFixed(1) : "—"}
            <span className="ml-1.5 text-lg font-normal text-muted-foreground">
              °C
            </span>
          </span>
        }
        description={
          latest
            ? `${temperatureMethods[latest.method as keyof typeof temperatureMethods] ?? latest.method} · ${dateFormat.format(latest.measuredAt)}`
            : "Chưa có lần đo nào. Ghi nhiệt độ kèm vị trí đo để tiện đối chiếu khi bé ốm."
        }
      />
      {params.saved && (
        <p role="status" className="mb-4 text-sm text-primary">
          Đã lưu lần đo nhiệt độ.
        </p>
      )}
      <CollapsibleRecordForm
        prominent
        key={editing?.id ?? `new-${rows.length}`}
        editingId={editing?.id}
        defaultOpen={!!editing || params.new === "1" || !rows.length}
        addLabel="Ghi nhiệt độ"
        closeLabel="Hủy"
      >
        <form
          id="temperature-form"
          action={saveTemperatureAction}
          className="space-y-4 rounded-3xl border border-border/60 bg-card p-5 shadow-xs"
        >
          <input type="hidden" name="babyId" value={baby.id} />
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <Field
            name="celsius"
            label="Nhiệt độ (°C)"
            type="number"
            inputMode="decimal"
            min="25"
            max="45"
            step="0.1"
            required
            placeholder="Ví dụ: 36.7"
            defaultValue={editing?.celsius ?? ""}
          />
          <Field
            name="measuredAt"
            label="Thời điểm đo"
            type="datetime-local"
            required
            max={toDateTimeLocal(new Date(), user.timezone)}
            defaultValue={toDateTimeLocal(editing?.measuredAt, user.timezone)}
          />
          <SelectField
            name="method"
            label="Vị trí đo"
            defaultValue={editing?.method ?? "AXILLARY"}
          >
            {Object.entries(temperatureMethods).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </SelectField>
          <TextAreaField
            name="notes"
            label="Ghi chú / quan sát"
            maxLength={2000}
            defaultValue={editing?.notes ?? ""}
          />
        </form>
        <FormActionBar
          formId="temperature-form"
          saveAction={saveTemperatureAction}
          saveLabel={editing ? "Cập nhật lần đo" : "Lưu nhiệt độ"}
          cancelHref="/tracking/temperature"
          cancelLabel="Hủy"
          deleteAction={editing ? deleteTemperatureAction : undefined}
          deleteId={editing?.id}
          deleteLabel="Xóa lần đo"
        />
      </CollapsibleRecordForm>
      <div className="mb-3 mt-7 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Lịch sử nhiệt độ</h2>
        {rows.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {rows.length} lần đo
          </span>
        )}
      </div>
      <div className="space-y-2.5">
        {rows.map((row) => {
          const badge = temperatureBadge(row.celsius);
          return (
            <HistoryTimelineItem
              key={row.id}
              at={row.measuredAt}
              timeZone={user.timezone}
              tone="rose"
              showDate
            >
              <article
                data-history-card
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3.5 shadow-xs transition-colors hover:border-rose-200 dark:hover:border-rose-900/60"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-rose-50 dark:bg-rose-950/60">
                  <Thermometer className="size-9" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold tabular-nums">
                      {row.celsius.toFixed(1)} °C
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${badge.tone}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {dateFormat.format(row.measuredAt)} ·{" "}
                    {temperatureMethods[
                      row.method as keyof typeof temperatureMethods
                    ] ?? row.method}
                  </p>
                  {row.notes && (
                    <p className="mt-1.5 whitespace-pre-wrap break-words text-xs text-muted-foreground">
                      {row.notes}
                    </p>
                  )}
                </div>
                <RecordActions
                  id={row.id}
                  editHref={`/tracking/temperature?edit=${row.id}`}
                  deleteAction={deleteTemperatureAction}
                  editLabel="Sửa lần đo"
                  deleteLabel="Xóa lần đo"
                />
              </article>
            </HistoryTimelineItem>
          );
        })}
        {rows.length === 0 && (
          <CareEmptyState
            kind="temperature"
            title="Chưa có lần đo nhiệt độ"
            description="Ghi lại nhiệt độ khi theo dõi sau tiêm chủng hoặc khi bé có dấu hiệu ấm người."
          />
        )}
      </div>
      <HistoryLoadMore
        href="/tracking/temperature"
        currentLimit={limit}
        hasMore={history.length > limit}
      />
    </>
  );
}
