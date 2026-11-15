import { HistoryTimelineItem } from "@/components/history-timeline-item";
import { CollapsibleRecordForm } from "@/components/collapsible-record-form";
import { Field, TextAreaField } from "@/components/form-fields";
import { FormActionBar } from "@/components/form-action-bar";
import { PageHeader } from "@/components/page-header";
import { CareSummary } from "@/components/care-summary";
import { MedicalVisitCard, type MedicalVisitView } from "@/components/medical-visit-card";
import { Card, CardContent } from "@/components/ui/card";
import { toDateInputValue, toDateTimeLocal } from "@/lib/date";
import { asFormAction } from "@/lib/form-action";

type FormAction = (formData: FormData) => Promise<void>;
type SaveAction = (formData: FormData) => Promise<void | { error: string }>;

const dateInput = (date?: Date | null) => date?.toISOString().slice(0, 10) ?? "";

export function MedicalBook({
  title, subtitle, backHref, basePath, ownerField, ownerId, items, editing, saveAction, deleteAction, timeZone,
}: {
  title: string; subtitle: string; backHref: string; basePath: string;
  ownerField: "motherId" | "babyId"; ownerId: string;
  items: MedicalVisitView[]; editing: MedicalVisitView | null;
  saveAction: SaveAction; deleteAction: FormAction; timeZone: string;
}) {
  const today = toDateInputValue(new Date(), timeZone);
  return (
    <>
      <PageHeader compact title={title} subtitle={subtitle} backHref={backHref} />
      {!editing && <CareSummary kind={ownerField === "motherId" ? "motherMedical" : "babyMedical"} title={items.length ? "Lượt khám gần nhất" : "Chưa có lượt khám"}>
        {items[0]
          ? `${new Intl.DateTimeFormat("vi-VN", { timeZone, dateStyle: "short" }).format(items[0].visitedAt)} · ${items[0].facility || items[0].reason || "Đã lưu thông tin khám"}`
          : "Thêm lần khám để lưu kết quả và lời dặn trong cùng một nơi."}
      </CareSummary>}
      <CollapsibleRecordForm prominent editingId={editing?.id} key={`${editing?.id ?? "new"}-${items.length}`} defaultOpen={!!editing} addLabel="Thêm lượt khám" closeLabel="Hủy">
        <Card className="border-0 shadow-sm"><CardContent className="p-5">
          <form id="medical-visit-form" action={asFormAction(saveAction)} className="space-y-4">
            <input type="hidden" name={ownerField} value={ownerId} />
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <Field name="visitedAt" type="datetime-local" required label="Ngày giờ khám" defaultValue={toDateTimeLocal(editing?.visitedAt, timeZone)} />
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
        {items.map((item, index) => <HistoryTimelineItem key={item.id} at={item.visitedAt} timeZone={timeZone} showDate><MedicalVisitCard item={item} timeZone={timeZone} today={today} basePath={basePath} deleteAction={deleteAction} defaultOpen={index === 0} /></HistoryTimelineItem>)}
        {!items.length && <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">Chưa có lượt khám nào.</p>}
      </div>
    </>
  );
}
