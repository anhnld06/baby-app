"use client";

import { useActionState } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { toggleScheduledDose } from "@/app/vaccination-actions";

export function VaccinationCheck({ kind, ownerId, entryKey, label, checked }: {
  kind: "baby" | "mother";
  ownerId: string;
  entryKey: string;
  label: string;
  checked: boolean;
}) {
  const [state, action, pending] = useActionState(toggleScheduledDose.bind(null, kind, ownerId, entryKey, !checked), {});
  return (
    <form action={action}>
      <button
        type="submit"
        role="checkbox"
        aria-checked={checked}
        aria-label={`Đã tiêm ${label}`}
        aria-busy={pending}
        disabled={pending}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl px-1 text-sm font-medium text-primary disabled:opacity-60"
      >
        <span className={`grid size-6 shrink-0 place-items-center rounded-lg border-2 ${checked ? "border-emerald-600 bg-emerald-600 text-white" : "border-primary/50 bg-background"}`}>
          {pending ? <LoaderCircle className="size-4 animate-spin" /> : checked ? <Check className="size-4" /> : null}
        </span>
        {pending ? "Đang lưu…" : checked ? "Đã tiêm" : "Đánh dấu đã tiêm"}
      </button>
      {state.error && <p role="alert" className="mt-2 text-sm text-destructive">{state.error}</p>}
    </form>
  );
}
