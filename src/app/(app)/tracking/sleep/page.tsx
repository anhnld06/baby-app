import { CareBentoHero, CareEmptyState } from "@/components/care-bento-hero";
import { HistoryTimelineItem } from "@/components/history-timeline-item";
import { RecordScene } from "@/components/record-scene";
import { SleepIcon as BedDouble } from "@/components/app-icons";
import { deleteSleepAction, saveSleepAction } from "@/app/actions";
import { CollapsibleRecordForm } from "@/components/collapsible-record-form";
import { Field, SelectField, TextAreaField } from "@/components/form-fields";
import { FormActionBar } from "@/components/form-action-bar";
import { HistoryLoadMore } from "@/components/history-load-more";
import { MetricGrid } from "@/components/metric-grid";
import { PageHeader } from "@/components/page-header";
import { RecordActions } from "@/components/record-actions";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { formatDuration, getLocalDayRange, toDateTimeLocal } from "@/lib/date";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";
import {
  averageCompletedDurationMinutes,
  durationMinutes,
  longestDurationWithinRangeMinutes,
  totalDurationWithinRangeMinutes,
} from "@/lib/metrics";
import { parseHistoryLimit } from "@/lib/pagination";
import { asFormAction } from "@/lib/form-action";

export default async function SleepPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; limit?: string; new?: string }>;
}) {
  const [user, t, params] = await Promise.all([
    requireUser(),
    getDictionary(),
    searchParams,
  ]);
  const baby = await getSelectedBaby(user.id);
  if (!baby)
    return (
      <>
        <PageHeader compact title={t.tracking.newSleep} backHref="/baby" />
        <p>{t.common.noData}</p>
      </>
    );
  const { start, end } = getLocalDayRange(new Date(), user.timezone);
  const limit = parseHistoryLimit(params.limit);
  const [historyItems, today, editing] = await Promise.all([
    db.sleepEntry.findMany({
      where: { babyId: baby.id },
      orderBy: { startTime: "desc" },
      take: limit + 1,
    }),
    db.sleepEntry.findMany({
      where: {
        babyId: baby.id,
        startTime: { lt: end },
        OR: [{ endTime: null }, { endTime: { gt: start } }],
      },
      orderBy: { startTime: "desc" },
    }),
    params.edit
      ? db.sleepEntry.findFirst({ where: { id: params.edit, babyId: baby.id } })
      : null,
  ]);
  const hasMore = historyItems.length > limit;
  const items = historyItems.slice(0, limit);
  const naps = today.filter((item) => item.type === "NAP");
  const now = new Date();
  const latest = items[0];
  const awakeMinutes = latest
    ? latest.endTime
      ? (now.getTime() - latest.endTime.getTime()) / 60_000
      : 0
    : 0;
  const totalSleepToday = totalDurationWithinRangeMinutes(today, start, end, now);
  const isCurrentlySleeping = Boolean(latest && !latest.endTime);

  return (
    <>
      <PageHeader
        compact
        title={editing ? t.tracking.editSleep : t.tracking.newSleep}
        subtitle={baby.name}
        backHref="/baby"
      />
      {!(params.new === "1" || editing) && (
        <CareBentoHero
          kind="sleep"
          tone="violet"
          eyebrow={isCurrentlySleeping ? "Bé đang say giấc" : "Giấc ngủ hôm nay"}
          title={
            today.length > 0
              ? `Ngủ ${formatDuration(totalSleepToday)} hôm nay`
              : "Lưu giấc ngày & giấc đêm của con"
          }
          description={
            isCurrentlySleeping && latest
              ? `Đang bấm giờ ngủ được ${formatDuration(durationMinutes(latest.startTime, null, now))}.`
              : "Theo dõi nhịp thức - ngủ giúp bố mẹ nhận ra tín hiệu buồn ngủ của con dễ hơn."
          }
        >
          <MetricGrid
            embedded
            items={[
              {
                label: t.dashboard.sleepToday,
                value: formatDuration(totalSleepToday),
              },
              { label: t.tracking.sleepCount, value: String(today.length) },
              {
                label: t.tracking.averageNap,
                value: formatDuration(averageCompletedDurationMinutes(naps)),
              },
              {
                label: t.tracking.longestSleep,
                value: formatDuration(
                  longestDurationWithinRangeMinutes(today, start, end, now),
                ),
              },
              {
                label: latest?.endTime ? t.tracking.awakeFor : t.dashboard.sleeping,
                value: latest?.endTime
                  ? formatDuration(awakeMinutes)
                  : latest
                    ? formatDuration(durationMinutes(latest.startTime, null, now))
                    : "—",
              },
            ]}
          />
        </CareBentoHero>
      )}
      <CollapsibleRecordForm
        prominent
        editingId={editing?.id}
        key={`${editing?.id ?? "new"}-${params.new ?? ""}-${items.length}`}
        defaultOpen={!!editing || params.new === "1"}
        addLabel={t.tracking.newSleep}
        closeLabel={t.common.cancel}
      >
        <RecordScene
          kind="sleep"
          timeZone={user.timezone}
          initialValues={{
            startTime: toDateTimeLocal(editing?.startTime, user.timezone),
            endTime: editing?.endTime
              ? toDateTimeLocal(editing.endTime, user.timezone)
              : "",
          }}
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <form
                id="sleep-form"
                action={asFormAction(saveSleepAction)}
                className="space-y-4"
              >
                <input type="hidden" name="babyId" value={baby.id} />
                {editing && <input type="hidden" name="id" value={editing.id} />}
                <SelectField
                  name="type"
                  label={t.tracking.type}
                  defaultValue={editing?.type ?? "NAP"}
                >
                  <option value="NAP">{t.tracking.nap}</option>
                  <option value="NIGHT">{t.tracking.night}</option>
                </SelectField>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    name="startTime"
                    type="datetime-local"
                    required
                    label={t.tracking.startTime}
                    defaultValue={toDateTimeLocal(editing?.startTime, user.timezone)}
                  />
                  <Field
                    name="endTime"
                    type="datetime-local"
                    label={t.tracking.endTime}
                    defaultValue={
                      editing?.endTime
                        ? toDateTimeLocal(editing.endTime, user.timezone)
                        : ""
                    }
                  />
                </div>
                <Field
                  name="location"
                  label={t.tracking.location}
                  defaultValue={editing?.location ?? ""}
                />
                <TextAreaField
                  name="notes"
                  label={t.common.notes}
                  defaultValue={editing?.notes ?? ""}
                />
              </form>
            </CardContent>
          </Card>
          <FormActionBar
            formId="sleep-form"
            saveAction={saveSleepAction}
            saveLabel={editing ? t.common.update : "Lưu giấc ngủ"}
            cancelHref={
              editing || params.new === "1" ? "/tracking/sleep" : undefined
            }
            cancelLabel={t.common.cancel}
            deleteAction={editing ? deleteSleepAction : undefined}
            deleteId={editing?.id}
            deleteLabel={t.common.delete}
            offlineMutationType={editing ? undefined : "CREATE_SLEEP"}
          />
        </RecordScene>
      </CollapsibleRecordForm>
      <div className="mb-3 mt-7 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t.tracking.history}</h2>
        {items.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {items.length} giấc gần đây
          </span>
        )}
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const isOpen = !item.endTime;
          const isNight = item.type === "NIGHT";
          const mins = item.endTime
            ? (item.endTime.getTime() - item.startTime.getTime()) / 60_000
            : null;
          return (
            <HistoryTimelineItem
              key={item.id}
              at={item.startTime}
              timeZone={user.timezone}
              tone="violet"
              active={isOpen}
              showDate
            >
              <div
                data-history-card
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3.5 shadow-xs transition-colors hover:border-indigo-200 dark:hover:border-indigo-900/60"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#eeedf8] dark:bg-[#302e46]">
                  <BedDouble className="size-9" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">
                      {item.type === "NAP" ? t.tracking.nap : t.tracking.night}
                    </p>
                    <span
                      className={
                        isOpen
                          ? "rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-semibold text-white"
                          : "summary-chip summary-chip-sleep text-xs"
                      }
                    >
                      {mins != null ? formatDuration(mins) : t.tracking.openSession}
                    </span>
                    {isNight && (
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-200">
                        Ban đêm
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat("vi-VN", {
                      timeZone: user.timezone,
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(item.startTime)}
                    {item.endTime
                      ? ` → ${new Intl.DateTimeFormat("vi-VN", {
                          timeZone: user.timezone,
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(item.endTime)}`
                      : ""}
                    {item.location ? ` · ${item.location}` : ""}
                  </p>
                  {item.notes && (
                    <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                      {item.notes}
                    </p>
                  )}
                </div>
                <RecordActions
                  id={item.id}
                  editHref={`/tracking/sleep?edit=${item.id}`}
                  deleteAction={deleteSleepAction}
                  editLabel={t.common.edit}
                  deleteLabel={t.common.delete}
                />
              </div>
            </HistoryTimelineItem>
          );
        })}
        {items.length === 0 && (
          <CareEmptyState
            kind="sleep"
            title={t.common.noData}
            description="Bấm giờ trên Trang chủ hoặc thêm giấc ngủ đầu tiên để theo dõi giấc ngày và giấc đêm của con."
          />
        )}
      </div>
      <HistoryLoadMore
        href="/tracking/sleep"
        currentLimit={limit}
        hasMore={hasMore}
      />
    </>
  );
}
