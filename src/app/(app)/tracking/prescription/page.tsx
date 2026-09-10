import { Pill } from "lucide-react";
import { deletePrescriptionAction } from "@/app/actions";
import { CollapsibleRecordForm } from "@/components/collapsible-record-form";
import { FormActionBar } from "@/components/form-action-bar";
import { PageHeader } from "@/components/page-header";
import { PrescriptionForm } from "@/components/prescription-form";
import { RecordActions } from "@/components/record-actions";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { db } from "@/lib/db";
import { getDictionary, getLocale } from "@/lib/i18n";

export default async function PrescriptionPage({
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
        <PageHeader title={t.tracking.newPrescription} backHref="/" />
        <p>{t.common.noData}</p>
      </>
    );
  const [items, editing] = await Promise.all([
    db.prescription.findMany({
      where: { babyId: baby.id },
      orderBy: { issuedAt: "desc" },
      include: { items: true },
      take: 30,
    }),
    params.edit
      ? db.prescription.findFirst({
          where: { id: params.edit, babyId: baby.id },
          include: { items: true },
        })
      : null,
  ]);
  return (
    <>
      <PageHeader
        title={editing ? t.tracking.editPrescription : t.tracking.newPrescription}
        subtitle={baby.name}
        backHref="/"
      />
      <CollapsibleRecordForm
        key={`${editing?.id ?? "new"}-${items.length}`}
        defaultOpen={!!editing}
        addLabel={t.tracking.newPrescription}
        closeLabel={t.common.cancel}
      >
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <PrescriptionForm
            babyId={baby.id}
            editing={editing}
            locale={locale}
            labels={{
              prescribedBy: t.tracking.prescribedBy,
              diagnosis: t.tracking.diagnosis,
              issuedAt: t.tracking.issuedAt,
              notes: t.common.notes,
              medicineName: t.tracking.medicineName,
              dosage: t.tracking.dosage,
              frequency: t.tracking.frequency,
              durationDays: t.tracking.durationDays,
              instructions: t.tracking.instructions,
              addMedicine: t.tracking.addMedicine,
              removeMedicine: t.tracking.removeMedicine,
              scanPhoto: t.common.scanPhoto,
              scanning: t.common.scanning,
              ocrUnavailable: t.common.ocrUnavailable,
            }}
          />
        </CardContent>
      </Card>
      <FormActionBar
        formId="prescription-form"
        saveLabel={editing ? t.common.update : t.common.save}
        cancelHref={editing ? "/tracking/prescription" : undefined}
        cancelLabel={t.common.cancel}
        deleteAction={editing ? deletePrescriptionAction : undefined}
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
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              <Pill className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {item.items.map((line) => line.medicineName).join(", ") || item.diagnosis || t.common.unknown}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Intl.DateTimeFormat(locale, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(item.issuedAt)}
                {item.prescribedBy ? ` · ${item.prescribedBy}` : ""}
              </p>
            </div>
            <RecordActions
              id={item.id}
              editHref={`/tracking/prescription?edit=${item.id}`}
              deleteAction={deletePrescriptionAction}
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
