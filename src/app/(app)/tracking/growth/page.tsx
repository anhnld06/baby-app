import { Ruler } from "lucide-react";
import { deleteGrowthAction, saveGrowthAction } from "@/app/actions";
import { CollapsibleRecordForm } from "@/components/collapsible-record-form";
import { Field, TextAreaField } from "@/components/form-fields";
import { FormActionBar } from "@/components/form-action-bar";
import { PageHeader } from "@/components/page-header";
import { RecordActions } from "@/components/record-actions";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { toDateTimeLocal } from "@/lib/date";
import { db } from "@/lib/db";
import { getDictionary, getLocale } from "@/lib/i18n";

export default async function GrowthPage({
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
        <PageHeader title={t.tracking.newGrowth} backHref="/" />
        <p>{t.common.noData}</p>
      </>
    );
  const [items, editing] = await Promise.all([
    db.growthEntry.findMany({
      where: { babyId: baby.id },
      orderBy: { measuredAt: "desc" },
      take: 30,
    }),
    params.edit
      ? db.growthEntry.findFirst({
          where: { id: params.edit, babyId: baby.id },
        })
      : null,
  ]);
  return (
    <>
      <PageHeader
        title={editing ? t.tracking.editGrowth : t.tracking.newGrowth}
        subtitle={`${baby.name} · ${t.tracking.noPercentile}`}
        backHref="/"
      />
      <CollapsibleRecordForm
        key={`${editing?.id ?? "new"}-${items.length}`}
        defaultOpen={!!editing}
        addLabel={t.tracking.newGrowth}
        closeLabel={t.common.cancel}
      >
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <form
              id="growth-form"
              action={saveGrowthAction}
              className="space-y-4"
            >
              <input type="hidden" name="babyId" value={baby.id} />
              {editing && <input type="hidden" name="id" value={editing.id} />}
              <Field
                name="measuredAt"
                type="datetime-local"
                required
                label={t.tracking.measuredAt}
                defaultValue={toDateTimeLocal(editing?.measuredAt)}
              />
              <div className="grid min-w-0 gap-4 min-[430px]:grid-cols-2">
                <Field
                  name="weightKg"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  label={t.tracking.weight}
                  defaultValue={editing?.weightKg ?? ""}
                />
                <Field
                  name="heightCm"
                  type="number"
                  min="0"
                  step="0.1"
                  inputMode="decimal"
                  label={t.tracking.height}
                  defaultValue={editing?.heightCm ?? ""}
                />
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
          saveLabel={editing ? t.common.update : t.common.save}
          cancelHref={editing ? "/tracking/growth" : undefined}
          cancelLabel={t.common.cancel}
          deleteAction={editing ? deleteGrowthAction : undefined}
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
                {new Intl.DateTimeFormat(locale, {
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
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">{t.common.noData}</p>
        )}
      </div>
    </>
  );
}
