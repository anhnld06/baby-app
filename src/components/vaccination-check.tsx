"use client";

import { useActionState, useId, useRef } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { toggleScheduledDose } from "@/app/vaccination-actions";
import { Field } from "@/components/form-fields";
import { Button } from "@/components/ui/button";

/**
 * Checklist tick. Unticking saves at once; ticking asks for the real date in
 * a small dialog (defaults to today in the account timezone, never later).
 */
export function VaccinationCheck({ kind, ownerId, entryKey, label, checked, today, compact = false, doseLabel }: {
  kind: "baby" | "mother";
  ownerId: string;
  entryKey: string;
  label: string;
  checked: boolean;
  /** Account-timezone day, "YYYY-MM-DD". */
  today: string;
  compact?: boolean;
  doseLabel?: string;
}) {
  const [state, action, pending] = useActionState(toggleScheduledDose.bind(null, kind, ownerId, entryKey, !checked), {});
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const fieldId = useId();
  const button = (
    <button
      type={checked ? "submit" : "button"}
      role="checkbox"
      aria-checked={checked}
      aria-label={`Đã tiêm ${label}`}
      aria-haspopup={checked ? undefined : "dialog"}
      aria-busy={pending}
      disabled={pending}
      onClick={checked ? undefined : () => dialog.current?.showModal()}
      className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-1 text-sm font-medium text-primary disabled:opacity-60 ${compact ? "flex-col text-xs" : ""}`}
    >
      <span className={`grid shrink-0 place-items-center border-2 ${compact ? "size-12 rounded-full sm:size-14" : "size-6 rounded-lg"} ${checked ? "border-emerald-600 bg-emerald-600 text-white" : compact ? "border-dashed border-border bg-background" : "border-primary/50 bg-background"}`}>
        {pending ? <LoaderCircle className="size-4 animate-spin" /> : checked ? <Check className="size-4" /> : null}
      </span>
      {pending ? "Đang lưu…" : doseLabel ?? (checked ? "Đã tiêm" : "Đánh dấu đã tiêm")}
    </button>
  );
  return (
    <div>
      {checked ? <form action={action}>{button}</form> : button}
      {!checked && (
        <dialog
          ref={dialog}
          aria-labelledby={titleId}
          className="m-auto w-[min(22rem,calc(100vw-2rem))] rounded-3xl border bg-card p-5 text-left text-card-foreground shadow-xl backdrop:bg-black/40"
        >
          <form
            action={action}
            onSubmit={() => dialog.current?.close()}
            className="space-y-4"
          >
            <h2 id={titleId} className="text-base font-semibold">Đã tiêm {label}</h2>
            <Field
              id={fieldId}
              name="administeredAt"
              type="date"
              label="Ngày tiêm"
              required
              max={today}
              defaultValue={today}
            />
            <p className="text-xs leading-5 text-muted-foreground">Ngày tiêm dùng để tính ngày dự kiến của mũi sau.</p>
            <div className="flex flex-wrap justify-end gap-2">
              <Button type="button" variant="ghost" className="min-h-11 rounded-xl px-4" onClick={() => dialog.current?.close()}>Hủy</Button>
              <Button type="submit" className="min-h-11 rounded-xl px-4">Lưu đã tiêm</Button>
            </div>
          </form>
        </dialog>
      )}
      {state.error && <p role="alert" className="mt-2 text-sm text-destructive">{state.error}</p>}
    </div>
  );
}
