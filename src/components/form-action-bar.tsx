"use client";

import Link from "next/link";
import { LoaderCircle, Save, Trash2, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import type { OfflineMutationType } from "@/features/offline/types";
import {
  isOfflineStorageEnabled,
  queueOfflineForm,
} from "@/lib/offline-db";
import { cn } from "@/lib/utils";

type FormAction = (formData: FormData) => void | Promise<void>;

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

  function submitForm() {
    const form = document.getElementById(formId);
    if (!(form instanceof HTMLFormElement) || !form.reportValidity()) return;

    setError("");
    setNotice("");
    startSaving(async () => {
      try {
        if (!navigator.onLine && offlineMutationType) {
          if (!isOfflineStorageEnabled()) {
            setError("Thiết bị đang mất mạng. Hãy bật “Ghi nhanh khi mất mạng” trong Hồ sơ để lưu tạm bản ghi.");
            return;
          }
          await queueOfflineForm(offlineMutationType, new FormData(form));
          const registration = await navigator.serviceWorker?.ready.catch(() => undefined);
          const withSync = registration as
            | (ServiceWorkerRegistration & { sync?: { register(tag: string): Promise<void> } })
            | undefined;
          await withSync?.sync?.register("vani-offline-sync").catch(() => undefined);
          form.reset();
          setNotice("Đã lưu tạm trên thiết bị. Bản ghi sẽ tự đồng bộ khi có mạng.");
          return;
        }
        await saveAction(new FormData(form));
      } catch {
        setError("Chưa thể lưu vì có thông tin chưa hợp lệ. Hãy kiểm tra lại các trường và thử lại.");
      }
    });
  }

  return (
    <div className="mt-4 w-full rounded-2xl border border-border/70 bg-card p-3 shadow-sm">
      <div className="flex items-center gap-2">
        {cancelHref && (
          <Link
            href={cancelHref}
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
            action={deleteAction}
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
