"use client";

import { useState, type ReactNode } from "react";
import type { FeedingType, BreastSide } from "@prisma/client";
import { Field, SelectField } from "@/components/form-fields";

type InitialFeeding = {
  type: FeedingType;
  leftBreastDuration: number | null;
  rightBreastDuration: number | null;
  firstSide: BreastSide | null;
  amountMl: number | null;
  milkType: string | null;
};

export function FeedingFields({ initial, labels, typeLabels, locale, children }: {
  initial?: InitialFeeding;
  labels: { type: string; leftMinutes: string; rightMinutes: string; firstSide: string; left: string; right: string; amountMl: string; milkType: string };
  typeLabels: Record<FeedingType, string>;
  locale: "vi" | "en";
  children: ReactNode;
}) {
  const [type, setType] = useState<FeedingType>(initial?.type ?? "BREASTFEEDING");
  const breast = type === "BREASTFEEDING" || type === "MIXED";
  const bottle = type !== "BREASTFEEDING";
  const formula = type === "FORMULA" || type === "MIXED";
  const vi = locale === "vi";
  return <>
    <SelectField name="type" label={labels.type} value={type} onChange={(event) => setType(event.target.value as FeedingType)}>
      {Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
    </SelectField>
    {children}
    {/* Disabled groups keep drafts when switching types but never enter FormData. */}
    <fieldset hidden={!breast} disabled={!breast} className="space-y-4">
      <legend className="sr-only">{vi ? "Bú mẹ trực tiếp" : "Direct breastfeeding"}</legend>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        <Field name="leftBreastDuration" type="number" min="0" inputMode="numeric" label={labels.leftMinutes} defaultValue={initial?.leftBreastDuration ?? ""} />
        <Field name="rightBreastDuration" type="number" min="0" inputMode="numeric" label={labels.rightMinutes} defaultValue={initial?.rightBreastDuration ?? ""} />
      </div>
      <SelectField name="firstSide" label={labels.firstSide} defaultValue={initial?.firstSide ?? ""}>
        <option value="">—</option>
        <option value="LEFT">{labels.left}</option>
        <option value="RIGHT">{labels.right}</option>
      </SelectField>
      <p className="text-sm text-muted-foreground">{vi ? "Ghi bên bú và thời gian nếu biết; không cần quy đổi phút bú thành ml." : "Record side and duration if known; feeding minutes do not determine milk volume."}</p>
    </fieldset>
    <fieldset hidden={!bottle} disabled={!bottle} className="space-y-4">
      <legend className="sr-only">{vi ? "Bú bình" : "Bottle feeding"}</legend>
      <Field name="amountMl" type="number" min="0" step="1" inputMode="decimal" label={type === "MIXED" ? (vi ? "Lượng bú bình (ml)" : "Bottle volume (ml)") : labels.amountMl} defaultValue={initial?.amountMl ?? ""} />
      <p className="text-sm text-muted-foreground">{vi ? "Nhập lượng bé thực tế uống từ bình; để trống nếu không biết." : "Enter the amount actually consumed from the bottle; leave blank if unknown."}</p>
      <fieldset hidden={!formula} disabled={!formula}>
        <legend className="sr-only">{vi ? "Thông tin sữa công thức" : "Formula details"}</legend>
        <Field name="milkType" label={labels.milkType} placeholder={vi ? "Tên sữa công thức (không bắt buộc)" : "Formula name (optional)"} defaultValue={initial?.milkType ?? ""} />
      </fieldset>
    </fieldset>
  </>;
}
