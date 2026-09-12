"use client";

import { Database, LoaderCircle } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import {
  clearOfflineData,
  isOfflineStorageEnabled,
  offlineQueueEvent,
  setOfflineStorageEnabled,
} from "@/lib/offline-db";

function subscribeSettings(callback: () => void) {
  window.addEventListener(offlineQueueEvent, callback);
  return () => window.removeEventListener(offlineQueueEvent, callback);
}

export function OfflineStorageSettings() {
  const enabled = useSyncExternalStore(
    subscribeSettings,
    isOfflineStorageEnabled,
    () => false,
  );
  const [pending, setPending] = useState(false);

  async function toggle() {
    setPending(true);
    if (enabled) {
      await clearOfflineData();
    } else {
      setOfflineStorageEnabled(true);
      if (navigator.storage?.persist) await navigator.storage.persist().catch(() => false);
    }
    setPending(false);
  }

  return (
    <section className="mt-3 rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
            <Database className="size-5" />
          </span>
          <div>
            <p className="font-medium">Ghi nhanh khi mất mạng</p>
            <p className="text-xs text-muted-foreground">
              Lưu tạm cữ bú, giấc ngủ và tã trên thiết bị này rồi tự đồng bộ.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant={enabled ? "outline" : "secondary"}
          className="h-11 shrink-0 rounded-xl"
          disabled={pending}
          onClick={toggle}
        >
          {pending && <LoaderCircle className="size-4 animate-spin" />}
          {enabled ? "Tắt" : "Bật"}
        </Button>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        {enabled
          ? "Tắt tính năng sẽ xóa toàn bộ dữ liệu chưa đồng bộ trên thiết bị."
          : "Dữ liệu ngoại tuyến chỉ được lưu khi bạn chủ động bật tính năng này."}
      </p>
    </section>
  );
}
