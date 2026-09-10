import { Syringe, UserRound } from "lucide-react";
import { deleteMotherVaccinationAction, saveMotherVaccinationAction } from "@/app/actions";
import { CollapsibleRecordForm } from "@/components/collapsible-record-form";
import { Field, TextAreaField } from "@/components/form-fields";
import { FeatureLink } from "@/components/feature-link";
import { FormActionBar } from "@/components/form-action-bar";
import { PageHeader } from "@/components/page-header";
import { RecordActions } from "@/components/record-actions";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { toDateInputValue } from "@/lib/date";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/i18n";

export default async function MotherVaccinationPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const [user, locale, params] = await Promise.all([requireUser(), getLocale(), searchParams]);
  const mother = await db.mother.findUnique({ where: { userId: user.id } });
  if (!mother)
    return (
      <FeatureLink
        href="/profile/mother"
        icon={UserRound}
        title="Tạo hồ sơ mẹ"
        description="Cần hồ sơ mẹ trước khi ghi mũi tiêm."
      />
    );
  const [items, editing] = await Promise.all([
    db.motherVaccinationRecord.findMany({ where: { motherId: mother.id }, orderBy: { administeredAt: "desc" }, take: 30 }),
    params.edit ? db.motherVaccinationRecord.findFirst({ where: { id: params.edit, motherId: mother.id } }) : null,
  ]);
  return (
    <>
      <PageHeader title="Mũi tiêm của mẹ" subtitle={mother.name} backHref="/mother" />
      <CollapsibleRecordForm key={`${editing?.id ?? "new"}-${items.length}`} defaultOpen={!!editing} addLabel="Thêm mũi tiêm" closeLabel="Hủy">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <form id="mother-vaccination-form" action={saveMotherVaccinationAction} className="space-y-4">
              <input type="hidden" name="motherId" value={mother.id} />
              {editing && <input type="hidden" name="id" value={editing.id} />}
              <Field name="vaccineName" required label="Tên vắc xin" defaultValue={editing?.vaccineName ?? "Uốn ván (VAT)"} />
              <div className="grid gap-4 min-[430px]:grid-cols-2">
                <Field name="doseNumber" type="number" min="1" label="Mũi số" defaultValue={editing?.doseNumber ?? ""} />
                <Field name="administeredAt" type="date" required label="Ngày tiêm" defaultValue={editing ? toDateInputValue(editing.administeredAt) : toDateInputValue()} />
              </div>
              <Field name="facility" label="Cơ sở tiêm" defaultValue={editing?.facility ?? ""} />
              <TextAreaField name="notes" label="Ghi chú" defaultValue={editing?.notes ?? ""} />
            </form>
          </CardContent>
        </Card>
        <FormActionBar
          formId="mother-vaccination-form"
          saveLabel={editing ? "Cập nhật" : "Lưu mũi tiêm"}
          cancelHref={editing ? "/mother/vaccination" : undefined}
          cancelLabel="Hủy"
          deleteAction={editing ? deleteMotherVaccinationAction : undefined}
          deleteId={editing?.id}
          deleteLabel="Xóa"
        />
      </CollapsibleRecordForm>
      <h2 className="mb-3 mt-7 text-lg font-semibold">Lịch sử tiêm</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
              <Syringe className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">
                {item.vaccineName}
                {item.doseNumber ? ` · mũi ${item.doseNumber}` : ""}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Intl.DateTimeFormat(locale, { day: "2-digit", month: "long", year: "numeric" }).format(item.administeredAt)}
                {item.facility ? ` · ${item.facility}` : ""}
              </p>
            </div>
            <RecordActions
              id={item.id}
              editHref={`/mother/vaccination?edit=${item.id}`}
              deleteAction={deleteMotherVaccinationAction}
              editLabel="Sửa"
              deleteLabel="Xóa"
            />
          </div>
        ))}
        {!items.length && (
          <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            Chưa ghi mũi tiêm nào.
          </p>
        )}
      </div>
    </>
  );
}
