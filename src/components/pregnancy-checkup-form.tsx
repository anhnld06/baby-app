"use client";

import type { ReactNode } from "react";
import type { PregnancyCheckup } from "@prisma/client";
import { CHECKUP_EXTRA_FIELDS, type CheckupExtraName } from "@/features/mother/checkup-fields";
import { explicitPrenatalFollowupDate, withPrenatalFollowupDate } from "@/features/reminders/prenatal";
import { pregnancyAge } from "@/features/mother/pregnancy";
import { dueDateFromGestationalAge } from "@/features/mother/due-date";
import { useState } from "react";
import { savePregnancyCheckupAction } from "@/app/actions";
import { Field, SelectField, TextAreaField } from "@/components/form-fields";
import { OcrScanField } from "@/components/ocr-scan-field";
import { formatDateInputDisplay, toDateInputValue, toDateTimeLocal } from "@/lib/date";

type VisitType = "PRENATAL_VISIT" | "ULTRASOUND" | "COMBINED";
type FetalMovement = "" | "PRESENT" | "ABSENT";

type CheckupValues = Record<CheckupExtraName, string> & {
  checkedAtTimeKnown: boolean;
  visitType: VisitType;
  checkedAt: string;
  gestationalWeek: string;
  gestationalDay: string;
  weightKg: string;
  bloodPressure: string;
  fetusCount: string;
  fetalPresentation: string;
  fetalMovement: FetalMovement;
  fetalHeartRate: string;
  crlMm: string;
  ntMm: string;
  bpdMm: string;
  hcMm: string;
  acMm: string;
  flMm: string;
  estimatedFetalWeightG: string;
  placentaPosition: string;
  placentaGrade: string;
  amnioticFluid: string;
  cervicalLengthMm: string;
  ultrasoundDueDate: string;
  fetalAnatomy: string;
  otherFindings: string;
  facility: string;
  doctor: string;
  findings: string;
};

type EditingCheckup = PregnancyCheckup;

function toDateInput(value: unknown) {
  if (typeof value !== "string" || value.length === 0) return undefined;
  return /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : value;
}

function toRecognizedDateTime(value: unknown, current: string) {
  const date = toDateInput(value);
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return current;
  const currentTime = /^\d{4}-\d{2}-\d{2}T(\d{2}:\d{2})/.exec(current)?.[1] ?? "09:00";
  return `${date}T${currentTime}`;
}

function numberValue(value: unknown, current: string) {
  return typeof value === "number" && Number.isFinite(value) ? String(value) : current;
}

function textValue(value: unknown, current: string) {
  return typeof value === "string" && value.trim() ? value : current;
}

function FormSection({ title, description, children, active = true }: { title: string; description?: string; children: ReactNode; active?: boolean }) {
  return (
    <fieldset hidden={!active} className="min-w-0 space-y-4 rounded-2xl border bg-card/40 p-4">
      <legend className="px-2 text-sm font-semibold">{title}</legend>
      {description && <p className="text-xs leading-5 text-muted-foreground">{description}</p>}
      {children}
    </fieldset>
  );
}

