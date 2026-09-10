import { CalendarClock, ShieldCheck } from "lucide-react";
import { CollapsibleRecordForm } from "@/components/collapsible-record-form";
import { Field, SelectField, TextAreaField } from "@/components/form-fields";
import { FormActionBar } from "@/components/form-action-bar";
import { PageHeader } from "@/components/page-header";
import { RecordActions } from "@/components/record-actions";
import { Card, CardContent } from "@/components/ui/card";

type FormAction = (formData: FormData) => Promise<void>;
type InsuranceView = {
  id: string;
  insuranceType: string;
  provider: string | null;
  policyNumber: string;
  registeredCare: string | null;
  validFrom: Date | null;
  validUntil: Date | null;
  contact: string | null;
  benefits: string | null;
  notes: string | null;
};
const dateInput = (date?: Date | null) => date?.toISOString().slice(0, 10) ?? "";
const typeLabels: Record<string, string> = { BHYT: "Bảo hiểm y tế", PRIVATE: "Bảo hiểm tư nhân", OTHER: "Bảo hiểm khác" };

export function InsuranceBook({ title, subtitle, backHref, basePath, ownerField, ownerId, items, editing, saveAction, deleteAction, locale }: {
  title: string; subtitle: string; backHref: string; basePath: string;
  ownerField: "motherId" | "babyId"; ownerId: string; items: InsuranceView[]; editing: InsuranceView | null;
  saveAction: FormAction; deleteAction: FormAction; locale: string;
}) {
  return <>
    <PageHeader title={title} subtitle={subtitle} backHref={backHref} />
    <CollapsibleRecordForm key={`${editing?.id ?? "new"}-${items.length}`} defaultOpen={!!editing} addLabel="Thêm bảo hiểm" closeLabel="Hủy">
      <Card className="border-0 shadow-sm"><CardContent className="p-5"><form id="insurance-form" action={saveAction} className="space-y-4">
        <input type="hidden" name={ownerField} value={ownerId} />{editing && <input type="hidden" name="id" value={editing.id} />}
        <SelectField name="insuranceType" required label="Loại bảo hiểm" defaultValue={editing?.insuranceType ?? "BHYT"}><option value="BHYT">Bảo hiểm y tế</option><option value="PRIVATE">Bảo hiểm tư nhân</option><option value="OTHER">Khác</option></SelectField>
        <Field name="policyNumber" required label="Mã thẻ / số hợp đồng" defaultValue={editing?.policyNumber ?? ""} />
        <Field name="provider" label="Đơn vị bảo hiểm" defaultValue={editing?.provider ?? ""} />
        <Field name="registeredCare" label="Nơi đăng ký khám ban đầu" defaultValue={editing?.registeredCare ?? ""} />
        <div className="grid gap-4 min-[430px]:grid-cols-2"><Field name="validFrom" type="date" label="Có hiệu lực từ" defaultValue={dateInput(editing?.validFrom)} /><Field name="validUntil" type="date" label="Có hiệu lực đến" defaultValue={dateInput(editing?.validUntil)} /></div>
        <Field name="contact" label="Hotline / liên hệ" defaultValue={editing?.contact ?? ""} />
        <TextAreaField name="benefits" label="Quyền lợi chính" defaultValue={editing?.benefits ?? ""} />
        <TextAreaField name="notes" label="Ghi chú" defaultValue={editing?.notes ?? ""} />
      </form></CardContent></Card>
      <FormActionBar formId="insurance-form" saveLabel={editing ? "Cập nhật" : "Lưu bảo hiểm"} cancelHref={editing ? basePath : undefined} cancelLabel="Hủy" deleteAction={editing ? deleteAction : undefined} deleteId={editing?.id} deleteLabel="Xóa" />
    </CollapsibleRecordForm>
    <h2 className="mb-3 mt-7 text-lg font-semibold">Thẻ và hợp đồng</h2>
    <div className="space-y-2">{items.map((item) => {
      const expired = item.validUntil ? item.validUntil.getTime() < new Date().setHours(0, 0, 0, 0) : false;
      return <div key={item.id} className="flex items-start gap-3 rounded-2xl bg-card p-3 shadow-sm"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><ShieldCheck className="size-5" /></span><div className="min-w-0 flex-1"><p className="font-medium">{typeLabels[item.insuranceType] ?? item.insuranceType}</p><p className="truncate text-xs text-muted-foreground">{item.policyNumber}{item.provider ? ` · ${item.provider}` : ""}</p>{item.validUntil && <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${expired ? "text-destructive" : "text-primary"}`}><CalendarClock className="size-3" />{expired ? "Đã hết hạn" : "Hạn đến"} {new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(item.validUntil)}</p>}</div><RecordActions id={item.id} editHref={`${basePath}?edit=${item.id}`} deleteAction={deleteAction} editLabel="Sửa" deleteLabel="Xóa" /></div>;
    })}{!items.length && <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">Chưa có thông tin bảo hiểm.</p>}</div>
    <p className="mt-4 text-xs leading-5 text-muted-foreground">Chỉ lưu thông tin cần thiết. Không ghi mã OTP, mật khẩu hoặc thông tin thanh toán vào ghi chú.</p>
  </>;
}

