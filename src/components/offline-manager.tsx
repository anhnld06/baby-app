"use client";

import { CloudAlert, CloudUpload } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  flushOfflineQueue,
  offlineQueueEvent,
  offlineQueueSummary,
  type OfflineQueueSummary,
} from "@/lib/offline-db";

const EMPTY: OfflineQueueSummary = { pending: 0, failed: 0 };

export function OfflineManager() {
  const [summary, setSummary] = useState<OfflineQueueSummary>(EMPTY);
  const pathname = usePathname();
  const router = useRouter();

  const refresh = useCallback(async () => {
    setSummary(await offlineQueueSummary().catch(() => EMPTY));
  }, []);

  const sync = useCallback(async () => {
    await flushOfflineQueue().catch(() => undefined);
    await refresh();
  }, [refresh]);

  useEffect(() => {
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type === "SYNC_OFFLINE_QUEUE") void sync();
      // Sent by the worker when a notification is tapped but it cannot navigate this tab itself.
      if (event.data?.type === "OPEN_URL" && typeof event.data.url === "string") {
        const target = new URL(event.data.url, window.location.origin);
        if (target.origin === window.location.origin) {
          router.push(`${target.pathname}${target.search}${target.hash}`);
        }
      }
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && navigator.onLine) void sync();
    };
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { updateViaCache: "none" })
        .catch(() => undefined);
      navigator.serviceWorker.addEventListener(
        "message",
        handleServiceWorkerMessage,
      );
    }
    const initialRefresh = window.setTimeout(() => {
      if (navigator.onLine) void sync();
      else void refresh();
    }, 0);
    window.addEventListener("online", sync);
    window.addEventListener(offlineQueueEvent, refresh);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearTimeout(initialRefresh);
      navigator.serviceWorker?.removeEventListener(
        "message",
        handleServiceWorkerMessage,
      );
      window.removeEventListener("online", sync);
      window.removeEventListener(offlineQueueEvent, refresh);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [refresh, sync, router]);

  // The profile page lists rejected records itself, with retry / discard actions.
  const showFailed = summary.failed > 0 && pathname !== "/profile";
  if (summary.pending === 0 && !showFailed) return null;
  return (
    <div className="fixed inset-x-3 top-20 z-[99] mx-auto flex max-w-sm flex-col gap-2">
      {summary.pending > 0 && (
        <div
          role="status"
          aria-live="polite"
          className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-950 shadow-lg dark:border-sky-900 dark:bg-sky-950 dark:text-sky-100"
        >
          <CloudUpload className="size-4 shrink-0" aria-hidden="true" />
          {summary.pending} bản ghi đang chờ đồng bộ
        </div>
      )}
      {showFailed && (
        <Link
          href="/profile#offline-storage"
          role="alert"
          className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm font-medium text-rose-950 shadow-lg dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100"
        >
          <CloudAlert className="size-4 shrink-0" aria-hidden="true" />
          <span>
            {summary.failed} bản ghi không đồng bộ được. Xem trong Hồ sơ
          </span>
        </Link>
      )}
    </div>
  );
}
