import { BedDouble } from "lucide-react";
import { deleteSleepAction, saveSleepAction } from "@/app/actions";
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
import {
  averageCompletedDurationMinutes,
  longestDurationMinutes,
  totalDurationMinutes,
} from "@/lib/metrics";

export default async function SleepPage({
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
        <PageHeader title={t.tracking.newSleep} backHref="/" />
        <p>{t.common.noData}</p>
      </>
    );
  const { start, end } = getLocalDayRange();
  const [items, editing] = await Promise.all([
    db.sleepEntry.findMany({
      where: { babyId: baby.id },
      orderBy: { startTime: "desc" },
      take: 30,
    }),
    params.edit
      ? db.sleepEntry.findFirst({ where: { id: params.edit, babyId: baby.id } })
      : null,
  ]);
  const today = items.filter(
    (item) => item.startTime >= start && item.startTime < end,
  );
  const naps = today.filter((item) => item.type === "NAP");
  const now = new Date();
  const latest = items[0];
  const awakeMinutes = latest
    ? latest.endTime
      ? (now.getTime() - latest.endTime.getTime()) / 60_000
      : 0
    : 0;
  return (
    <>
      <PageHeader
        title={editing ? t.tracking.editSleep : t.tracking.newSleep}
        subtitle={baby.name}
        backHref="/"
      />
      <MetricGrid
        items={[
          {
            label: t.dashboard.sleepToday,
            value: formatDuration(totalDurationMinutes(today, now), locale),
          },
          { label: t.tracking.sleepCount, value: String(today.length) },
          {
            label: t.tracking.averageNap,
            value: formatDuration(
              averageCompletedDurationMinutes(naps),
              locale,
            ),
          },
          {
            label: t.tracking.longestSleep,
            value: formatDuration(longestDurationMinutes(today, now), locale),
          },
          {
            label: latest?.endTime ? t.tracking.awakeFor : t.dashboard.sleeping,
            value: latest?.endTime
              ? formatDuration(awakeMinutes, locale)
              : formatDuration(0, locale),
          },
        ]}
      />
      <CollapsibleRecordForm
        key={`${editing?.id ?? "new"}-${items.length}`}
        defaultOpen={!!editing}
        addLabel={t.tracking.newSleep}
        closeLabel={t.common.cancel}
      >
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <form id="sleep-form" action={saveSleepAction} className="space-y-4">
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
        saveLabel={editing ? t.common.update : t.common.save}
        cancelHref={editing ? "/tracking/sleep" : undefined}
        cancelLabel={t.common.cancel}
        deleteAction={editing ? deleteSleepAction : undefined}
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
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <BedDouble className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">
                {item.type === "NAP" ? t.tracking.nap : t.tracking.night}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Intl.DateTimeFormat(locale, {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(item.startTime)}{" "}
                ·{" "}
                {item.endTime
                  ? formatDuration(
                      (item.endTime.getTime() - item.startTime.getTime()) /
                        60_000,
                      locale,
                    )
                  : t.tracking.openSession}
              </p>
            </div>
            <RecordActions
              id={item.id}
              editHref={`/tracking/sleep?edit=${item.id}`}
              deleteAction={deleteSleepAction}
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
