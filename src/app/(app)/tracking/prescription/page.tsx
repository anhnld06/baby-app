import { HistoryTimelineItem } from "@/components/history-timeline-item";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MedicineIcon as Pill } from "@/components/app-icons";
import { deletePrescriptionAction, savePrescriptionAction } from "@/app/actions";
import { CollapsibleRecordForm } from "@/components/collapsible-record-form";
import { FormActionBar } from "@/components/form-action-bar";
import { HistoryLoadMore } from "@/components/history-load-more";
import { PageHeader } from "@/components/page-header";
import { CareSummary } from "@/components/care-summary";
import { PrescriptionForm } from "@/components/prescription-form";
import { RecordActions } from "@/components/record-actions";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { db } from "@/lib/db";
import { getDictionary, getLocale } from "@/lib/i18n";
import { parseHistoryLimit } from "@/lib/pagination";

export default async function PrescriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; limit?: string; view?: string; new?: string; date?: string; saved?: string; name?: string; dosage?: string }>;
}) {
  const [user, t, locale, params] = await Promise.all([
    requireUser(),
    getDictionary(),
    getLocale(),
    searchParams,
  ]);
  if (params.view !== "archive" && !params.edit) {
    const query = new URLSearchParams(Object.entries(params).filter(([key, value]) => key !== "view" && value != null) as [string, string][]);
    redirect(`/tracking/medication${query.size ? `?${query}` : ""}`);
  }
  const baby = await getSelectedBaby(user.id);
  if (!baby)
    return (
      <>
        <PageHeader compact title={t.tracking.newPrescription} backHref="/baby" />
        <p>{t.common.noData}</p>
      </>
    );
  const limit = parseHistoryLimit(params.limit);
  const [historyItems, editing] = await Promise.all([
    db.prescription.findMany({
      where: { babyId: baby.id },
      orderBy: { issuedAt: "desc" },
      include: { items: true },
      take: limit + 1,
    }),
    params.edit
      ? db.prescription.findFirst({
          where: { id: params.edit, babyId: baby.id },
          include: { items: true },
        })
      : null,
  ]);
  const hasMore = historyItems.length > limit;
  const items = historyItems.slice(0, limit);
  return (
    <>
      <PageHeader compact
        title={editing ? t.tracking.editPrescription : t.tracking.newPrescription}
        subtitle={baby.name}
        backHref="/baby"
      />
      {!editing && <CareSummary kind="prescription" title={items[0] ? (locale === "vi" ? "Đơn thuốc gần nhất" : "Latest prescription") : (locale === "vi" ? "Chưa có đơn thuốc" : "No prescriptions yet")}>
        {items[0] ? `${new Intl.DateTimeFormat(locale, { timeZone: user.timezone, dateStyle: "short" }).format(items[0].issuedAt)} · ${items[0].items.length} ${locale === "vi" ? "thuốc đã lưu" : "saved medications"}` : (locale === "vi" ? "Thêm đơn thuốc để lưu thông tin và hướng dẫn đã được kê." : "Save a prescription and its existing instructions.")}
      </CareSummary>}
      <Link href="/tracking/medication" className="mb-5 flex min-h-16 items-center gap-3 rounded-3xl bg-violet-50 p-5 font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-200"><Pill className="size-5"/>Lịch thuốc hằng ngày & checklist →</Link>
      <CollapsibleRecordForm prominent editingId={editing?.id}
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
        saveAction={savePrescriptionAction}
        saveLabel={editing ? t.common.update : t.common.save}
        cancelHref={editing ? "/tracking/prescription?view=archive" : undefined}
        cancelLabel={t.common.cancel}
        deleteAction={editing ? deletePrescriptionAction : undefined}
        deleteId={editing?.id}
        deleteLabel={t.common.delete}
      />
      </CollapsibleRecordForm>
      <h2 className="mb-2 mt-7 text-lg font-semibold">{t.tracking.history}</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <HistoryTimelineItem key={item.id} at={item.issuedAt} timeZone={user.timezone} locale={locale} showDate>
          <div
            data-history-card
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
                  timeZone: user.timezone,
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(item.issuedAt)}
                {item.prescribedBy ? ` · ${item.prescribedBy}` : ""}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">{item.items.map(line=><Link key={line.id} href={`/tracking/medication?new=1&name=${encodeURIComponent(line.medicineName)}&dosage=${encodeURIComponent(line.dosage ?? "")}`} className="inline-flex min-h-11 items-center rounded-full bg-secondary px-3 text-xs text-primary">Tạo lịch: {line.medicineName}</Link>)}</div>
            </div>
            <RecordActions
              id={item.id}
              editHref={`/tracking/prescription?view=archive&edit=${item.id}`}
              deleteAction={deletePrescriptionAction}
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
      <HistoryLoadMore href="/tracking/prescription?view=archive" currentLimit={limit} hasMore={hasMore} />
    </>
  );
}
