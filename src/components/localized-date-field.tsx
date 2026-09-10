"use client";

import { CalendarDays } from "lucide-react";
import type { ChangeEvent, InputHTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDateInputDisplay, parseDateInputDisplay } from "@/lib/date";

type LocalizedDateFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  type: "date" | "datetime-local";
};

function inputString(value: LocalizedDateFieldProps["value"] | LocalizedDateFieldProps["defaultValue"]) {
  return typeof value === "string" ? value : "";
}

function maskDate(value: string, includeTime: boolean) {
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return formatDateInputDisplay(value, includeTime);
  const digits = value.replace(/\D/g, "").slice(0, includeTime ? 12 : 8);
  const dateParts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  const date = dateParts.join("/");
  if (!includeTime || digits.length <= 8) return date;
  const hour = digits.slice(8, 10);
  const minute = digits.slice(10, 12);
  return `${date} ${hour}${minute ? `:${minute}` : ""}`;
}

export function LocalizedDateField({
  label,
  type,
  id,
  name,
  value,
  defaultValue,
  onChange,
  onBlur,
  required,
  disabled,
  min,
  max,
  className,
  placeholder,
  ...props
}: LocalizedDateFieldProps) {
  const includeTime = type === "datetime-local";
  const initialIso = inputString(value ?? defaultValue);
  const [isoValue, setIsoValue] = useState(initialIso);
  const [displayValue, setDisplayValue] = useState(() => formatDateInputDisplay(initialIso, includeTime));
  const [lastControlledValue, setLastControlledValue] = useState(typeof value === "string" ? value : undefined);
  const visibleInputRef = useRef<HTMLInputElement>(null);
  const fieldId = id ?? name;
  const expectedFormat = includeTime ? "dd/mm/yyyy HH:mm" : "dd/mm/yyyy";
  const parsedDisplay = displayValue ? parseDateInputDisplay(displayValue, includeTime) : "";
  const invalid = Boolean(displayValue && !parsedDisplay);

  if (typeof value === "string" && value !== lastControlledValue) {
    setLastControlledValue(value);
    setIsoValue(value);
    setDisplayValue(formatDateInputDisplay(value, includeTime));
  }

  useEffect(() => {
    visibleInputRef.current?.setCustomValidity(invalid ? `Nhập ngày theo định dạng ${expectedFormat}` : "");
  }, [expectedFormat, invalid]);

  function emitChange(nextIso: string) {
    if (!onChange) return;
    const target = { name: name ?? "", value: nextIso } as HTMLInputElement;
    onChange({ target, currentTarget: target } as ChangeEvent<HTMLInputElement>);
  }

  function commit(nextIso: string) {
    setIsoValue(nextIso);
    setDisplayValue(formatDateInputDisplay(nextIso, includeTime));
    emitChange(nextIso);
  }

  function handleTextChange(event: ChangeEvent<HTMLInputElement>) {
    const nextDisplay = maskDate(event.target.value, includeTime);
    const nextIso = parseDateInputDisplay(nextDisplay, includeTime);
    setDisplayValue(nextDisplay);
    setIsoValue(nextIso ?? "");
    if (nextIso !== undefined || nextDisplay === "") emitChange(nextIso ?? "");
  }

  return (
    <div className="w-full min-w-0 max-w-full space-y-2">
      <Label htmlFor={fieldId}>{label}</Label>
      <div className="relative">
        <Input
          {...props}
          ref={visibleInputRef}
          id={fieldId}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          required={required}
          disabled={disabled}
          value={displayValue}
          placeholder={placeholder ?? expectedFormat}
          aria-invalid={invalid || undefined}
          className={`h-12 w-full min-w-0 max-w-full rounded-xl bg-background pr-12 ${className ?? ""}`}
          onChange={handleTextChange}
          onBlur={(event) => {
            if (parsedDisplay) setDisplayValue(formatDateInputDisplay(parsedDisplay, includeTime));
            onBlur?.(event);
          }}
        />
        <input type="hidden" name={name} value={isoValue} disabled={disabled} />
        <input
          type={type}
          aria-label={`Chọn ${label.toLowerCase()} từ lịch`}
          tabIndex={-1}
          value={isoValue}
          min={min}
          max={max}
          disabled={disabled}
          className="absolute inset-y-0 right-0 z-10 h-12 w-12 cursor-pointer opacity-0 disabled:pointer-events-none"
          onChange={(event) => commit(event.target.value)}
        />
        <CalendarDays className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
      {invalid && <p className="px-1 text-xs text-destructive">Nhập theo định dạng {expectedFormat}</p>}
    </div>
  );
}
