"use client";

import { useState } from "react";
import { saveVaccinationAction } from "@/app/actions";
import { Field, TextAreaField } from "@/components/form-fields";
import { OcrScanField } from "@/components/ocr-scan-field";
import { toDateInputValue } from "@/lib/date";

type VaccinationValues = {
  vaccineName: string;
  doseNumber: string;
  administeredAt: string;
  facility: string;
  batchNumber: string;
  nextDueAt: string;
  notes: string;
};

function toInputValue(value: unknown) {
  if (typeof value !== "string" || value.length === 0) return undefined;
  return /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : value;
}

export function VaccinationForm({
  babyId,
  editing,
  labels,
  locale,
}: {
  babyId: string;
  editing?: {
    id: string;
    vaccineName: string;
    doseNumber: number | null;
    administeredAt: Date;
    facility: string | null;
    batchNumber: string | null;
    nextDueAt: Date | null;
    notes: string | null;
  } | null;
  labels: {
    vaccineName: string;
    doseNumber: string;
    administeredAt: string;
    facility: string;
    batchNumber: string;
    nextDueAt: string;
    notes: string;
    scanPhoto: string;
    scanning: string;
    ocrUnavailable: string;
  };
  locale: "vi" | "en";
}) {
  const [values, setValues] = useState<VaccinationValues>({
    vaccineName: editing?.vaccineName ?? "",
    doseNumber: editing?.doseNumber?.toString() ?? "",
    administeredAt: editing ? toDateInputValue(editing.administeredAt) : "",
    facility: editing?.facility ?? "",
    batchNumber: editing?.batchNumber ?? "",
    nextDueAt: editing?.nextDueAt ? toDateInputValue(editing.nextDueAt) : "",
    notes: editing?.notes ?? "",
  });
  const [source, setSource] = useState<"MANUAL" | "OCR">("MANUAL");

  function set<K extends keyof VaccinationValues>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  return (
    <form id="vaccination-form" action={saveVaccinationAction} className="space-y-4">
      <input type="hidden" name="babyId" value={babyId} />
      <input type="hidden" name="source" value={source} />
      {editing && <input type="hidden" name="id" value={editing.id} />}
      <OcrScanField
        recordType="vaccination"
        locale={locale}
        scanLabel={labels.scanPhoto}
        scanningLabel={labels.scanning}
        unavailableLabel={labels.ocrUnavailable}
        onExtract={(data) => {
          setSource("OCR");
          setValues((current) => ({
            vaccineName: typeof data.vaccineName === "string" ? data.vaccineName : current.vaccineName,
            doseNumber: typeof data.doseNumber === "number" ? String(data.doseNumber) : current.doseNumber,
            administeredAt: toInputValue(data.administeredAt) ?? current.administeredAt,
            facility: typeof data.facility === "string" ? data.facility : current.facility,
            batchNumber: typeof data.batchNumber === "string" ? data.batchNumber : current.batchNumber,
            nextDueAt: toInputValue(data.nextDueAt) ?? current.nextDueAt,
            notes: typeof data.notes === "string" ? data.notes : current.notes,
          }));
        }}
      />
      <Field
        name="vaccineName"
        required
        label={labels.vaccineName}
        value={values.vaccineName}
        onChange={(event) => set("vaccineName", event.target.value)}
      />
      <div className="grid min-w-0 gap-4 min-[430px]:grid-cols-2">
        <Field
          name="doseNumber"
          type="number"
          min="1"
          inputMode="numeric"
          label={labels.doseNumber}
          value={values.doseNumber}
          onChange={(event) => set("doseNumber", event.target.value)}
        />
        <Field
          name="administeredAt"
          type="date"
          required
          label={labels.administeredAt}
          value={values.administeredAt}
          onChange={(event) => set("administeredAt", event.target.value)}
        />
      </div>
      <Field
        name="facility"
        label={labels.facility}
        value={values.facility}
        onChange={(event) => set("facility", event.target.value)}
      />
      <div className="grid min-w-0 gap-4 min-[430px]:grid-cols-2">
        <Field
          name="batchNumber"
          label={labels.batchNumber}
          value={values.batchNumber}
          onChange={(event) => set("batchNumber", event.target.value)}
        />
        <Field
          name="nextDueAt"
          type="date"
          label={labels.nextDueAt}
          value={values.nextDueAt}
          onChange={(event) => set("nextDueAt", event.target.value)}
        />
      </div>
      <TextAreaField
        name="notes"
        label={labels.notes}
        value={values.notes}
        onChange={(event) => set("notes", event.target.value)}
      />
    </form>
  );
}
