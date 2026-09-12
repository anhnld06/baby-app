import { Ruler } from "lucide-react";
import {
  deleteGrowthAction,
  recalculateLatestGrowthAction,
  saveGrowthAction,
} from "@/app/actions";
import { CollapsibleRecordForm } from "@/components/collapsible-record-form";
import { Field, SelectField, TextAreaField } from "@/components/form-fields";
import { FormActionBar } from "@/components/form-action-bar";
import { GrowthTrends } from "@/components/growth-trends";
import { HistoryLoadMore } from "@/components/history-load-more";
import { PageHeader } from "@/components/page-header";
import { RecordActions } from "@/components/record-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { whoAnthroConfig } from "@/features/growth/who-anthro";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { toDateTimeLocal } from "@/lib/date";
import { db } from "@/lib/db";
import { getDictionary, getLocale } from "@/lib/i18n";
import { parseHistoryLimit } from "@/lib/pagination";

export default async function GrowthPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; limit?: string }>;
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
  const whoConfigured = whoAnthroConfig().configured;
  return (
    <>
      <PageHeader
        title={editing ? t.tracking.editGrowth : t.tracking.newGrowth}
        subtitle={`${baby.name} · Xu hướng và chuẩn WHO khi khả dụng`}
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
                defaultValue={toDateTimeLocal(editing?.measuredAt, user.timezone)}
              />
              <SelectField
                name="measurementPosition"
                label="Tư thế đo chiều dài/chiều cao"
                defaultValue={editing?.measurementPosition ?? ""}
              >
                <option value="">Không ghi nhận</option>
                <option value="RECUMBENT">Nằm đo chiều dài</option>
                <option value="STANDING">Đứng đo chiều cao</option>
              </SelectField>
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
        locale={locale}
      />
      {items[0]?.assessment && (
        <section className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-900 dark:bg-sky-950/50">
          <h2 className="font-semibold">Z-score WHO của lần đo gần nhất</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            <ZScore label="Cân nặng / tuổi" value={items[0].assessment.weightAgeZ} />
            <ZScore label="Chiều cao / tuổi" value={items[0].assessment.heightAgeZ} />
            <ZScore label="Cân nặng / chiều cao" value={items[0].assessment.weightHeightZ} />
            <ZScore label="BMI / tuổi" value={items[0].assessment.bmiAgeZ} />
            <ZScore label="Vòng đầu / tuổi" value={items[0].assessment.headAgeZ} />
          </div>
          {items[0].assessment.flags.length > 0 && (
            <p className="mt-3 text-xs text-amber-800 dark:text-amber-200">
              WHO đánh dấu số đo cần kiểm tra lại trước khi diễn giải.
            </p>
          )}
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Kết quả tham khảo từ WHO Child Growth Standards, không thay thế đánh giá của bác sĩ.
          </p>
        </section>
      )}
      {items.length > 0 && !items[0].assessment && (
        <section className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h2 className="font-semibold">Chưa có kết quả chuẩn WHO</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {whoConfigured
              ? "Dịch vụ WHO Anthro đã được cấu hình. Bạn có thể tính lại lần đo gần nhất."
              : "Khởi động service WHO Anthro và cấu hình WHO_ANTHRO_URL, WHO_ANTHRO_TOKEN để tính Z-score."}
          </p>
          {whoConfigured && (
            <form action={recalculateLatestGrowthAction} className="mt-3">
              <input type="hidden" name="babyId" value={baby.id} />
              <Button type="submit" variant="secondary" className="h-11 rounded-xl">
                Tính lại lần đo gần nhất
              </Button>
            </form>
          )}
        </section>
      )}
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
      <HistoryLoadMore href="/tracking/growth" currentLimit={limit} hasMore={hasMore} />
    </>
  );
}

function ZScore({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-xl bg-background/80 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value === null ? "—" : value.toFixed(2)}</p>
    </div>
  );
}
