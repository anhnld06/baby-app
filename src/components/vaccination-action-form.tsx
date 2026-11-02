"use client";

import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VaccinationFormState } from "@/features/vaccination/journal";

type Action = (
  state: VaccinationFormState,
  form: FormData,
) => Promise<VaccinationFormState>;
export function VaccinationActionForm({
  action,
  label,
  children,
  confirm,
  destructive = false,
}: {
  action: Action;
  label: string;
  children?: React.ReactNode;
  confirm?: string;
  destructive?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form
      action={formAction}
      className="space-y-3"
      onSubmit={(event) => {
        if (confirm && !window.confirm(confirm)) event.preventDefault();
      }}
    >
      {children}
      <Button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        variant={destructive ? "destructive" : "secondary"}
        className="min-h-11 rounded-xl px-4"
      >
        {pending && <LoaderCircle className="size-4 animate-spin" />}
        {pending ? "Đang lưu…" : label}
      </Button>
      {state.error && (
        <p
          role="alert"
          className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
        >
          {state.error}
        </p>
      )}
    </form>
  );
}
