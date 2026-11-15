import { ChoiceFields } from "@/components/choice-fields";
import { CollapsibleRecordForm } from "@/components/collapsible-record-form";
import { Field, TextAreaField } from "@/components/form-fields";
import { FormActionBar } from "@/components/form-action-bar";
import { PageHeader } from "@/components/page-header";
import { CareSummary } from "@/components/care-summary";
import { InsuranceWallet } from "@/components/insurance-wallet";
import { Card, CardContent } from "@/components/ui/card";
import { insuranceDateKey, insuranceStatus, insuranceTypeLabels, type InsuranceView } from "@/features/insurance/insurance-status";
import { toDateInputValue } from "@/lib/date";
import { asFormAction } from "@/lib/form-action";

type FormAction = (formData: FormData) => Promise<void>;
type SaveAction = (formData: FormData) => Promise<void | { error: string }>;
const dateInput = (date?: Date | null) => (date ? insuranceDateKey(date) : "");

export function InsuranceBook({ title, subtitle, backHref, basePath, ownerField, ownerId, timeZone, items, editing, saveAction, deleteAction }: {
  title: string; subtitle: string; backHref: string; basePath: string;
  ownerField: "motherId" | "babyId"; ownerId: string; timeZone: string; items: InsuranceView[]; editing: InsuranceView | null;
  saveAction: SaveAction; deleteAction: FormAction;
}) {
  const today = toDateInputValue(new Date(), timeZone);
  const attention = items.filter((item) => ["expiring", "expired"].includes(insuranceStatus(item.validFrom, item.validUntil, today).kind)).length;
  return <>
    <PageHeader compact title={title} subtitle={subtitle} backHref={backHref} />
    {!editing && (!items.length || attention > 0) && <CareSummary kind={ownerField === "motherId" ? "motherInsurance" : "babyInsurance"} title={items.length ? "Cần gia hạn bảo hiểm" : "Chưa có thông tin bảo hiểm"}>
      {items.length ? `${attention} thẻ đã hết hạn hoặc sắp hết hạn, nên gia hạn sớm.` : "Thêm thẻ hoặc hợp đồng để tiện tra cứu khi cần."}
    </CareSummary>}
    {items.length > 0 && <InsuranceWallet items={items} holderName={subtitle} today={today} basePath={basePath} editingId={editing?.id} />}
    <div className={items.length ? "mt-7" : undefined}>
    <CollapsibleRecordForm prominent={!items.length} editingId={editing?.id} key={`${editing?.id ?? "new"}-${items.length}`} defaultOpen={!!editing} addLabel="Thêm bảo hiểm" closeLabel="Hủy">
      <Card className="border-0 shadow-sm"><CardContent className="p-5"><form id="insurance-form" action={asFormAction(saveAction)} className="space-y-4">
        <input type="hidden" name={ownerField} value={ownerId} />{editing && <input type="hidden" name="id" value={editing.id} />}
        <ChoiceFields name="insuranceType" label="Loại bảo hiểm" initialValue={editing?.insuranceType ?? "BHYT"}
          options={Object.entries(insuranceTypeLabels).map(([value, label]) => ({ value, label }))}
          groups={[{ values: ["BHYT"], fields: <Field name="registeredCare" label="Nơi đăng ký khám ban đầu" defaultValue={editing?.registeredCare ?? ""} /> }]}
        >
          <Field name="policyNumber" required label="Mã thẻ / số hợp đồng" autoCapitalize="characters" spellCheck={false} autoComplete="off" defaultValue={editing?.policyNumber ?? ""} />
          <Field name="provider" label="Đơn vị bảo hiểm" defaultValue={editing?.provider ?? ""} />
        </ChoiceFields>
        <div className="grid gap-4 sm:grid-cols-2"><Field name="validFrom" type="date" label="Có hiệu lực từ" defaultValue={dateInput(editing?.validFrom)} /><Field name="validUntil" type="date" label="Có hiệu lực đến" defaultValue={dateInput(editing?.validUntil)} /></div>
        <Field name="contact" label="Hotline / liên hệ" inputMode="tel" defaultValue={editing?.contact ?? ""} />
        <TextAreaField name="benefits" label="Quyền lợi chính" defaultValue={editing?.benefits ?? ""} />
        <TextAreaField name="notes" label="Ghi chú" defaultValue={editing?.notes ?? ""} />
      </form></CardContent></Card>
      <FormActionBar formId="insurance-form" saveAction={saveAction} saveLabel={editing ? "Cập nhật" : "Lưu bảo hiểm"} cancelHref={editing ? basePath : undefined} cancelLabel="Hủy" deleteAction={editing ? deleteAction : undefined} deleteId={editing?.id} deleteLabel="Xóa" />
    </CollapsibleRecordForm>
    </div>
    <p className="mt-4 text-xs leading-5 text-muted-foreground">Chỉ lưu thông tin cần thiết. Không ghi mã OTP, mật khẩu hoặc thông tin thanh toán vào ghi chú.</p>
  </>;
}
