import { Baby as BabyIcon } from "lucide-react";
import { deleteFeedingAction, saveFeedingAction } from "@/app/actions";
import { CollapsibleRecordForm } from "@/components/collapsible-record-form";
import { Field, SelectField, TextAreaField } from "@/components/form-fields";
import { FormActionBar } from "@/components/form-action-bar";
import { MetricGrid } from "@/components/metric-grid";
import { PageHeader } from "@/components/page-header";
import { RecordActions } from "@/components/record-actions";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { formatDuration, getLocalDayRange, toDateTimeLocal } from "@/lib/date";
import { db } from "@/lib/db";
import { getDictionary, getLocale } from "@/lib/i18n";
import { averageGapMinutes, totalDurationMinutes } from "@/lib/metrics";

const typeLabels = {
  vi: {
    BREASTFEEDING: "Bú mẹ",
    BOTTLE_BREAST_MILK: "Sữa mẹ bình",
    FORMULA: "Sữa công thức",
    MIXED: "Kết hợp",
  },
  en: {
    BREASTFEEDING: "Breastfeeding",
    BOTTLE_BREAST_MILK: "Bottle breast milk",
    FORMULA: "Formula",
    MIXED: "Mixed",
  },
} as const;

export default async function FeedingPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const [user, t, locale, params] = await Promise.all([
    requireUser(),
    getDictionary(),
    getLocale(),
    searchParams,
  ]);
  const baby = await getSelectedBaby(user.id);
  if (!baby)
    return (
      <>
        <PageHeader title={t.tracking.newFeeding} backHref="/" />
        <p>{t.common.noData}</p>
      </>
    );
  const { start, end } = getLocalDayRange();
  const [items, editing] = await Promise.all([
    db.feeding.findMany({
      where: { babyId: baby.id },
      orderBy: { startTime: "desc" },
      take: 30,
    }),
    params.edit
      ? db.feeding.findFirst({ where: { id: params.edit, babyId: baby.id } })
      : null,
  ]);
  const today = items.filter(
    (item) => item.startTime >= start && item.startTime < end,
  );
  const now = new Date();
  const sinceLast = items[0]
    ? Math.max(0, (now.getTime() - items[0].startTime.getTime()) / 60_000)
    : 0;
  return (
    <>
      <PageHeader
        title={editing ? t.tracking.editFeeding : t.tracking.newFeeding}
        subtitle={baby.name}
        backHref="/"
      />
      <MetricGrid
        items={[
          { label: t.dashboard.feedsToday, value: String(today.length) },
          {
            label: t.tracking.totalDuration,
            value: formatDuration(totalDurationMinutes(today, now), locale),
          },
          {
            label: t.tracking.averageGap,
            value: formatDuration(averageGapMinutes(today), locale),
          },
          {
            label: t.dashboard.lastFeed,
            value: items[0] ? formatDuration(sinceLast, locale) : "—",
          },
        ]}
      />
      <CollapsibleRecordForm
        key={`${editing?.id ?? "new"}-${items.length}`}
        defaultOpen={!!editing}
        addLabel={t.tracking.newFeeding}
        closeLabel={t.common.cancel}
      >
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <form
            id="feeding-form"
            action={saveFeedingAction}
            className="space-y-4"
          >
            <input type="hidden" name="babyId" value={baby.id} />
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <SelectField
              name="type"
              label={t.tracking.type}
              defaultValue={editing?.type ?? "BREASTFEEDING"}
            >
              {Object.entries(typeLabels[locale]).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </SelectField>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                name="startTime"
                type="datetime-local"
                required
                label={t.tracking.startTime}
                defaultValue={toDateTimeLocal(editing?.startTime)}
              />
              <Field
                name="endTime"
                type="datetime-local"
                label={t.tracking.endTime}
                defaultValue={
                  editing?.endTime ? toDateTimeLocal(editing.endTime) : ""
                }
              />
            </div>
            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <Field
                name="leftBreastDuration"
                type="number"
                min="0"
                inputMode="numeric"
                label={t.tracking.leftMinutes}
                defaultValue={editing?.leftBreastDuration ?? ""}
              />
              <Field
                name="rightBreastDuration"
                type="number"
                min="0"
                inputMode="numeric"
                label={t.tracking.rightMinutes}
                defaultValue={editing?.rightBreastDuration ?? ""}
              />
            </div>
            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <Field
                name="amountMl"
                type="number"
                min="0"
                step="1"
                inputMode="decimal"
                label={t.tracking.amountMl}
                defaultValue={editing?.amountMl ?? ""}
              />
              <SelectField
                name="firstSide"
                label={t.tracking.firstSide}
                defaultValue={editing?.firstSide ?? ""}
              >
                <option value="">—</option>
                <option value="LEFT">{t.tracking.left}</option>
                <option value="RIGHT">{t.tracking.right}</option>
              </SelectField>
            </div>
            <Field
              name="milkType"
              label={t.tracking.milkType}
              defaultValue={editing?.milkType ?? ""}
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
        formId="feeding-form"
        saveAction={saveFeedingAction}
        saveLabel={editing ? t.common.update : t.common.save}
        cancelHref={editing ? "/tracking/feeding" : undefined}
        cancelLabel={t.common.cancel}
        deleteAction={editing ? deleteFeedingAction : undefined}
        deleteId={editing?.id}
        deleteLabel={t.common.delete}
      />
      </CollapsibleRecordForm>
      <h2 className="mb-2 mt-7 text-lg font-semibold">{t.tracking.history}</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
              <BabyIcon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{typeLabels[locale][item.type]}</p>
              <p className="text-sm text-muted-foreground">
                {new Intl.DateTimeFormat(locale, {
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
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">{t.common.noData}</p>
        )}
      </div>
    </>
  );
}
