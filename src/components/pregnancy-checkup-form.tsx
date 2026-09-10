"use client";

import { useState } from "react";
import { savePregnancyCheckupAction } from "@/app/actions";
import { Field, TextAreaField } from "@/components/form-fields";
import { OcrScanField } from "@/components/ocr-scan-field";
import { toDateInputValue, toDateTimeLocal } from "@/lib/date";

type CheckupValues = {
  checkedAt: string;
  gestationalWeek: string;
  weightKg: string;
  bloodPressure: string;
  fetalHeartRate: string;
  fundalHeightCm: string;
  facility: string;
  doctor: string;
  findings: string;
  nextCheckupAt: string;
  notes: string;
};

function toDateInput(value: unknown) {
  if (typeof value !== "string" || value.length === 0) return undefined;
  return /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : value;
}

export function PregnancyCheckupForm({
  pregnancyId,
  editing,
  defaultGestationalWeek,
}: {
  pregnancyId: string;
  editing?: {
    id: string;
    checkedAt: Date;
    gestationalWeek: number | null;
    weightKg: number | null;
    bloodPressure: string | null;
    fetalHeartRate: number | null;
    fundalHeightCm: number | null;
    facility: string | null;
    doctor: string | null;
    findings: string | null;
    nextCheckupAt: Date | null;
    notes: string | null;
  } | null;
  defaultGestationalWeek?: number;
}) {
  const [values, setValues] = useState<CheckupValues>({
    checkedAt: editing ? toDateTimeLocal(editing.checkedAt) : toDateTimeLocal(),
    gestationalWeek: editing?.gestationalWeek?.toString() ?? defaultGestationalWeek?.toString() ?? "",
    weightKg: editing?.weightKg?.toString() ?? "",
    bloodPressure: editing?.bloodPressure ?? "",
    fetalHeartRate: editing?.fetalHeartRate?.toString() ?? "",
    fundalHeightCm: editing?.fundalHeightCm?.toString() ?? "",
    facility: editing?.facility ?? "",
    doctor: editing?.doctor ?? "",
    findings: editing?.findings ?? "",
    nextCheckupAt: editing?.nextCheckupAt ? toDateInputValue(editing.nextCheckupAt) : "",
    notes: editing?.notes ?? "",
  });
  const [source, setSource] = useState<"MANUAL" | "OCR">("MANUAL");

  function set<K extends keyof CheckupValues>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  return (
    <form id="checkup-form" action={savePregnancyCheckupAction} className="space-y-4">
      <input type="hidden" name="pregnancyId" value={pregnancyId} />
      <input type="hidden" name="source" value={source} />
      {editing && <input type="hidden" name="id" value={editing.id} />}
      <OcrScanField
        recordType="pregnancyCheckup"
        locale="vi"
        scanLabel="Quét ảnh kết quả khám để tự điền"
        scanningLabel="Đang nhận diện…"
        unavailableLabel="Chưa quét được ảnh này. Vui lòng nhập tay bên dưới."
        onExtract={(data) => {
          setSource("OCR");
          setValues((current) => ({
            checkedAt: current.checkedAt,
            gestationalWeek: typeof data.gestationalWeek === "number" ? String(data.gestationalWeek) : current.gestationalWeek,
            weightKg: typeof data.weightKg === "number" ? String(data.weightKg) : current.weightKg,
            bloodPressure: typeof data.bloodPressure === "string" ? data.bloodPressure : current.bloodPressure,
            fetalHeartRate: typeof data.fetalHeartRate === "number" ? String(data.fetalHeartRate) : current.fetalHeartRate,
            fundalHeightCm: typeof data.fundalHeightCm === "number" ? String(data.fundalHeightCm) : current.fundalHeightCm,
            facility: typeof data.facility === "string" ? data.facility : current.facility,
            doctor: typeof data.doctor === "string" ? data.doctor : current.doctor,
            findings: typeof data.findings === "string" ? data.findings : current.findings,
            nextCheckupAt: toDateInput(data.nextCheckupAt) ?? current.nextCheckupAt,
            notes: typeof data.notes === "string" ? data.notes : current.notes,
          }));
        }}
      />
      <Field
        name="checkedAt"
        type="datetime-local"
        required
        label="Ngày giờ khám"
        value={values.checkedAt}
        onChange={(event) => set("checkedAt", event.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="gestationalWeek"
          type="number"
          min="0"
          max="45"
          label="Tuần thai"
          value={values.gestationalWeek}
          onChange={(event) => set("gestationalWeek", event.target.value)}
        />
        <Field
          name="weightKg"
          type="number"
          min="0"
          step="0.1"
          label="Cân nặng mẹ (kg)"
          value={values.weightKg}
          onChange={(event) => set("weightKg", event.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="bloodPressure"
          label="Huyết áp"
          placeholder="110/70"
          value={values.bloodPressure}
          onChange={(event) => set("bloodPressure", event.target.value)}
        />
        <Field
          name="fetalHeartRate"
          type="number"
          min="0"
          label="Tim thai (lần/phút)"
          value={values.fetalHeartRate}
          onChange={(event) => set("fetalHeartRate", event.target.value)}
        />
      </div>
      <Field
        name="fundalHeightCm"
        type="number"
        min="0"
        step="0.1"
        label="Bề cao tử cung (cm)"
        value={values.fundalHeightCm}
        onChange={(event) => set("fundalHeightCm", event.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="facility"
          label="Cơ sở khám"
          value={values.facility}
          onChange={(event) => set("facility", event.target.value)}
        />
        <Field
          name="doctor"
          label="Bác sĩ"
          value={values.doctor}
          onChange={(event) => set("doctor", event.target.value)}
        />
      </div>
      <TextAreaField
        name="findings"
        label="Kết quả / kết luận"
        value={values.findings}
        onChange={(event) => set("findings", event.target.value)}
      />
      <Field
        name="nextCheckupAt"
        type="date"
        label="Ngày tái khám"
        value={values.nextCheckupAt}
        onChange={(event) => set("nextCheckupAt", event.target.value)}
      />
      <TextAreaField
        name="notes"
        label="Ghi chú"
        value={values.notes}
        onChange={(event) => set("notes", event.target.value)}
      />
    </form>
  );
}
