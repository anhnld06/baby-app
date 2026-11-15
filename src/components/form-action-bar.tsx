"use client";

import Link from "next/link";
import { unstable_isUnrecognizedActionError, unstable_rethrow } from "next/navigation";
import { useOffline } from "next/offline";
import { LoaderCircle, Save, Trash2, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import type { OfflineMutationType } from "@/features/offline/types";
import {
  isOfflineStorageEnabled,
  queueOfflineForm,
  requestOfflineSync,
} from "@/lib/offline-db";
import {
  actionErrorMessage,
  failureKind,
  SAVE_MESSAGES,
} from "@/lib/form-action-errors";
import { cn } from "@/lib/utils";

/**
 * Server actions may return `{ error }` (validation or business error, shown
 * as-is and the inputs are kept) or throw (redirects are rethrown; anything
 * else is reported without blaming the user's input).
 */
type FormAction = (formData: FormData) => void | Promise<void | { error: string }>;

function DeleteButton({
  label,
  disabled,
}: {
  label?: string;
  disabled: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="destructive"
      className="h-12 rounded-xl px-3"
      aria-label={label}
      aria-busy={pending}
      disabled={pending || disabled}
    >
      {pending ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <Trash2 className="size-4" />
      )}
      <span className="hidden min-[380px]:inline">{pending ? `${label}…` : label}</span>
    </Button>
  );
}

export function FormActionBar({
  formId,
  saveAction,
  saveLabel,
  cancelHref,
  cancelLabel,
  deleteAction,
  deleteId,
  deleteLabel,
  offlineMutationType,
}: {
  formId: string;
  saveAction: FormAction;
  saveLabel: string;
  cancelHref?: string;
  cancelLabel?: string;
  deleteAction?: FormAction;
  deleteId?: string;
  deleteLabel?: string;
  offlineMutationType?: OfflineMutationType;
}) {
  const [isSaving, startSaving] = useTransition();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  // True once Next.js sees a failed request or the browser reports "offline".
  // While offline, Next.js holds server actions and replays them when the
  // connection returns, so a pending save is waiting rather than failing.
  const networkOffline = useOffline();

  async function queueLocally(form: HTMLFormElement, type: OfflineMutationType, formData: FormData) {
    if (!isOfflineStorageEnabled()) {
      setError(SAVE_MESSAGES.offlineDisabled);
      return;
    }
    await queueOfflineForm(type, formData);
    await requestOfflineSync();
    form.reset();
    setNotice(SAVE_MESSAGES.queued);
  }

  function submitForm() {
    const form = document.getElementById(formId);
    if (!(form instanceof HTMLFormElement) || !form.reportValidity()) return;

    setError("");
    setNotice("");
    startSaving(async () => {
      const formData = new FormData(form);
      // Queue before calling the action: once a server action has been sent it
      // cannot be cancelled, and queuing it too could create a duplicate record.
      if (offlineMutationType && (!navigator.onLine || networkOffline)) {
        try {
          await queueLocally(form, offlineMutationType, formData);
        } catch {
          setError(SAVE_MESSAGES.queueFailed);
        }
        return;
      }
      try {
        const message = actionErrorMessage(await saveAction(formData));
        if (message) setError(message);
      } catch (error) {
        unstable_rethrow(error);
        const kind = failureKind(error, unstable_isUnrecognizedActionError(error));
        if (kind === "network") {
          // The request never reached the server, so it is safe to keep it locally instead.
          if (offlineMutationType && isOfflineStorageEnabled()) {
            try {
              await queueLocally(form, offlineMutationType, formData);
              return;
            } catch {
              // fall through to the network message
            }
          }
        }
        setError(SAVE_MESSAGES[kind]);
      }
    });
  }

  async function runDelete(formData: FormData) {
    if (!deleteAction) return;
    setError("");
    setNotice("");
    try {
      const message = actionErrorMessage(await deleteAction(formData));
      if (message) setError(message);
    } catch (error) {
      unstable_rethrow(error);
      const kind = failureKind(error, unstable_isUnrecognizedActionError(error));
      setError(kind === "generic" ? SAVE_MESSAGES.deleteFailed : SAVE_MESSAGES[kind]);
    }
  }

  return (
    <div data-record-actions className="mt-4 w-full rounded-2xl border border-border/70 bg-card p-3 shadow-sm">
      <div className="flex items-center gap-2">
        {cancelHref && (
          <Link
            href={cancelHref}
            replace
            scroll={false}
            aria-label={cancelLabel}
            aria-disabled={isSaving}
            tabIndex={isSaving ? -1 : undefined}
            className={cn(
              buttonVariants({ variant: "outline", size: "icon-lg" }),
              "size-12 rounded-xl",
              isSaving && "pointer-events-none opacity-50",
            )}
          >
            <X className="size-5" />
          </Link>
        )}
        {deleteAction && deleteId && (
          <form
            action={runDelete}
            className="shrink-0"
            onSubmit={(event) => {
              if (!window.confirm(`${deleteLabel}? Hành động này không thể hoàn tác.`)) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={deleteId} />
            <DeleteButton label={deleteLabel} disabled={isSaving} />
          </form>
        )}
        <Button
          type="submit"
          form={formId}
          className="h-12 min-w-0 flex-1 rounded-xl px-3 text-base"
          disabled={isSaving}
          aria-busy={isSaving}
          onClick={(event) => {
            event.preventDefault();
            submitForm();
          }}
        >
          {isSaving ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          <span className="truncate">{isSaving ? `${saveLabel}…` : saveLabel}</span>
        </Button>
      </div>
      {isSaving && networkOffline && (
        <p className="mt-3 rounded-xl bg-amber-100 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100" role="status">
          {SAVE_MESSAGES.waitingForNetwork}
        </p>
      )}
      {error && (
        <p className="mt-3 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="mt-3 rounded-xl bg-emerald-100 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" role="status">
          {notice}
        </p>
      )}
    </div>
  );
}
