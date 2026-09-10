import { CalendarClock, Stethoscope } from "lucide-react";
import { CollapsibleRecordForm } from "@/components/collapsible-record-form";
import { Field, TextAreaField } from "@/components/form-fields";
import { FormActionBar } from "@/components/form-action-bar";
import { PageHeader } from "@/components/page-header";
import { RecordActions } from "@/components/record-actions";
import { Card, CardContent } from "@/components/ui/card";
import { toDateTimeLocal } from "@/lib/date";

type FormAction = (formData: FormData) => Promise<void>;
type MedicalVisitView = {
  id: string;
  visitedAt: Date;
  facility: string | null;
  doctor: string | null;
  specialty: string | null;
  reason: string | null;
  diagnosis: string | null;
  treatment: string | null;
  nextVisitAt: Date | null;
  notes: string | null;
};

const dateInput = (date?: Date | null) => date?.toISOString().slice(0, 10) ?? "";

export function MedicalBook({
  title, subtitle, backHref, basePath, ownerField, ownerId, items, editing, saveAction, deleteAction, locale,
}: {
  title: string; subtitle: string; backHref: string; basePath: string;
  ownerField: "motherId" | "babyId"; ownerId: string;
  items: MedicalVisitView[]; editing: MedicalVisitView | null;
  saveAction: FormAction; deleteAction: FormAction; locale: string;
}) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} backHref={backHref} />
      <CollapsibleRecordForm key={`${editing?.id ?? "new"}-${items.length}`} defaultOpen={!!editing} addLabel="Thêm lượt khám" closeLabel="Hủy">
        <Card className="border-0 shadow-sm"><CardContent className="p-5">
          <form id="medical-visit-form" action={saveAction} className="space-y-4">
            <input type="hidden" name={ownerField} value={ownerId} />
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <Field name="visitedAt" type="datetime-local" required label="Ngày giờ khám" defaultValue={toDateTimeLocal(editing?.visitedAt)} />
            <div className="grid gap-4 sm:grid-cols-2"><Field name="facility" label="Cơ sở khám" defaultValue={editing?.facility ?? ""} /><Field name="doctor" label="Bác sĩ" defaultValue={editing?.doctor ?? ""} /></div>
            <Field name="specialty" label="Chuyên khoa" placeholder="Sản, nhi, da liễu..." defaultValue={editing?.specialty ?? ""} />
            <TextAreaField name="reason" label="Lý do khám / triệu chứng" defaultValue={editing?.reason ?? ""} />
            <TextAreaField name="diagnosis" label="Chẩn đoán / kết luận" defaultValue={editing?.diagnosis ?? ""} />
            <TextAreaField name="treatment" label="Điều trị / lời dặn" defaultValue={editing?.treatment ?? ""} />
            <Field name="nextVisitAt" type="date" label="Ngày tái khám" defaultValue={dateInput(editing?.nextVisitAt)} />
            <TextAreaField name="notes" label="Ghi chú thêm" defaultValue={editing?.notes ?? ""} />
          </form>
        </CardContent></Card>
        <FormActionBar formId="medical-visit-form" saveAction={saveAction} saveLabel={editing ? "Cập nhật" : "Lưu lượt khám"} cancelHref={editing ? basePath : undefined} cancelLabel="Hủy" deleteAction={editing ? deleteAction : undefined} deleteId={editing?.id} deleteLabel="Xóa" />
      </CollapsibleRecordForm>
      <h2 className="mb-3 mt-7 text-lg font-semibold">Lịch sử khám bệnh</h2>
      <div className="space-y-2">
        {items.map((item) => <div key={item.id} className="flex items-start gap-3 rounded-2xl bg-card p-3 shadow-sm"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"><Stethoscope className="size-5" /></span><div className="min-w-0 flex-1"><p className="font-medium">{item.diagnosis || item.reason || "Lượt khám"}</p><p className="text-xs text-muted-foreground">{new Intl.DateTimeFormat(locale, { day: "2-digit", month: "long", year: "numeric" }).format(item.visitedAt)}{item.facility ? ` · ${item.facility}` : ""}</p>{item.treatment && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.treatment}</p>}{item.nextVisitAt && <p className="mt-1 flex items-center gap-1 text-xs font-medium text-primary"><CalendarClock className="size-3" />Tái khám {new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(item.nextVisitAt)}</p>}</div><RecordActions id={item.id} editHref={`${basePath}?edit=${item.id}`} deleteAction={deleteAction} editLabel="Sửa" deleteLabel="Xóa" /></div>)}
        {!items.length && <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">Chưa có lượt khám nào.</p>}
      </div>
    </>
  );
}
