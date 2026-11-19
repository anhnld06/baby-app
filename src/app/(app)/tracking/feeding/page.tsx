import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  BottleIcon,
  BreastfeedingIcon,
} from "@/components/app-icons";
import { CareBentoHero, CareEmptyState } from "@/components/care-bento-hero";
import { HistoryTimelineItem } from "@/components/history-timeline-item";
import { RecordScene } from "@/components/record-scene";
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
  const todayBottleMl = today.reduce(
    (sum, item) =>
      item.type !== "BREASTFEEDING" && item.amountMl != null
        ? sum + item.amountMl
        : sum,
    0,
  );

  return (
    <>
      <PageHeader
        compact
        title={editing ? t.tracking.editFeeding : t.tracking.newFeeding}
        subtitle={baby.name}
        backHref="/baby"
      />
      {!(params.new === "1" || editing) && (
        <CareBentoHero
          kind="breast"
          tone="amber"
          eyebrow="Nhịp bú hôm nay"
          title={
            today.length > 0
              ? `${today.length} cữ bú trong ngày`
              : "Bắt đầu cữ bú đầu tiên hôm nay"
          }
          description={
            todayBottleMl > 0
              ? `Tổng lượng bình đã ghi hôm nay: ${todayBottleMl} ml.`
              : "Lưu bên bú, thời lượng hoặc lượng sữa bình để theo dõi nhịp ăn của con."
          }
          footer={
            <Link
              href="/statistics?owner=baby#feeding-reference"
              className="inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Đối chiếu bú theo tuổi
              <ChevronRight className="size-3.5" />
            </Link>
          }
        >
          <MetricGrid
            embedded
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
          />
        </CareBentoHero>
      )}
      <CollapsibleRecordForm
        prominent
        editingId={editing?.id}
        key={`${editing?.id ?? "new"}-${params.new ?? ""}-${params.type ?? ""}-${items.length}`}
        defaultOpen={!!editing || params.new === "1"}
        addLabel={t.tracking.newFeeding}
        closeLabel={t.common.cancel}
      >
        <RecordScene
          kind="breast"
          timeZone={user.timezone}
          initialValues={{
            type: editing?.type ?? (params.type || "BREASTFEEDING"),
            amountMl: String(editing?.amountMl ?? ""),
            leftBreastDuration: String(editing?.leftBreastDuration ?? ""),
            rightBreastDuration: String(editing?.rightBreastDuration ?? ""),
          }}
        >
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
                  initialType={
                    params.type === "BOTTLE_BREAST_MILK" ||
                    params.type === "FORMULA" ||
                    params.type === "MIXED"
                      ? params.type
                      : "BREASTFEEDING"
                  }
                  key={editing?.id ?? "new"}
                  labels={t.tracking}
                  typeLabels={typeLabels}
                  initial={
                    editing
                      ? {
                          type: editing.type,
                          leftBreastDuration: editing.leftBreastDuration,
                          rightBreastDuration: editing.rightBreastDuration,
                          firstSide: editing.firstSide,
                          amountMl: editing.amountMl,
                          milkType: editing.milkType,
                        }
                      : undefined
                  }
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
                        editing?.endTime
                          ? toDateTimeLocal(editing.endTime, user.timezone)
                          : ""
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
            cancelHref={
              editing || params.new === "1" ? "/tracking/feeding" : undefined
            }
            cancelLabel={t.common.cancel}
            deleteAction={editing ? deleteFeedingAction : undefined}
            deleteId={editing?.id}
            deleteLabel={t.common.delete}
            offlineMutationType={editing ? undefined : "CREATE_FEEDING"}
          />
        </RecordScene>
      </CollapsibleRecordForm>
      <div className="mb-3 mt-7 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t.tracking.history}</h2>
        {items.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {items.length} bản ghi gần đây
          </span>
        )}
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const isBreast = item.type === "BREASTFEEDING";
          const Icon = isBreast ? BreastfeedingIcon : BottleIcon;
          const breastTotal =
            (item.leftBreastDuration ?? 0) + (item.rightBreastDuration ?? 0);
          return (
            <HistoryTimelineItem
              key={item.id}
              at={item.startTime}
              timeZone={user.timezone}
              tone={isBreast ? "amber" : "teal"}
              showDate
            >
              <div
                data-history-card
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3.5 shadow-xs transition-colors hover:border-orange-200 dark:hover:border-orange-900/60"
              >
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-2xl ${
                    isBreast
                      ? "bg-[#fff1e9] dark:bg-[#3a2d2a]"
                      : "bg-[#e5f4f4] dark:bg-[#203b3d]"
                  }`}
                >
                  <Icon className="size-9" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{typeLabels[item.type]}</p>
                    {item.amountMl != null && (
                      <span className="summary-chip summary-chip-bottle text-xs">
                        {item.amountMl} ml
                      </span>
                    )}
                    {isBreast && breastTotal > 0 && (
                      <span className="summary-chip summary-chip-feed text-xs">
                        {formatDuration(breastTotal)}
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
                    {isBreast &&
                    (item.leftBreastDuration != null ||
                      item.rightBreastDuration != null)
                      ? ` · Trái ${item.leftBreastDuration ?? 0}p / Phải ${item.rightBreastDuration ?? 0}p`
                      : ""}
                  </p>
                  {item.notes && (
                    <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                      {item.notes}
                    </p>
                  )}
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
          );
        })}
        {items.length === 0 && (
          <CareEmptyState
            kind="bottle"
            title={t.common.noData}
            description="Ghi cữ bú mẹ hoặc bình sữa đầu tiên để theo dõi lượng ăn và khoảng cách giữa các cữ của con."
          />
        )}
      </div>
      <HistoryLoadMore
        href="/tracking/feeding"
        currentLimit={limit}
        hasMore={hasMore}
      />
    </>
  );
}
