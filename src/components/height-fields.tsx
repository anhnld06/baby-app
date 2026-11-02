"use client";

import { useState } from "react";
import { Field, SelectField } from "@/components/form-fields";

export function HeightFields({ initialHeight, initialPosition, label }: {
  initialHeight?: number | null;
  initialPosition?: string | null;
  label: string;
}) {
  const [height, setHeight] = useState(initialHeight?.toString() ?? "");
  const hasHeight = height.trim() !== "";
  return <>
    <Field name="heightCm" type="number" min="0" step="0.1" inputMode="decimal" label={label} value={height} onChange={(event) => setHeight(event.target.value)} />
    <fieldset hidden={!hasHeight} disabled={!hasHeight} className="min-w-0 sm:col-span-2">
      <SelectField name="measurementPosition" label="Tư thế đo chiều dài/chiều cao" defaultValue={initialPosition ?? ""}>
        <option value="">Không ghi nhận</option>
        <option value="RECUMBENT">Nằm đo chiều dài</option>
        <option value="STANDING">Đứng đo chiều cao</option>
      </SelectField>
    </fieldset>
  </>;
}