export function PregnancyCheckupForm({ pregnancyId, editing, estimatedDueDate, lastMenstrualPeriod, active, timeZone }: {
  pregnancyId: string;
  editing?: EditingCheckup | null;
  estimatedDueDate?: string;
  lastMenstrualPeriod?: string;
  active?: boolean;
  timeZone: string;
}) {
  function ageOn(date: string) {
    return pregnancyAge({ pregnancyStatus: active ? "PREGNANT" : "ENDED", estimatedDueDate: estimatedDueDate ? new Date(estimatedDueDate) : null, lastMenstrualPeriod: lastMenstrualPeriod ? new Date(lastMenstrualPeriod) : null }, new Date(`${date.slice(0, 10)}T12:00:00Z`), "UTC");
  }
  const initialAge = ageOn(toDateTimeLocal(new Date(), timeZone));
  const [values, setValues] = useState<CheckupValues>({
    ...Object.fromEntries(CHECKUP_EXTRA_FIELDS.map(({name}) => [name, editing?.[name]?.toString() ?? ""])) as Record<CheckupExtraName, string>,
    checkedAtTimeKnown: editing?.checkedAtTimeKnown ?? false,
    visitType: editing?.visitType ?? "COMBINED",
    checkedAt: editing ? (editing.checkedAtTimeKnown ? toDateTimeLocal(editing.checkedAt, timeZone) : editing.checkedAt.toISOString().slice(0, 10)) : toDateTimeLocal(new Date(), timeZone).slice(0, 10),
    gestationalWeek: editing?.gestationalWeek?.toString() ?? initialAge?.weeks.toString() ?? "",
    gestationalDay: editing?.gestationalDay?.toString() ?? initialAge?.days.toString() ?? "",
    weightKg: editing?.weightKg?.toString() ?? "",
    bloodPressure: editing?.bloodPressure ?? "",
    fetusCount: editing?.fetusCount?.toString() ?? "",
    fetalPresentation: editing?.fetalPresentation ?? "",
    fetalMovement: editing?.fetalMovement ?? "",
    fetalHeartRate: editing?.fetalHeartRate?.toString() ?? "",
    crlMm: editing?.crlMm?.toString() ?? "",
    ntMm: editing?.ntMm?.toString() ?? "",
    bpdMm: editing?.bpdMm?.toString() ?? "",
    hcMm: editing?.hcMm?.toString() ?? "",
    acMm: editing?.acMm?.toString() ?? "",
    flMm: editing?.flMm?.toString() ?? "",
    estimatedFetalWeightG: editing?.estimatedFetalWeightG?.toString() ?? "",
    placentaPosition: editing?.placentaPosition ?? "",
    placentaGrade: editing?.placentaGrade?.toString() ?? "",
    amnioticFluid: editing?.amnioticFluid ?? "",
    cervicalLengthMm: editing?.cervicalLengthMm?.toString() ?? "",
    ultrasoundDueDate: editing?.ultrasoundDueDate ? toDateInputValue(editing.ultrasoundDueDate) : "",
    fetalAnatomy: editing?.fetalAnatomy ?? "",
    otherFindings: editing?.otherFindings ?? "",
    facility: editing?.facility ?? "",
    doctor: editing?.doctor ?? "",
    findings: editing?.findings ?? "",
  });
  const [source, setSource] = useState<"MANUAL" | "OCR">(editing?.source ?? "MANUAL");
  const calculatedDueDate = dueDateFromGestationalAge(
    values.checkedAt,
    values.gestationalWeek === "" ? undefined : Number(values.gestationalWeek),
    values.gestationalDay === "" ? undefined : Number(values.gestationalDay),
  );

  function set<K extends keyof CheckupValues>(key: K, value: CheckupValues[K]) {
    setValues((current) => {
      const age = key === "checkedAt" && !editing ? ageOn(String(value)) : undefined;
      return { ...current, [key]: value, ...(key === "checkedAt" && !editing ? { gestationalWeek: age?.weeks.toString() ?? "", gestationalDay: age?.days.toString() ?? "" } : {}) };
    });
  }

  function extraInputs(group: "maternal" | "ultrasound" | "followup") {
    return <div className="grid gap-4 sm:grid-cols-2">{CHECKUP_EXTRA_FIELDS.filter((f) => f.group === group).map((field) => {
      const shared = { name: field.name, label: field.label, value: values[field.name], onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(field.name, event.target.value) };
      if (field.kind === "presence") return <SelectField key={field.name} {...shared}><option value="">Chưa ghi nhận</option><option value="PRESENT">Có (+)</option><option value="ABSENT">Không (-)</option></SelectField>;
      if (field.kind === "textarea") return <div key={field.name} className="sm:col-span-2"><TextAreaField {...shared} placeholder={field.name === "followupInstruction" ? "Sau 1 tuần, khi thai 38 tuần hoặc Ngày tái khám: 25/11/2026" : undefined} /></div>;
      return <Field key={field.name} {...shared} type={field.kind === "number" ? "number" : "text"} min={field.kind === "number" ? 0 : undefined} step={field.kind === "number" ? "any" : undefined} />;
    })}</div>;
  }

  return (
    <form id="checkup-form" action={savePregnancyCheckupAction} className="space-y-5">
      <input type="hidden" name="pregnancyId" value={pregnancyId} />
      <input type="hidden" name="source" value={source} />
      {editing && <input type="hidden" name="id" value={editing.id} />}

      <FormSection title="Quét phiếu khám hoặc siêu âm" description="Ảnh chỉ dùng để tự điền. Luôn đối chiếu lại với phiếu do cơ sở y tế cung cấp trước khi lưu.">
        <OcrScanField
          recordType="pregnancyCheckup"
          locale="vi"
          scanLabel="Chọn ảnh phiếu để tự điền"
          scanningLabel="Đang nhận diện…"
          unavailableLabel="Chưa đọc được ảnh này. Vui lòng chụp thẳng phiếu, tránh lóa hoặc nhập tay."
          onExtract={(data) => {
            setSource("OCR");
            setValues((current) => ({
              ...current,
              visitType: data.visitType === "ULTRASOUND" ? "ULTRASOUND" : current.visitType,
              checkedAt: current.checkedAtTimeKnown ? toRecognizedDateTime(data.checkedAt, current.checkedAt) : toDateInput(data.checkedAt) ?? current.checkedAt,
              gestationalWeek: numberValue(data.gestationalWeek, current.gestationalWeek),
              gestationalDay: numberValue(data.gestationalDay, current.gestationalDay),
              weightKg: numberValue(data.weightKg, current.weightKg),
              bloodPressure: textValue(data.bloodPressure, current.bloodPressure),
              fetusCount: numberValue(data.fetusCount, current.fetusCount),
              fetalPresentation: textValue(data.fetalPresentation, current.fetalPresentation),
              fetalMovement: data.fetalMovement === "PRESENT" || data.fetalMovement === "ABSENT" ? data.fetalMovement : current.fetalMovement,
              fetalHeartRate: numberValue(data.fetalHeartRate, current.fetalHeartRate),
              crlMm: numberValue(data.crlMm, current.crlMm),
              ntMm: numberValue(data.ntMm, current.ntMm),
              bpdMm: numberValue(data.bpdMm, current.bpdMm),
              hcMm: numberValue(data.hcMm, current.hcMm),
              acMm: numberValue(data.acMm, current.acMm),
              flMm: numberValue(data.flMm, current.flMm),
              estimatedFetalWeightG: numberValue(data.estimatedFetalWeightG, current.estimatedFetalWeightG),
              placentaPosition: textValue(data.placentaPosition, current.placentaPosition),
              placentaGrade: numberValue(data.placentaGrade, current.placentaGrade),
              amnioticFluid: textValue(data.amnioticFluid, current.amnioticFluid),
              cervicalLengthMm: numberValue(data.cervicalLengthMm, current.cervicalLengthMm),
              ultrasoundDueDate: toDateInput(data.ultrasoundDueDate) ?? current.ultrasoundDueDate,
              fetalAnatomy: textValue(data.fetalAnatomy, current.fetalAnatomy),
              otherFindings: textValue(data.otherFindings, current.otherFindings),
              facility: textValue(data.facility, current.facility),
              doctor: textValue(data.doctor, current.doctor),
              findings: textValue(data.findings, current.findings),
            }));
          }}
        />
      </FormSection>

      <FormSection title="Thông tin lần khám">
        <SelectField name="visitType" label="Loại ghi nhận" value={values.visitType} onChange={(event) => set("visitType", event.target.value as VisitType)}>
          <option value="COMBINED">Khám thai và siêu âm</option>
          <option value="ULTRASOUND">Siêu âm</option>
          <option value="PRENATAL_VISIT">Khám thai</option>
        </SelectField>
        <input type="hidden" name="checkedAtTimeKnown" value={String(values.checkedAtTimeKnown)} />
        <Field name="checkedAt" type={values.checkedAtTimeKnown ? "datetime-local" : "date"} required label={values.checkedAtTimeKnown ? "Ngày giờ thực hiện" : "Ngày thực hiện"} value={values.checkedAt} onChange={(event) => set("checkedAt", event.target.value)} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={values.checkedAtTimeKnown} onChange={(event) => { const known = event.target.checked; setValues((current) => ({ ...current, checkedAtTimeKnown: known, checkedAt: known ? `${current.checkedAt.slice(0, 10)}T00:00` : current.checkedAt.slice(0, 10) })); }} />Phiếu có ghi giờ thực hiện</label>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="facility" label="Cơ sở thực hiện" value={values.facility} onChange={(event) => set("facility", event.target.value)} />
          <Field name="doctor" label="Bác sĩ" value={values.doctor} onChange={(event) => set("doctor", event.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="gestationalWeek" type="number" min="0" max="45" label="Tuổi thai (tuần)" value={values.gestationalWeek} onChange={(event) => set("gestationalWeek", event.target.value)} />
          <Field name="gestationalDay" type="number" min="0" max="6" label="Ngày lẻ" value={values.gestationalDay} onChange={(event) => set("gestationalDay", event.target.value)} />
        </div>
        <Field name="calculatedDueDate" label="Ngày dự sinh ước tính (tự tính)" readOnly value={calculatedDueDate ? formatDateInputDisplay(calculatedDueDate) : ""} placeholder="Nhập ngày khám và tuổi thai để tự tính" />
      </FormSection>

      <FormSection title="Khám mẹ" active={values.visitType !== "ULTRASOUND"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="weightKg" type="number" min="0" step="0.1" label="Cân nặng mẹ (kg)" value={values.weightKg} onChange={(event) => set("weightKg", event.target.value)} />
          <Field name="bloodPressure" inputMode="numeric" label="Huyết áp (mmHg)" placeholder="110/70" value={values.bloodPressure} onChange={(event) => set("bloodPressure", event.target.value)} />
        </div>
        <details open={CHECKUP_EXTRA_FIELDS.some((f) => f.group === "maternal" && values[f.name])} className="space-y-4">
          <summary className="cursor-pointer text-sm font-medium">Chỉ số khám bổ sung</summary>
          {extraInputs("maternal")}
        </details>
      </FormSection>

      <FormSection title="Tình trạng thai" description="Ghi theo đúng nội dung trên phiếu; không tự suy diễn khi phiếu không đề cập.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="fetusCount" type="number" min="1" max="10" label="Số lượng thai" placeholder="1" value={values.fetusCount} onChange={(event) => set("fetusCount", event.target.value)} />
          <Field name="fetalPresentation" label="Ngôi thai / tư thế" placeholder="Dao động, ngôi đầu…" value={values.fetalPresentation} onChange={(event) => set("fetalPresentation", event.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField name="fetalMovement" label="Cử động thai" value={values.fetalMovement} onChange={(event) => set("fetalMovement", event.target.value as FetalMovement)}>
            <option value="">Chưa ghi nhận</option>
            <option value="PRESENT">Có (+)</option>
            <option value="ABSENT">Không (-)</option>
          </SelectField>
          <Field name="fetalHeartRate" type="number" min="0" max="300" label={values.visitType === "PRENATAL_VISIT" ? "Tim thai (lần/phút)" : "Tim thai trên phiếu siêu âm (lần/phút)"} value={values.fetalHeartRate} onChange={(event) => set("fetalHeartRate", event.target.value)} />
        </div>
        <fieldset hidden={values.visitType === "PRENATAL_VISIT"} >
          <details open={Boolean(values.ultrasoundDueDate)} className="space-y-4">
            <summary className="cursor-pointer text-sm font-medium">Ngày dự sinh bác sĩ ghi trên phiếu</summary>
            <Field name="ultrasoundDueDate" type="date" label="Ngày dự sinh ghi trên phiếu siêu âm (nếu có)" value={values.ultrasoundDueDate} onChange={(event) => set("ultrasoundDueDate", event.target.value)} />
          </details>
        </fieldset>
      </FormSection>

      <FormSection title="Sinh trắc học thai" active={values.visitType !== "PRENATAL_VISIT"} description="CRL thường dùng ở giai đoạn sớm; BPD, HC, AC và FL thường xuất hiện ở các lần siêu âm sau.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="crlMm" type="number" min="0" step="0.1" label="CRL – đầu mông (mm)" value={values.crlMm} onChange={(event) => set("crlMm", event.target.value)} />
          <Field name="ntMm" type="number" min="0" step="0.1" label="NT – độ mờ da gáy (mm)" value={values.ntMm} onChange={(event) => set("ntMm", event.target.value)} />
          <Field name="bpdMm" type="number" min="0" step="0.1" label="BPD – lưỡng đỉnh (mm)" value={values.bpdMm} onChange={(event) => set("bpdMm", event.target.value)} />
          <Field name="hcMm" type="number" min="0" step="0.1" label="HC – vòng đầu (mm)" value={values.hcMm} onChange={(event) => set("hcMm", event.target.value)} />
          <Field name="acMm" type="number" min="0" step="0.1" label="AC – vòng bụng (mm)" value={values.acMm} onChange={(event) => set("acMm", event.target.value)} />
          <Field name="flMm" type="number" min="0" step="0.1" label="FL – xương đùi (mm)" value={values.flMm} onChange={(event) => set("flMm", event.target.value)} />
        </div>
        <Field name="estimatedFetalWeightG" type="number" min="0" step="1" label="Trọng lượng thai ước tính (g)" value={values.estimatedFetalWeightG} onChange={(event) => set("estimatedFetalWeightG", event.target.value)} />
      </FormSection>

      <FormSection title="Nhau thai, nước ối và cổ tử cung" active={values.visitType !== "PRENATAL_VISIT"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="placentaPosition" label="Vị trí nhau bám" placeholder="Đáy thân mặt trước…" value={values.placentaPosition} onChange={(event) => set("placentaPosition", event.target.value)} />
          <Field name="placentaGrade" type="number" min="0" max="3" label="Độ trưởng thành nhau (0–3)" value={values.placentaGrade} onChange={(event) => set("placentaGrade", event.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="amnioticFluid" label="Nước ối" placeholder="Bình thường…" value={values.amnioticFluid} onChange={(event) => set("amnioticFluid", event.target.value)} />
          <Field name="cervicalLengthMm" type="number" min="0" step="0.1" label="Chiều dài cổ tử cung (mm)" value={values.cervicalLengthMm} onChange={(event) => set("cervicalLengthMm", event.target.value)} />
        </div>
      </FormSection>

      <FormSection title="Chỉ số siêu âm bổ sung" active={values.visitType !== "PRENATAL_VISIT"}>
        <details open={CHECKUP_EXTRA_FIELDS.some((f) => f.group === "ultrasound" && values[f.name])} className="space-y-4">
          <summary className="cursor-pointer text-sm font-medium">AFI, Doppler, bách phân vị và rốn quấn cổ</summary>
          {extraInputs("ultrasound")}
        </details>
      </FormSection>

      <FormSection title="Khảo sát và kết luận">
        <fieldset hidden={values.visitType === "PRENATAL_VISIT"} >
        <TextAreaField name="fetalAnatomy" label="Khảo sát hình thái thai" placeholder="Não, đầu mặt, tim, cột sống, tứ chi…" value={values.fetalAnatomy} onChange={(event) => set("fetalAnatomy", event.target.value)} />
        </fieldset>
        <TextAreaField name="otherFindings" label="Khảo sát khác" placeholder="Tử cung, phần phụ, dịch túi cùng hoặc ghi nhận khác…" value={values.otherFindings} onChange={(event) => set("otherFindings", event.target.value)} />
        <TextAreaField name="findings" label="Kết luận trên phiếu" value={values.findings} onChange={(event) => set("findings", event.target.value)} />
      </FormSection>

      <FormSection title="Điều trị và theo dõi">
        <Field name="followupDatePicker" type="date" label="Ngày hẹn tái khám cụ thể (nếu có)" value={explicitPrenatalFollowupDate(values.followupInstruction)?.toISOString().slice(0, 10) ?? ""} onChange={(event) => set("followupInstruction", withPrenatalFollowupDate(values.followupInstruction, event.target.value))} />
        <p className="text-xs leading-5 text-muted-foreground">Ngày được chọn sẽ được lưu cùng lời hẹn để tạo lịch nhắc. Lời hẹn theo khoảng thời gian vẫn được giữ nguyên.</p>
        {extraInputs("followup")}
      </FormSection>
    </form>
  );
}
