import { Syringe } from "lucide-react";
import { deleteVaccinationAction, saveVaccinationAction } from "@/app/actions";
import { CollapsibleRecordForm } from "@/components/collapsible-record-form";
import { FormActionBar } from "@/components/form-action-bar";
import { HistoryLoadMore } from "@/components/history-load-more";
import { PageHeader } from "@/components/page-header";
import { RecordActions } from "@/components/record-actions";
import { VaccinationForm } from "@/components/vaccination-form";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { db } from "@/lib/db";
import { getDictionary, getLocale } from "@/lib/i18n";
import { parseHistoryLimit } from "@/lib/pagination";

export default async function VaccinationPage({
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
        <PageHeader title={t.tracking.newVaccination} backHref="/" />
        <p>{t.common.noData}</p>
      </>
    );
  const limit = parseHistoryLimit(params.limit);
  const [historyItems, editing] = await Promise.all([
    db.vaccinationRecord.findMany({
      where: { babyId: baby.id },
      orderBy: { administeredAt: "desc" },
      take: limit + 1,
    }),
    params.edit
      ? db.vaccinationRecord.findFirst({
          where: { id: params.edit, babyId: baby.id },
        })
      : null,
  ]);
  const hasMore = historyItems.length > limit;
  const items = historyItems.slice(0, limit);
  return (
    <>
      <PageHeader
        title={editing ? t.tracking.editVaccination : t.tracking.newVaccination}
        subtitle={baby.name}
        backHref="/"
      />
      <CollapsibleRecordForm
        key={`${editing?.id ?? "new"}-${items.length}`}
        defaultOpen={!!editing}
        addLabel={t.tracking.newVaccination}
        closeLabel={t.common.cancel}
      >
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <VaccinationForm
            babyId={baby.id}
            editing={editing}
            locale={locale}
            labels={{
              vaccineName: t.tracking.vaccineName,
              doseNumber: t.tracking.doseNumber,
              administeredAt: t.tracking.administeredAt,
              facility: t.tracking.facility,
              batchNumber: t.tracking.batchNumber,
              nextDueAt: t.tracking.nextDueAt,
              notes: t.common.notes,
              scanPhoto: t.common.scanPhoto,
              scanning: t.common.scanning,
              ocrUnavailable: t.common.ocrUnavailable,
            }}
          />
        </CardContent>
      </Card>
      <FormActionBar
        formId="vaccination-form"
        saveAction={saveVaccinationAction}
        saveLabel={editing ? t.common.update : t.common.save}
        cancelHref={editing ? "/tracking/vaccination" : undefined}
        cancelLabel={t.common.cancel}
        deleteAction={editing ? deleteVaccinationAction : undefined}
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
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
              <Syringe className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {item.vaccineName}
                {item.doseNumber ? ` · #${item.doseNumber}` : ""}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Intl.DateTimeFormat(locale, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(item.administeredAt)}
                {item.facility ? ` · ${item.facility}` : ""}
              </p>
            </div>
            <RecordActions
              id={item.id}
              editHref={`/tracking/vaccination?edit=${item.id}`}
              deleteAction={deleteVaccinationAction}
              editLabel={t.common.edit}
              deleteLabel={t.common.delete}
            />
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">{t.common.noData}</p>
        )}
      </div>
      <HistoryLoadMore href="/tracking/vaccination" currentLimit={limit} hasMore={hasMore} />
    </>
  );
}
