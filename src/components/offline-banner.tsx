"use client";

import { WifiOff } from "lucide-react";
import { useOffline } from "next/offline";
import { useSyncExternalStore } from "react";

function subscribeConnection(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

export function OfflineBanner() {
  const hasOfflineRequest = useOffline();
  const browserOffline = useSyncExternalStore(
    subscribeConnection,
    () => !navigator.onLine,
    () => false,
  );

  const isOffline = hasOfflineRequest || browserOffline;

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-3 top-3 z-[100] mx-auto flex min-h-12 max-w-lg items-center justify-center gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-950 shadow-lg dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100"
    >
      <WifiOff className="size-4 shrink-0" aria-hidden="true" />
      <span>Đang ngoại tuyến. Thao tác đang chờ sẽ tự thử lại khi có mạng.</span>
    </div>
  );
}
