"use client";

import { VolumeRuler } from "@/components/volume-ruler";
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

export function FeedingFields({ initial, initialType, suggestedAmountMl, labels, typeLabels, children }: {
  initial?: InitialFeeding;
  initialType?: FeedingType;
  suggestedAmountMl?: number | null;
  labels: { type: string; leftMinutes: string; rightMinutes: string; firstSide: string; left: string; right: string; amountMl: string; milkType: string };
  typeLabels: Record<FeedingType, string>;
  children: ReactNode;
}) {
  const [type, setType] = useState<FeedingType>(initial?.type ?? initialType ?? "BREASTFEEDING");
  const [amount,setAmount]=useState(initial ? initial.amountMl==null ? "" : String(initial.amountMl) : suggestedAmountMl==null ? "" : String(suggestedAmountMl));
  const breast = type === "BREASTFEEDING" || type === "MIXED";
  const bottle = type !== "BREASTFEEDING";
  const formula = type === "FORMULA" || type === "MIXED";
  return <>
    <SelectField name="type" label={labels.type} value={type} onChange={(event) => setType(event.target.value as FeedingType)}>
      {Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
    </SelectField>
    {/* Disabled groups keep drafts when switching types but never enter FormData. */}
    <fieldset hidden={!breast} disabled={!breast} className="space-y-4">
      <legend className="sr-only">Bú mẹ trực tiếp</legend>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        <Field name="leftBreastDuration" type="number" min="0" inputMode="numeric" label={labels.leftMinutes} defaultValue={initial?.leftBreastDuration ?? ""} />
        <Field name="rightBreastDuration" type="number" min="0" inputMode="numeric" label={labels.rightMinutes} defaultValue={initial?.rightBreastDuration ?? ""} />
      </div>
      <SelectField name="firstSide" label={labels.firstSide} defaultValue={initial?.firstSide ?? ""}>
        <option value="">—</option>
        <option value="LEFT">{labels.left}</option>
        <option value="RIGHT">{labels.right}</option>
      </SelectField>
      <p className="text-sm text-muted-foreground">Ghi bên bú và thời gian nếu biết; không cần quy đổi phút bú thành ml.</p>
    </fieldset>
    <fieldset hidden={!bottle} disabled={!bottle} className="space-y-4">
      <legend className="sr-only">Bú bình</legend>
      <VolumeRuler value={amount} onChange={setAmount} label="Điều chỉnh lượng sữa" />
      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Loại sữa">{(["BOTTLE_BREAST_MILK","FORMULA","MIXED"] as const).map(value=><button key={value} type="button" aria-pressed={type===value} onClick={()=>setType(value)} className={`min-h-11 rounded-2xl border px-2 text-xs font-medium ${type===value ? "border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-200" : "border-border bg-muted/70 text-muted-foreground"}`}>{value==="BOTTLE_BREAST_MILK" ? "Sữa mẹ" : value==="FORMULA" ? "Công thức" : "Kết hợp"}</button>)}</div>
      <Field name="amountMl" type="number" min="0" step="1" inputMode="decimal" label={type === "MIXED" ? "Lượng bú bình (ml)" : labels.amountMl} value={amount} onChange={event=>setAmount(event.target.value)} />
      <p className="text-sm text-muted-foreground">Nhập lượng bé thực tế uống từ bình; để trống nếu không biết.</p>
      <fieldset hidden={!formula} disabled={!formula}>
        <legend className="sr-only">Thông tin sữa công thức</legend>
        <Field name="milkType" label={labels.milkType} placeholder="Tên sữa công thức (không bắt buộc)" defaultValue={initial?.milkType ?? ""} />
      </fieldset>
    </fieldset>
    {children}
  </>;
}
