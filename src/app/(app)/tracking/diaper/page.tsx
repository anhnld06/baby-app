import { Shell } from "lucide-react";
import { deleteDiaperAction, saveDiaperAction } from "@/app/actions";
import { CollapsibleRecordForm } from "@/components/collapsible-record-form";
import { Field, SelectField, TextAreaField } from "@/components/form-fields";
import { FormActionBar } from "@/components/form-action-bar";
import { MetricGrid } from "@/components/metric-grid";
import { PageHeader } from "@/components/page-header";
import { RecordActions } from "@/components/record-actions";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { getLocalDayRange, toDateTimeLocal } from "@/lib/date";
import { db } from "@/lib/db";
import { getDictionary, getLocale } from "@/lib/i18n";

const labels = {
  vi: { WET: "Tã ướt", STOOL: "Đi ngoài", BOTH: "Cả hai" },
  en: { WET: "Wet", STOOL: "Stool", BOTH: "Both" },
} as const;

export default async function DiaperPage({
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
        <PageHeader title={t.tracking.newDiaper} backHref="/" />
        <p>{t.common.noData}</p>
      </>
    );
  const { start, end } = getLocalDayRange();
  const [items, editing] = await Promise.all([
    db.diaperEntry.findMany({
      where: { babyId: baby.id },
      orderBy: { changedAt: "desc" },
      take: 40,
    }),
    params.edit
      ? db.diaperEntry.findFirst({
          where: { id: params.edit, babyId: baby.id },
        })
      : null,
  ]);
  const today = items.filter(
    (item) => item.changedAt >= start && item.changedAt < end,
  );
  const wet = today.filter(
    (item) => item.type === "WET" || item.type === "BOTH",
  ).length;
  const stool = today.filter(
    (item) => item.type === "STOOL" || item.type === "BOTH",
  ).length;
  return (
    <>
      <PageHeader
        title={editing ? t.tracking.editDiaper : t.tracking.newDiaper}
        subtitle={baby.name}
        backHref="/"
      />
      <MetricGrid
        items={[
          { label: t.dashboard.wet, value: String(wet) },
          { label: t.dashboard.stool, value: String(stool) },
        ]}
      />
      <CollapsibleRecordForm
        key={`${editing?.id ?? "new"}-${items.length}`}
        defaultOpen={!!editing}
        addLabel={t.tracking.newDiaper}
        closeLabel={t.common.cancel}
      >
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <form
            id="diaper-form"
            action={saveDiaperAction}
            className="space-y-4"
          >
            <input type="hidden" name="babyId" value={baby.id} />
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <SelectField
              name="type"
              label={t.tracking.type}
              defaultValue={editing?.type ?? "WET"}
            >
              {Object.entries(labels[locale]).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </SelectField>
            <Field
              name="changedAt"
              type="datetime-local"
              required
              label={t.tracking.changedAt}
              defaultValue={toDateTimeLocal(editing?.changedAt)}
            />
            <div className="grid min-w-0 gap-4 min-[430px]:grid-cols-2">
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
              label={t.tracking.amount}
              defaultValue={editing?.amount ?? ""}
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
        formId="diaper-form"
        saveLabel={editing ? t.common.update : t.common.save}
        cancelHref={editing ? "/tracking/diaper" : undefined}
        cancelLabel={t.common.cancel}
        deleteAction={editing ? deleteDiaperAction : undefined}
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
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <Shell className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{labels[locale][item.type]}</p>
              <p className="truncate text-sm text-muted-foreground">
                {new Intl.DateTimeFormat(locale, {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(item.changedAt)}
                {item.stoolColor ? ` · ${item.stoolColor}` : ""}
              </p>
            </div>
            <RecordActions
              id={item.id}
              editHref={`/tracking/diaper?edit=${item.id}`}
              deleteAction={deleteDiaperAction}
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
