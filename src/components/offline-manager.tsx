"use client";

import { CloudUpload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  flushOfflineQueue,
  offlineQueueEvent,
  pendingOfflineCount,
} from "@/lib/offline-db";

export function OfflineManager() {
  const [pending, setPending] = useState(0);

  const refresh = useCallback(async () => {
    setPending(await pendingOfflineCount().catch(() => 0));
  }, []);

  const sync = useCallback(async () => {
    await flushOfflineQueue();
    await refresh();
  }, [refresh]);

  useEffect(() => {
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type === "SYNC_OFFLINE_QUEUE") void sync();
    };
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
      navigator.serviceWorker.addEventListener("message", handleServiceWorkerMessage);
    }
    const initialRefresh = window.setTimeout(() => {
      if (navigator.onLine) void sync();
      else void refresh();
    }, 0);
    window.addEventListener("online", sync);
    window.addEventListener(offlineQueueEvent, refresh);
    return () => {
      window.clearTimeout(initialRefresh);
      navigator.serviceWorker?.removeEventListener("message", handleServiceWorkerMessage);
      window.removeEventListener("online", sync);
      window.removeEventListener(offlineQueueEvent, refresh);
    };
  }, [refresh, sync]);

  if (pending === 0) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-3 top-20 z-[99] mx-auto flex min-h-12 max-w-sm items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-950 shadow-lg dark:border-sky-900 dark:bg-sky-950 dark:text-sky-100"
    >
      <CloudUpload className="size-4" />
      {pending} bản ghi đang chờ đồng bộ
    </div>
  );
}
