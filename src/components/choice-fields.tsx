"use client";

import { useState, type ReactNode } from "react";
import { SelectField } from "@/components/form-fields";

/** Keep drafts when switching choices; inactive fields never enter FormData. */
export function ChoiceFields({ name, label, initialValue, options, children, groups }: {
  name: string;
  label: string;
  initialValue: string;
  options: { value: string; label: string }[];
  children?: ReactNode;
  groups: { values: string[]; fields: ReactNode }[];
}) {
  const [value, setValue] = useState(initialValue);
  return <>
    <SelectField name={name} label={label} value={value} onChange={(event) => setValue(event.target.value)}>
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </SelectField>
    {children}
    {groups.map((group, index) => {
      const active = group.values.includes(value);
      return <fieldset key={index} hidden={!active} disabled={!active} className="min-w-0 space-y-4">{group.fields}</fieldset>;
    })}
  </>;
}
