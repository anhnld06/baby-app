"use client";

import { CloudAlert, Database, LoaderCircle, RotateCcw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import {
  OFFLINE_MUTATION_LABELS,
  type PendingOfflineMutation,
} from "@/features/offline/types";
import {
  clearOfflineData,
  discardOfflineMutation,
  failedOfflineMutations,
  isOfflineStorageEnabled,
  offlineQueueEvent,
  retryOfflineMutation,
  setOfflineStorageEnabled,
  unsyncedCountAfterSync,
} from "@/lib/offline-db";

function subscribeSettings(callback: () => void) {
  window.addEventListener(offlineQueueEvent, callback);
  return () => window.removeEventListener(offlineQueueEvent, callback);
}

const timeFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
});

function formatTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : timeFormatter.format(date);
}

function FailedMutation({
  mutation,
  busy,
  onRetry,
  onDiscard,
}: {
  mutation: PendingOfflineMutation;
  busy: boolean;
  onRetry: () => void;
  onDiscard: () => void;
}) {
  return (
    <li className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-950 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-100">
      <p className="text-sm font-medium">
        {OFFLINE_MUTATION_LABELS[mutation.type] ?? mutation.type} · ghi lúc {formatTime(mutation.createdAt)}
      </p>
      <p className="mt-1 text-xs leading-5">
        Lý do: {mutation.lastError ?? "Máy chủ từ chối bản ghi"}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          className="h-10 rounded-xl"
          disabled={busy}
          onClick={onRetry}
        >
          <RotateCcw className="size-4" />
          Thử lại
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-xl"
          disabled={busy}
          onClick={onDiscard}
        >
          <Trash2 className="size-4" />
          Bỏ bản ghi này
        </Button>
      </div>
    </li>
  );
}

export function OfflineStorageSettings() {
  const enabled = useSyncExternalStore(
    subscribeSettings,
    isOfflineStorageEnabled,
    () => false,
  );
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState<PendingOfflineMutation[]>([]);
  const [busyId, setBusyId] = useState<string>();
  const [message, setMessage] = useState("");

  const loadFailed = useCallback(async () => {
    setFailed(await failedOfflineMutations().catch(() => []));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadFailed(), 0);
    window.addEventListener(offlineQueueEvent, loadFailed);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(offlineQueueEvent, loadFailed);
    };
  }, [loadFailed]);

  async function toggle() {
    setPending(true);
    setMessage("");
    try {
      if (enabled) {
        const unsynced = await unsyncedCountAfterSync().catch(() => 0);
        if (
          unsynced > 0 &&
          !window.confirm(
            `Còn ${unsynced} bản ghi chưa đồng bộ. Tắt tính năng sẽ xóa vĩnh viễn ${unsynced} bản ghi này khỏi thiết bị. Vẫn tắt?`,
          )
        ) {
          return;
        }
        await clearOfflineData();
      } else {
        setOfflineStorageEnabled(true);
        if (navigator.storage?.persist) await navigator.storage.persist().catch(() => false);
      }
    } finally {
      setPending(false);
    }
  }

  async function retry(mutation: PendingOfflineMutation) {
    setBusyId(mutation.id);
    setMessage("");
    try {
      if (!navigator.onLine) {
        setMessage("Thiết bị đang mất mạng. Hãy thử lại khi có kết nối.");
        return;
      }
      await retryOfflineMutation(mutation.id);
      const stillFailed = (await failedOfflineMutations()).some((item) => item.id === mutation.id);
      setMessage(
        stillFailed
          ? "Máy chủ vẫn từ chối bản ghi này. Hãy nhập lại trên trang tương ứng rồi bỏ bản ghi này."
          : "Đã gửi lại bản ghi.",
      );
    } catch {
      setMessage("Chưa thể gửi lại bản ghi. Hãy thử lại.");
    } finally {
      setBusyId(undefined);
    }
  }

  async function discard(mutation: PendingOfflineMutation) {
    const label = OFFLINE_MUTATION_LABELS[mutation.type] ?? mutation.type;
    if (!window.confirm(`Bỏ bản ghi “${label}” lúc ${formatTime(mutation.createdAt)}? Bản ghi sẽ bị xóa khỏi thiết bị và không thể khôi phục.`)) {
      return;
    }
    setBusyId(mutation.id);
    setMessage("");
    try {
      await discardOfflineMutation(mutation.id);
    } catch {
      setMessage("Chưa thể xóa bản ghi. Hãy thử lại.");
    } finally {
      setBusyId(undefined);
    }
  }

  return (
    <section id="offline-storage" className="mt-3 scroll-mt-24 rounded-2xl bg-card p-4 shadow-sm">
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
          ? "Chỉ ghi được trên trang đã mở sẵn trước khi mất mạng. Tắt tính năng sẽ xóa toàn bộ dữ liệu chưa đồng bộ trên thiết bị."
          : "Dữ liệu ngoại tuyến chỉ được lưu khi bạn chủ động bật tính năng này."}
      </p>
      {failed.length > 0 && (
        <div className="mt-4">
          <p className="flex items-center gap-2 text-sm font-medium text-rose-700 dark:text-rose-300">
            <CloudAlert className="size-4 shrink-0" aria-hidden="true" />
            {failed.length} bản ghi không đồng bộ được
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Máy chủ đã từ chối các bản ghi này nên ứng dụng không tự gửi lại nữa.
          </p>
          <ul className="mt-2 space-y-2">
            {failed.map((mutation) => (
              <FailedMutation
                key={mutation.id}
                mutation={mutation}
                busy={busyId !== undefined}
                onRetry={() => void retry(mutation)}
                onDiscard={() => void discard(mutation)}
              />
            ))}
          </ul>
        </div>
      )}
      {message && (
        <p role="status" className="mt-3 text-xs text-muted-foreground">
          {message}
        </p>
      )}
    </section>
  );
}
