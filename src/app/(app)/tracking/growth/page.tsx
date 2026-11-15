import { WhoGrowthReference } from "@/components/who-growth-reference";
import { PrenatalGrowthBaseline } from "@/components/prenatal-growth-baseline";
import { HistoryTimelineItem } from "@/components/history-timeline-item";
import { HeightFields } from "@/components/height-fields";
import { GrowthIcon as Ruler } from "@/components/app-icons";
import {
  deleteGrowthAction,
  saveGrowthAction,
} from "@/app/actions";
import { CollapsibleRecordForm } from "@/components/collapsible-record-form";
import { Field, TextAreaField } from "@/components/form-fields";
import { FormActionBar } from "@/components/form-action-bar";
import { GrowthTrends } from "@/components/growth-trends";
import { GrowthSummary } from "@/components/growth-summary";
import { HistoryLoadMore } from "@/components/history-load-more";
import { PageHeader } from "@/components/page-header";
import { RecordActions } from "@/components/record-actions";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { toDateTimeLocal } from "@/lib/date";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";
import { parseHistoryLimit } from "@/lib/pagination";
import { asFormAction } from "@/lib/form-action";

export default async function GrowthPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string; limit?: string; who?: string }>;
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
        <PageHeader title={t.tracking.newGrowth} backHref="/baby" compact />
        <p>{t.common.noData}</p>
      </>
    );
  const limit = parseHistoryLimit(params.limit);
  const [historyItems, editing] = await Promise.all([
    db.growthEntry.findMany({
      where: { babyId: baby.id },
      orderBy: { measuredAt: "desc" },
      take: limit + 1,
      include: { assessment: true },
    }),
    params.edit
      ? db.growthEntry.findFirst({
          where: { id: params.edit, babyId: baby.id },
          include: { assessment: true },
        })
      : null,
  ]);
  const hasMore = historyItems.length > limit;
  const items = historyItems.slice(0, limit);
  const measurements = [
    {
      measuredAt: baby.dateOfBirth,
      weightKg: baby.birthWeightKg,
      heightCm: baby.birthLengthCm,
      headCircumferenceCm: baby.birthHeadCircumferenceCm,
    },
    ...items,
  ];
  return (
    <>
      <PageHeader
        compact
        title={editing ? t.tracking.editGrowth : params.new === "1" ? t.tracking.newGrowth : "Tăng trưởng của con"}
        subtitle={baby.name}
        backHref="/baby"
      />
      {!editing && params.new !== "1" && <PrenatalGrowthBaseline baby={baby} userId={user.id} timeZone={user.timezone} />}
      {!editing && params.new !== "1" && (
        <GrowthSummary measurements={measurements} dateOfBirth={baby.dateOfBirth} timeZone={user.timezone} />
      )}
      {!editing && params.new !== "1" && <WhoGrowthReference babyId={baby.id} locale="vi" timeZone={user.timezone} recalculate />}
      {params.who === "error" && <p role="alert" className="my-3 text-sm">Đã lưu số đo nhưng chưa lưu được kết quả WHO. Hãy thử tính lại.</p>}
      <CollapsibleRecordForm editingId={editing?.id}
        prominent
        key={`${editing?.id ?? "new"}-${items.length}`}
        defaultOpen={!!editing || params.new === "1"}
        addLabel="Thêm chỉ số"
        closeLabel={t.common.cancel}
      >
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <form
              id="growth-form"
              action={asFormAction(saveGrowthAction)}
              className="space-y-4"
            >
              <input type="hidden" name="babyId" value={baby.id} />
              {editing && <input type="hidden" name="id" value={editing.id} />}
              <Field
                name="measuredAt"
                type="datetime-local"
                required
                label={t.tracking.measuredAt}
                defaultValue={toDateTimeLocal(editing?.measuredAt, user.timezone)}
              />
              <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                <Field
                  name="weightKg"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  label={t.tracking.weight}
                  defaultValue={editing?.weightKg ?? ""}
                />
                <HeightFields label={t.tracking.height} initialHeight={editing?.heightCm} initialPosition={editing?.measurementPosition} />
              </div>
              <Field
                name="headCircumferenceCm"
                type="number"
                min="0"
                step="0.1"
                inputMode="decimal"
                label={t.tracking.head}
                defaultValue={editing?.headCircumferenceCm ?? ""}
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
          formId="growth-form"
          saveAction={saveGrowthAction}
          saveLabel={editing ? t.common.update : t.common.save}
          cancelHref={editing ? "/tracking/growth" : undefined}
          cancelLabel={t.common.cancel}
          deleteAction={editing ? deleteGrowthAction : undefined}
          deleteId={editing?.id}
          deleteLabel={t.common.delete}
        />
      </CollapsibleRecordForm>
      <GrowthTrends
        measurements={measurements}
        dateOfBirth={baby.dateOfBirth}
        gestationalAgeAtBirth={baby.gestationalAgeAtBirth}
        timeZone={user.timezone}
      />
      <h2 className="mb-2 mt-7 text-lg font-semibold">{t.tracking.history}</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <HistoryTimelineItem key={item.id} at={item.measuredAt} timeZone={user.timezone} showDate>
          <div
            data-history-card
            key={item.id}
            className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              <Ruler className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">
                {[
                  item.weightKg && `${item.weightKg} kg`,
                  item.heightCm && `${item.heightCm} cm`,
                  item.headCircumferenceCm &&
                    `HC ${item.headCircumferenceCm} cm`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Intl.DateTimeFormat("vi-VN", {
                  timeZone: user.timezone,
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(item.measuredAt)}
              </p>
            </div>
            <RecordActions
              id={item.id}
              editHref={`/tracking/growth?edit=${item.id}`}
              deleteAction={deleteGrowthAction}
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
      <HistoryLoadMore href="/tracking/growth" currentLimit={limit} hasMore={hasMore} />
    </>
  );
}
