"use client";

import { unstable_isUnrecognizedActionError, unstable_rethrow } from "next/navigation";
import { useState, useTransition, type ComponentProps, type FormEvent } from "react";
import { asFormAction } from "@/lib/form-action";
import { actionErrorMessage, failureKind, SAVE_MESSAGES } from "@/lib/form-action-errors";

type SaveAction = (formData: FormData) => Promise<void | { error: string }>;

/**
 * A `<form>` for a save action that may return `{ error }`. The action is
 * called from onSubmit (not as React's form action) so an error is shown below
 * the fields and the form is not reset, keeping what the user typed. Submit
 * buttons can still use useFormStatus: the transition started here marks the
 * form as pending. A submit button with `data-own-action` (its own formAction,
 * e.g. delete) is left to React. `action` stays on the form as the no-JS path.
 */
export function ActionResultForm({
  action,
  children,
  ...props
}: Omit<ComponentProps<"form">, "action" | "onSubmit"> & { action: SaveAction }) {
  const [error, setError] = useState("");
  const [, startSaving] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    if (submitter?.hasAttribute("data-own-action")) return;
    event.preventDefault();
    const formData = new FormData(event.currentTarget, submitter);
    setError("");
    startSaving(async () => {
      try {
        const message = actionErrorMessage(await action(formData));
        if (message) setError(message);
      } catch (caught) {
        unstable_rethrow(caught);
        setError(SAVE_MESSAGES[failureKind(caught, unstable_isUnrecognizedActionError(caught))]);
      }
    });
  }

  return (
    <form {...props} action={asFormAction(action)} onSubmit={onSubmit}>
      {children}
      {error && (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
