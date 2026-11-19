import { CareBentoHero, CareEmptyState } from "@/components/care-bento-hero";
import { HistoryTimelineItem } from "@/components/history-timeline-item";
import { RecordScene } from "@/components/record-scene";
import { ChoiceFields } from "@/components/choice-fields";
import { DiaperIcon as Shell } from "@/components/app-icons";
import { deleteDiaperAction, saveDiaperAction } from "@/app/actions";
import { CollapsibleRecordForm } from "@/components/collapsible-record-form";
import { Field, TextAreaField } from "@/components/form-fields";
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
import { parseHistoryLimit } from "@/lib/pagination";
import { asFormAction } from "@/lib/form-action";

const labels = { WET: "Tã ướt", STOOL: "Đi ngoài", BOTH: "Cả hai" } as const;

const badgeTones = {
  WET: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  STOOL: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  BOTH: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
} as const;

export default async function DiaperPage({
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
        <PageHeader compact title={t.tracking.newDiaper} backHref="/baby" />
        <p>{t.common.noData}</p>
      </>
    );
  const now = new Date();
  const { start, end } = getLocalDayRange(now, user.timezone);
  const limit = parseHistoryLimit(params.limit, 40);
  const [historyItems, today, editing] = await Promise.all([
    db.diaperEntry.findMany({
      where: { babyId: baby.id },
      orderBy: { changedAt: "desc" },
      take: limit + 1,
    }),
    db.diaperEntry.findMany({
      where: { babyId: baby.id, changedAt: { gte: start, lt: end } },
      orderBy: { changedAt: "desc" },
    }),
    params.edit
      ? db.diaperEntry.findFirst({
          where: { id: params.edit, babyId: baby.id },
        })
      : null,
  ]);
  const hasMore = historyItems.length > limit;
  const items = historyItems.slice(0, limit);
  const wet = today.filter(
    (item) => item.type === "WET" || item.type === "BOTH",
  ).length;
  const stool = today.filter(
    (item) => item.type === "STOOL" || item.type === "BOTH",
  ).length;
  const sinceLast = items[0]
    ? Math.max(0, (now.getTime() - items[0].changedAt.getTime()) / 60_000)
    : null;

  return (
    <>
      <PageHeader
        compact
        title={editing ? t.tracking.editDiaper : t.tracking.newDiaper}
        subtitle={baby.name}
        backHref="/baby"
      />
      {!(params.new === "1" || editing) && (
        <CareBentoHero
          kind="diaper"
          tone="emerald"
          eyebrow="Chăm sóc bỉm / tã"
          title={
            today.length > 0
              ? `Đã thay ${today.length} lần tã hôm nay`
              : "Ghi lần thay tã đầu tiên hôm nay"
          }
          description={
            sinceLast != null
              ? `Lần thay gần nhất cách đây ${formatDuration(sinceLast)}.`
              : "Theo dõi tã ướt và đi ngoài giúp nhận biết bé bú đủ sữa mỗi ngày."
          }
        >
          <MetricGrid
            embedded
            items={[
              { label: t.dashboard.wet, value: String(wet) },
              { label: t.dashboard.stool, value: String(stool) },
            ]}
          />
        </CareBentoHero>
      )}
      <CollapsibleRecordForm
        prominent
        editingId={editing?.id}
        key={`${editing?.id ?? "new"}-${params.new ?? ""}-${items.length}`}
        defaultOpen={!!editing || params.new === "1"}
        addLabel={t.tracking.newDiaper}
        closeLabel={t.common.cancel}
      >
        <RecordScene
          kind="diaper"
          timeZone={user.timezone}
          initialValues={{ type: editing?.type ?? "WET" }}
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <form
                id="diaper-form"
                action={asFormAction(saveDiaperAction)}
                className="space-y-4"
              >
                <input type="hidden" name="babyId" value={baby.id} />
                {editing && <input type="hidden" name="id" value={editing.id} />}
                <ChoiceFields
                  name="type"
                  label={t.tracking.type}
                  initialValue={editing?.type ?? "WET"}
                  options={Object.entries(labels).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                  groups={[
                    {
                      values: ["STOOL", "BOTH"],
                      fields: (
                        <>
                          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                            <Field
                              name="stoolColor"
                              label={t.tracking.stoolColor}
                              defaultValue={editing?.stoolColor ?? ""}
                            />
                            <Field
                              name="consistency"
                              label={t.tracking.consistency}
                              defaultValue={editing?.consistency ?? ""}
                            />
                          </div>
                          <Field
                            name="amount"
                            label="Lượng phân"
                            defaultValue={editing?.amount ?? ""}
                          />
                        </>
                      ),
                    },
                  ]}
                >
                  <Field
                    name="changedAt"
                    type="datetime-local"
                    required
                    label={t.tracking.changedAt}
                    defaultValue={toDateTimeLocal(editing?.changedAt, user.timezone)}
                  />
                </ChoiceFields>
                <TextAreaField
                  name="notes"
                  label={t.common.notes}
                  defaultValue={editing?.notes ?? ""}
                />
              </form>
            </CardContent>
          </Card>
          <FormActionBar
            formId="diaper-form"
            saveAction={saveDiaperAction}
            saveLabel={editing ? t.common.update : "Lưu thay tã"}
            cancelHref={
              editing || params.new === "1" ? "/tracking/diaper" : undefined
            }
            cancelLabel={t.common.cancel}
            deleteAction={editing ? deleteDiaperAction : undefined}
            deleteId={editing?.id}
            deleteLabel={t.common.delete}
            offlineMutationType={editing ? undefined : "CREATE_DIAPER"}
          />
        </RecordScene>
      </CollapsibleRecordForm>
      <div className="mb-3 mt-7 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t.tracking.history}</h2>
        {items.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {items.length} lần gần đây
          </span>
        )}
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <HistoryTimelineItem
            key={item.id}
            at={item.changedAt}
            timeZone={user.timezone}
            tone="emerald"
            showDate
          >
            <div
              data-history-card
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3.5 shadow-xs transition-colors hover:border-emerald-200 dark:hover:border-emerald-900/60"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#e8f3fb] dark:bg-[#24384b]">
                <Shell className="size-9" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{labels[item.type]}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${badgeTones[item.type]}`}
                  >
                    {item.type === "WET"
                      ? "Ướt"
                      : item.type === "STOOL"
                        ? "Phân"
                        : "Ướt & phân"}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {new Intl.DateTimeFormat("vi-VN", {
                    timeZone: user.timezone,
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(item.changedAt)}
                  {item.type !== "WET" && item.stoolColor
                    ? ` · Màu: ${item.stoolColor}`
                    : ""}
                  {item.type !== "WET" && item.consistency
                    ? ` · ${item.consistency}`
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
                editHref={`/tracking/diaper?edit=${item.id}`}
                deleteAction={deleteDiaperAction}
                editLabel={t.common.edit}
                deleteLabel={t.common.delete}
              />
            </div>
          </HistoryTimelineItem>
        ))}
        {items.length === 0 && (
          <CareEmptyState
            kind="diaper"
            title={t.common.noData}
            description="Ghi lại mỗi lần thay tã để dễ nhận diện sức khỏe tiêu hóa và lượng sữa con hấp thu."
          />
        )}
      </div>
      <HistoryLoadMore
        href="/tracking/diaper"
        currentLimit={limit}
        increment={40}
        hasMore={hasMore}
      />
    </>
  );
}
