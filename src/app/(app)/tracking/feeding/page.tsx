import Link from "next/link";
import { HistoryTimelineItem } from "@/components/history-timeline-item";
import { RecordScene } from "@/components/record-scene";
import { Baby as BabyIcon, ChevronRight } from "lucide-react";
import { deleteFeedingAction, saveFeedingAction } from "@/app/actions";
import { CollapsibleRecordForm } from "@/components/collapsible-record-form";
import { Field, TextAreaField } from "@/components/form-fields";
import { FeedingFields } from "@/components/feeding-fields";
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
import { averageGapMinutes, totalDurationMinutes } from "@/lib/metrics";
import { parseHistoryLimit } from "@/lib/pagination";
import { asFormAction } from "@/lib/form-action";

const typeLabels = {
  BREASTFEEDING: "Bú mẹ",
  BOTTLE_BREAST_MILK: "Sữa mẹ bình",
  FORMULA: "Sữa công thức",
  MIXED: "Kết hợp",
} as const;

export default async function FeedingPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; limit?: string; new?: string; type?: string }>;
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
        <PageHeader compact title={t.tracking.newFeeding} backHref="/baby" />
        <p>{t.common.noData}</p>
      </>
    );
  const { start, end } = getLocalDayRange(new Date(), user.timezone);
  const limit = parseHistoryLimit(params.limit);
  const [historyItems, today, editing] = await Promise.all([
    db.feeding.findMany({
      where: { babyId: baby.id },
      orderBy: { startTime: "desc" },
      take: limit + 1,
    }),
    db.feeding.findMany({
      where: { babyId: baby.id, startTime: { gte: start, lt: end } },
      orderBy: { startTime: "desc" },
    }),
    params.edit
      ? db.feeding.findFirst({ where: { id: params.edit, babyId: baby.id } })
      : null,
  ]);
  const hasMore = historyItems.length > limit;
  const items = historyItems.slice(0, limit);
  const now = new Date();
  const sinceLast = items[0]
    ? Math.max(0, (now.getTime() - items[0].startTime.getTime()) / 60_000)
    : 0;
  return (
    <>
      <PageHeader compact
        title={editing ? t.tracking.editFeeding : t.tracking.newFeeding}
        subtitle={baby.name}
        backHref="/baby"
      />
      {!(params.new === "1" || editing) && <MetricGrid
        items={[
          { label: t.dashboard.feedsToday, value: String(today.length) },
          {
            label: t.tracking.totalDuration,
            value: formatDuration(totalDurationMinutes(today, now)),
          },
          {
            label: t.tracking.averageGap,
            value: formatDuration(averageGapMinutes(today)),
          },
          {
            label: t.dashboard.lastFeed,
            value: items[0] ? formatDuration(sinceLast) : "—",
          },
        ]}
      />}
      {!(params.new === "1" || editing) && (
        <Link href="/statistics?owner=baby#feeding-reference" className="-mt-2 mb-3 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary">
          Đối chiếu bú theo tuổi<ChevronRight className="size-4" />
        </Link>
      )}
      <CollapsibleRecordForm prominent editingId={editing?.id}
        key={`${editing?.id ?? "new"}-${params.new ?? ""}-${params.type ?? ""}-${items.length}`}
        defaultOpen={!!editing || params.new === "1"}
        addLabel={t.tracking.newFeeding}
        closeLabel={t.common.cancel}
      >
      <RecordScene kind="breast" timeZone={user.timezone} initialValues={{type: editing?.type ?? (params.type || "BREASTFEEDING"), amountMl: String(editing?.amountMl ?? ""), leftBreastDuration: String(editing?.leftBreastDuration ?? ""), rightBreastDuration: String(editing?.rightBreastDuration ?? "")}}>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <form
            id="feeding-form"
            action={asFormAction(saveFeedingAction)}
            className="space-y-4"
          >
            <input type="hidden" name="babyId" value={baby.id} />
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <FeedingFields
              initialType={params.type === "BOTTLE_BREAST_MILK" || params.type === "FORMULA" || params.type === "MIXED" ? params.type : "BREASTFEEDING"}
              key={editing?.id ?? "new"}
              labels={t.tracking}
              typeLabels={typeLabels}
              initial={editing ? {
                type: editing.type,
                leftBreastDuration: editing.leftBreastDuration,
                rightBreastDuration: editing.rightBreastDuration,
                firstSide: editing.firstSide,
                amountMl: editing.amountMl,
                milkType: editing.milkType,
              } : undefined}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    editing?.endTime ? toDateTimeLocal(editing.endTime, user.timezone) : ""
                  }
                />
              </div>
            </FeedingFields>
            <TextAreaField
              name="notes"
              label={t.common.notes}
              defaultValue={editing?.notes ?? ""}
            />
          </form>
        </CardContent>
      </Card>
      <FormActionBar
        formId="feeding-form"
        saveAction={saveFeedingAction}
        saveLabel={editing ? t.common.update : "Lưu cữ bú"}
        cancelHref={editing || params.new === "1" ? "/tracking/feeding" : undefined}
        cancelLabel={t.common.cancel}
        deleteAction={editing ? deleteFeedingAction : undefined}
        deleteId={editing?.id}
        deleteLabel={t.common.delete}
        offlineMutationType={editing ? undefined : "CREATE_FEEDING"}
      />
      </RecordScene>
      </CollapsibleRecordForm>
      <h2 className="mb-2 mt-7 text-lg font-semibold">{t.tracking.history}</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <HistoryTimelineItem key={item.id} at={item.startTime} timeZone={user.timezone} showDate>
          <div
            data-history-card
            key={item.id}
            className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
              <BabyIcon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{typeLabels[item.type]}</p>
              <p className="text-sm text-muted-foreground">
                {new Intl.DateTimeFormat("vi-VN", {
                  timeZone: user.timezone,
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(item.startTime)}
                {item.amountMl ? ` · ${item.amountMl} ml` : ""}
              </p>
            </div>
            <RecordActions
              id={item.id}
              editHref={`/tracking/feeding?edit=${item.id}`}
              deleteAction={deleteFeedingAction}
              editLabel={t.common.edit}
              deleteLabel={t.common.delete}
            />
          </div>
          </HistoryTimelineItem>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">{t.common.noData}</p>
        )}
      </div>
      <HistoryLoadMore href="/tracking/feeding" currentLimit={limit} hasMore={hasMore} />
    </>
  );
}
