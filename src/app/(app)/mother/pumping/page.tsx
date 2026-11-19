import { CareBentoHero, CareEmptyState } from "@/components/care-bento-hero";
import { HistoryTimelineItem } from "@/components/history-timeline-item";
import { RecordScene } from "@/components/record-scene";
import { PumpingChart } from "@/components/pumping-chart";
import { pumpingChartData, pumpingChartPeriod } from "@/features/pumping/chart";
import { PumpingTrends } from "@/components/pumping-trends";
import { pumpingTrends, pumpingTrendWindow } from "@/features/pumping/trends";
import { getSelectedBaby } from "@/lib/data";
import { PumpingTimer } from "@/components/pumping-timer";
import {
  PumpingIcon as Droplets,
  ProfileIcon as UserRound,
} from "@/components/app-icons";
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
import { parseHistoryLimit } from "@/lib/pagination";
import { formatNumber } from "@/lib/format";

export default async function PumpingPage({
  searchParams,
}: {
  searchParams: Promise<{
    edit?: string;
    limit?: string;
    new?: string;
    chart?: string;
    date?: string;
  }>;
}) {
  const [user, params] = await Promise.all([requireUser(), searchParams]);
  const title = "Nhật ký hút sữa";
  const mother = await db.mother.findUnique({ where: { userId: user.id } });
  if (!mother)
    return (
      <>
        <PageHeader compact title={title} backHref="/mother" />
        <FeatureLink
          href="/profile/mother"
          icon={UserRound}
          title="Tạo hồ sơ mẹ"
          description="Thêm hồ sơ mẹ trước khi ghi cữ hút sữa."
        />
      </>
    );
  const now = new Date();
  const { start, end } = getLocalDayRange(now, user.timezone);
  const baby = await getSelectedBaby(user.id);
  const window = pumpingTrendWindow(now, user.timezone);
  const chartPeriod = pumpingChartPeriod(
    params.chart,
    params.date,
    now,
    user.timezone,
  );
  const limit = parseHistoryLimit(params.limit);
  const [history, today, editing, active, trendEntries, bottles, chartEntries] =
    await Promise.all([
      db.pumpingEntry.findMany({
        where: { motherId: mother.id, isRunning: false },
        orderBy: [{ startTime: "desc" }, { id: "desc" }],
        take: limit + 1,
      }),
      db.pumpingEntry.findMany({
        where: {
          motherId: mother.id,
          isRunning: false,
          startTime: { gte: start, lt: end },
        },
      }),
      params.edit
        ? db.pumpingEntry.findFirst({
            where: { id: params.edit, motherId: mother.id, isRunning: false },
          })
        : null,
      db.pumpingEntry.findFirst({
        where: { motherId: mother.id, isRunning: true },
      }),
      db.pumpingEntry.findMany({
        where: {
          motherId: mother.id,
          isRunning: false,
          startTime: { gte: window.start, lt: window.end },
        },
      }),
      baby
        ? db.feeding.findMany({
            where: {
              babyId: baby.id,
              type: "BOTTLE_BREAST_MILK",
              startTime: { gte: window.start, lt: window.end },
            },
            select: { startTime: true, type: true, amountMl: true },
          })
        : [],
      db.pumpingEntry.findMany({
        where: {
          motherId: mother.id,
          isRunning: false,
          startTime: { gte: chartPeriod.start, lt: chartPeriod.end },
        },
        select: {
          id: true,
          startTime: true,
          leftAmountMl: true,
          rightAmountMl: true,
        },
      }),
    ]);
  const items = history.slice(0, limit);
  const summary = pumpingSummary(today);
  const addLabel = "Ghi cữ hút sữa";
  const cancelLabel = "Hủy";
  const dateFormat = new Intl.DateTimeFormat("vi-VN", {
    timeZone: user.timezone,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <PageHeader
        compact
        title={title}
        subtitle={mother.name}
        backHref="/mother"
      />
      <PumpingTimer
        active={
          active
            ? { id: active.id, startTime: active.startTime.toISOString() }
            : undefined
        }
      />
      {!(params.new === "1" || editing) && (
        <CareBentoHero
          kind="pumping"
          tone="sky"
          eyebrow="Nguồn sữa của mẹ"
          title={
            summary.count > 0
              ? `${formatNumber(summary.totalMl, 1)} ml qua ${summary.count} cữ hôm nay`
              : "Lưu từng cữ hút sữa của mẹ"
          }
          description="Ghi lượng sữa từng bên để theo dõi xu hướng tiết sữa và cân đối với nhu cầu của con."
        >
          <MetricGrid
            embedded
            items={[
              { label: "Cữ hút hôm nay", value: String(summary.count) },
              {
                label: "Tổng hôm nay",
                value: `${formatNumber(summary.totalMl, 1)} ml`,
              },
              {
                label: "Trung bình mỗi cữ",
                value: today.some(
                  (item) =>
                    item.leftAmountMl != null || item.rightAmountMl != null,
                )
                  ? `${formatNumber(summary.averageMl, 1)} ml`
                  : "—",
              },
              {
                label: "Từ cữ hút gần nhất",
                value: items[0]
                  ? formatDuration(
                      Math.max(
                        0,
                        (now.getTime() - items[0].startTime.getTime()) / 60_000,
                      ),
                    )
                  : "—",
              },
            ]}
          />
        </CareBentoHero>
      )}
      {params.edit && !editing && (
        <p role="alert" className="mb-4 text-sm text-destructive">
          Không tìm thấy cữ hút sữa.
        </p>
      )}
      <CollapsibleRecordForm
        prominent
        editingId={editing?.id}
        key={`${editing?.id ?? "new"}-${params.new ?? ""}-${items.length}`}
        defaultOpen={!!editing || params.new === "1"}
        addLabel={addLabel}
        closeLabel={cancelLabel}
      >
        <RecordScene
          kind="pumping"
          timeZone={user.timezone}
          initialValues={{
            leftAmountMl: String(editing?.leftAmountMl ?? ""),
            rightAmountMl: String(editing?.rightAmountMl ?? ""),
          }}
        >
          <form
            id="pumping-form"
            action={savePumpingAction}
            className="space-y-4 rounded-2xl bg-card p-5 shadow-sm"
          >
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <Field
              name="startTime"
              type="datetime-local"
              required
              label="Thời điểm bắt đầu"
              defaultValue={toDateTimeLocal(editing?.startTime, user.timezone)}
            />
            <Field
              name="durationMinutes"
              type="number"
              min="1"
              max="1440"
              step="1"
              inputMode="numeric"
              label="Thời lượng hút (phút, tùy chọn)"
              defaultValue={editing?.durationMinutes ?? ""}
            />
            <p className="text-sm text-muted-foreground">
              Nhập lượng sữa ít nhất một bên. Có thể ghi 0 ml; để trống bên
              không hút. Tổng lượng được cộng từ hai bên.
            </p>
            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <Field
                name="leftAmountMl"
                type="number"
                min="0"
                max="3000"
                step="0.1"
                inputMode="decimal"
                label="Bên trái (ml)"
                defaultValue={editing?.leftAmountMl ?? ""}
              />
              <Field
                name="rightAmountMl"
                type="number"
                min="0"
                max="3000"
                step="0.1"
                inputMode="decimal"
                label="Bên phải (ml)"
                defaultValue={editing?.rightAmountMl ?? ""}
              />
            </div>
            <TextAreaField
              name="notes"
              maxLength={1000}
              label="Ghi chú"
              defaultValue={editing?.notes ?? ""}
            />
          </form>
          <FormActionBar
            formId="pumping-form"
            saveAction={savePumpingAction}
            saveLabel={editing ? "Cập nhật" : "Lưu"}
            cancelHref={
              editing || params.new === "1" ? "/mother/pumping" : undefined
            }
            cancelLabel={cancelLabel}
          />
        </RecordScene>
      </CollapsibleRecordForm>
      <PumpingChart
        key={`${chartPeriod.mode}-${chartPeriod.anchor}`}
        rows={pumpingChartData(chartPeriod, chartEntries, user.timezone)}
        mode={chartPeriod.mode}
        anchor={chartPeriod.anchor}
        previous={chartPeriod.previous}
        next={chartPeriod.next}
        today={chartPeriod.today}
      />
      <PumpingTrends
        trend={pumpingTrends(now, user.timezone, trendEntries, bottles)}
        babyName={baby?.name}
      />
      <div className="mb-3 mt-7 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Lịch sử hút sữa</h2>
        {items.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {items.length} cữ gần đây
          </span>
        )}
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const hasVolume =
            item.leftAmountMl != null || item.rightAmountMl != null;
          return (
            <HistoryTimelineItem
              key={item.id}
              at={item.startTime}
              timeZone={user.timezone}
              tone="sky"
              showDate
            >
              <div
                data-history-card
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3.5 shadow-xs transition-colors hover:border-sky-200 dark:hover:border-sky-900/60"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#f2eafb] dark:bg-[#382d46]">
                  <Droplets className="size-9" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">
                      {!hasVolume
                        ? "Chưa nhập lượng sữa"
                        : `${formatNumber(pumpingAmount(item), 1)} ml`}
                    </p>
                    {item.durationMinutes != null && (
                      <span className="summary-chip summary-chip-diaper text-xs">
                        {item.durationMinutes} phút
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {dateFormat.format(item.startTime)}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                    <span className="rounded-lg bg-muted px-2 py-0.5">
                      Trái:{" "}
                      {item.leftAmountMl == null
                        ? "—"
                        : `${formatNumber(item.leftAmountMl, 1)} ml`}
                    </span>
                    <span className="rounded-lg bg-muted px-2 py-0.5">
                      Phải:{" "}
                      {item.rightAmountMl == null
                        ? "—"
                        : `${formatNumber(item.rightAmountMl, 1)} ml`}
                    </span>
                  </div>
                  {item.notes && (
                    <p className="mt-1.5 whitespace-pre-wrap break-words text-xs text-muted-foreground">
                      {item.notes}
                    </p>
                  )}
                </div>
                <RecordActions
                  id={item.id}
                  editHref={`/mother/pumping?edit=${item.id}`}
                  deleteAction={deletePumpingAction}
                  editLabel="Sửa"
                  deleteLabel="Xóa"
                />
              </div>
            </HistoryTimelineItem>
          );
        })}
        {!items.length && (
          <CareEmptyState
            kind="pumping"
            title="Chưa có cữ hút sữa"
            description="Ghi cữ hút đầu tiên hoặc bấm giờ ngay ở trên để bắt đầu theo dõi nguồn sữa của mẹ."
          />
        )}
      </div>
      <HistoryLoadMore
        href="/mother/pumping"
        currentLimit={limit}
        hasMore={history.length > limit}
      />
    </>
  );
}
