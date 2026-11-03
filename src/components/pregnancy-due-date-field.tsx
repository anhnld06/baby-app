"use client";

import { useState } from "react";
import { Field } from "@/components/form-fields";
import { formatDateInputDisplay } from "@/lib/date";

export function PregnancyDueDateField({ label, initialValue, suggestedDate, examinedOn }: {
  label: string;
  initialValue: string;
  suggestedDate?: string;
  examinedOn?: string;
}) {
  const [value, setValue] = useState(initialValue || suggestedDate || "");
  return <div className="space-y-2">
    <Field name="estimatedDueDate" type="date" label={label} value={value} onChange={(event) => setValue(event.target.value)} />
    {!initialValue && value === suggestedDate && examinedOn && <p className="text-xs text-muted-foreground">Tự tính từ tuổi thai của lần khám ngày {formatDateInputDisplay(examinedOn)}.</p>}
  </div>;
}
