"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { savePrescriptionAction } from "@/app/actions";
import { Field, TextAreaField } from "@/components/form-fields";
import { OcrScanField } from "@/components/ocr-scan-field";
import { Button } from "@/components/ui/button";
import { toDateInputValue } from "@/lib/date";

type ItemValues = {
  medicineName: string;
  dosage: string;
  frequency: string;
  durationDays: string;
  instructions: string;
};

const emptyItem: ItemValues = { medicineName: "", dosage: "", frequency: "", durationDays: "", instructions: "" };

function toInputValue(value: unknown) {
  if (typeof value !== "string" || value.length === 0) return undefined;
  return /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : value;
}

function parseOcrItems(value: unknown): ItemValues[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => ({
      medicineName: typeof item.medicineName === "string" ? item.medicineName : "",
      dosage: typeof item.dosage === "string" ? item.dosage : "",
      frequency: typeof item.frequency === "string" ? item.frequency : "",
      durationDays: typeof item.durationDays === "number" ? String(item.durationDays) : "",
      instructions: typeof item.instructions === "string" ? item.instructions : "",
    }))
    .filter((item) => item.medicineName.length > 0);
}

export function PrescriptionForm({
  babyId,
  editing,
  labels,
  locale,
}: {
  babyId: string;
  editing?: {
    id: string;
    prescribedBy: string | null;
    diagnosis: string | null;
    issuedAt: Date;
    notes: string | null;
    items: { medicineName: string; dosage: string | null; frequency: string | null; durationDays: number | null; instructions: string | null }[];
  } | null;
  labels: {
    prescribedBy: string;
    diagnosis: string;
    issuedAt: string;
    notes: string;
    medicineName: string;
    dosage: string;
    frequency: string;
    durationDays: string;
    instructions: string;
    addMedicine: string;
    removeMedicine: string;
    scanPhoto: string;
    scanning: string;
    ocrUnavailable: string;
  };
  locale: "vi" | "en";
}) {
  const [prescribedBy, setPrescribedBy] = useState(editing?.prescribedBy ?? "");
  const [diagnosis, setDiagnosis] = useState(editing?.diagnosis ?? "");
  const [issuedAt, setIssuedAt] = useState(editing ? toDateInputValue(editing.issuedAt) : "");
  const [notes, setNotes] = useState(editing?.notes ?? "");
  const [items, setItems] = useState<ItemValues[]>(
    editing && editing.items.length > 0
      ? editing.items.map((item) => ({
          medicineName: item.medicineName,
          dosage: item.dosage ?? "",
          frequency: item.frequency ?? "",
          durationDays: item.durationDays?.toString() ?? "",
          instructions: item.instructions ?? "",
        }))
      : [emptyItem],
  );
  const [source, setSource] = useState<"MANUAL" | "OCR">("MANUAL");

  function setItem(index: number, key: keyof ItemValues, value: string) {
    setItems((current) => current.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }

  return (
    <form id="prescription-form" action={savePrescriptionAction} className="space-y-4">
      <input type="hidden" name="babyId" value={babyId} />
      <input type="hidden" name="source" value={source} />
      {editing && <input type="hidden" name="id" value={editing.id} />}
      <OcrScanField
        recordType="prescription"
        locale={locale}
        scanLabel={labels.scanPhoto}
        scanningLabel={labels.scanning}
        unavailableLabel={labels.ocrUnavailable}
        onExtract={(data) => {
          setSource("OCR");
          if (typeof data.prescribedBy === "string") setPrescribedBy(data.prescribedBy);
          if (typeof data.diagnosis === "string") setDiagnosis(data.diagnosis);
          const nextIssuedAt = toInputValue(data.issuedAt);
          if (nextIssuedAt) setIssuedAt(nextIssuedAt);
          if (typeof data.notes === "string") setNotes(data.notes);
          const extractedItems = parseOcrItems(data.items);
          if (extractedItems.length > 0) setItems(extractedItems);
        }}
      />
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        <Field
          name="prescribedBy"
          label={labels.prescribedBy}
          value={prescribedBy}
          onChange={(event) => setPrescribedBy(event.target.value)}
        />
        <Field
          name="issuedAt"
          type="date"
          required
          label={labels.issuedAt}
          value={issuedAt}
          onChange={(event) => setIssuedAt(event.target.value)}
        />
      </div>
      <Field
        name="diagnosis"
        label={labels.diagnosis}
        value={diagnosis}
        onChange={(event) => setDiagnosis(event.target.value)}
      />
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="space-y-3 rounded-2xl border border-border/70 p-4">
            <div className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <Field
                  name={`items.${index}.medicineName`}
                  required
                  label={labels.medicineName}
                  value={item.medicineName}
                  onChange={(event) => setItem(index, "medicineName", event.target.value)}
                />
              </div>
              {items.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0 text-destructive"
                  aria-label={labels.removeMedicine}
                  onClick={() => setItems((current) => current.filter((_, i) => i !== index))}
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              <Field
                name={`items.${index}.dosage`}
                label={labels.dosage}
                value={item.dosage}
                onChange={(event) => setItem(index, "dosage", event.target.value)}
              />
              <Field
                name={`items.${index}.frequency`}
                label={labels.frequency}
                value={item.frequency}
                onChange={(event) => setItem(index, "frequency", event.target.value)}
              />
            </div>
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              <Field
                name={`items.${index}.durationDays`}
                type="number"
                min="1"
                inputMode="numeric"
                label={labels.durationDays}
                value={item.durationDays}
                onChange={(event) => setItem(index, "durationDays", event.target.value)}
              />
              <Field
                name={`items.${index}.instructions`}
                label={labels.instructions}
                value={item.instructions}
                onChange={(event) => setItem(index, "instructions", event.target.value)}
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-xl"
          onClick={() => setItems((current) => [...current, emptyItem])}
        >
          <Plus className="size-4" />
          {labels.addMedicine}
        </Button>
      </div>
      <TextAreaField
        name="notes"
        label={labels.notes}
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />
    </form>
  );
}
