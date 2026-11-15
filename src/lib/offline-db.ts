"use client";

import Dexie, { type EntityTable } from "dexie";
import type {
  OfflineMutationType,
  PendingOfflineMutation,
} from "@/features/offline/types";

const OFFLINE_ENABLED_KEY = "vani-offline-enabled";
const QUEUE_EVENT = "vani-offline-queue-change";
const SYNC_TAG = "vani-offline-sync";
/** The sync API rejects attempts above this value, so never send more. */
const MAX_REPORTED_ATTEMPTS = 100;

class VaniOfflineDatabase extends Dexie {
  mutations!: EntityTable<PendingOfflineMutation, "id">;

  constructor() {
    super("vani-family-offline");
    this.version(1).stores({ mutations: "id, createdAt, type" });
  }
}

let database: VaniOfflineDatabase | undefined;

function getDatabase() {
  if (typeof indexedDB === "undefined") {
    throw new Error("IndexedDB is unavailable");
  }
  database ??= new VaniOfflineDatabase();
  return database;
}

function notifyQueueChanged() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(QUEUE_EVENT));
}

function isFailed(mutation: PendingOfflineMutation) {
  return mutation.status === "failed";
}

/**
 * A 4xx reply means the server understood the request and refused it, so
 * re-sending the same body will never succeed. 401 (session expired), 408
 * (timeout) and 429 (rate limit) are transient and are retried later.
 */
export function isDeadLetterStatus(status: number) {
  return status >= 400 && status < 500 && status !== 401 && status !== 408 && status !== 429;
}

export function isOfflineStorageEnabled() {
  return typeof window !== "undefined" && localStorage.getItem(OFFLINE_ENABLED_KEY) === "true";
}

export function setOfflineStorageEnabled(enabled: boolean) {
  localStorage.setItem(OFFLINE_ENABLED_KEY, String(enabled));
  notifyQueueChanged();
}

export async function queueOfflineForm(
  type: OfflineMutationType,
  formData: FormData,
) {
  if (!isOfflineStorageEnabled()) throw new Error("offline-disabled");
  const payload: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (key === "id" || typeof value !== "string") continue;
    payload[key] = value;
  }
  const mutation: PendingOfflineMutation = {
    id: crypto.randomUUID(),
    type,
    payload,
    createdAt: new Date().toISOString(),
    attempts: 0,
    status: "pending",
  };
  await getDatabase().mutations.add(mutation);
  notifyQueueChanged();
  return mutation;
}

/** Asks the service worker to wake open pages for a sync once the network is back. */
export async function requestOfflineSync() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  const registration = await navigator.serviceWorker.ready.catch(() => undefined);
  const withSync = registration as
    | (ServiceWorkerRegistration & { sync?: { register(tag: string): Promise<void> } })
    | undefined;
  await withSync?.sync?.register(SYNC_TAG).catch(() => undefined);
}

export type OfflineQueueSummary = { pending: number; failed: number };

export async function offlineQueueSummary(): Promise<OfflineQueueSummary> {
  if (typeof indexedDB === "undefined") return { pending: 0, failed: 0 };
  const items = await getDatabase().mutations.toArray();
  const failed = items.filter(isFailed).length;
  return { pending: items.length - failed, failed };
}

/** Records still waiting to be retried automatically (rejected records are not counted). */
export async function pendingOfflineCount() {
  return (await offlineQueueSummary()).pending;
}

/** Records the server rejected; they need the user to retry or discard them. */
export async function failedOfflineMutations() {
  if (typeof indexedDB === "undefined") return [];
  const items = await getDatabase().mutations.orderBy("createdAt").toArray();
  return items.filter(isFailed);
}

export async function retryOfflineMutation(id: string) {
  await getDatabase().mutations.update(id, {
    status: "pending",
    attempts: 0,
    lastError: undefined,
    failedAt: undefined,
  });
  notifyQueueChanged();
  return flushOfflineQueue();
}

export async function discardOfflineMutation(id: string) {
  await getDatabase().mutations.delete(id);
  notifyQueueChanged();
}

export async function clearOfflineData() {
  if (typeof indexedDB !== "undefined") await getDatabase().mutations.clear();
  if (typeof window !== "undefined") {
    localStorage.removeItem(OFFLINE_ENABLED_KEY);
    notifyQueueChanged();
  }
}

async function flushOnce() {
  if (typeof navigator === "undefined" || !navigator.onLine) return;
  if (typeof indexedDB === "undefined") return;
  const items = await getDatabase().mutations.orderBy("createdAt").toArray();
  for (const item of items) {
    if (isFailed(item)) continue;
    try {
      const response = await fetch("/api/offline/sync", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          type: item.type,
          payload: item.payload,
          createdAt: item.createdAt,
          attempts: Math.min(item.attempts, MAX_REPORTED_ATTEMPTS),
        }),
      });
      if (response.ok && !response.redirected) {
        await getDatabase().mutations.delete(item.id);
        notifyQueueChanged();
        continue;
      }
      // Session expired (or bounced to a login page): keep everything and stop.
      if (response.status === 401 || response.redirected) return;
      const result = (await response.json().catch(() => null)) as { error?: string } | null;
      const lastError = result?.error ?? `Máy chủ từ chối bản ghi (mã ${response.status})`;
      if (isDeadLetterStatus(response.status)) {
        await getDatabase().mutations.update(item.id, {
          attempts: item.attempts + 1,
          status: "failed",
          failedAt: new Date().toISOString(),
          lastError,
        });
        notifyQueueChanged();
        continue;
      }
      await getDatabase().mutations.update(item.id, {
        attempts: item.attempts + 1,
        lastError,
      });
      // 5xx / 408 / 429: the server is struggling; try again on the next flush.
      return;
    } catch {
      await getDatabase().mutations.update(item.id, {
        attempts: item.attempts + 1,
        lastError: "Mất kết nối",
      });
      return;
    }
  }
}

let activeFlush: Promise<OfflineQueueSummary> | undefined;
let flushRequested = false;

/**
 * Sends pending records to the server in creation order. Concurrent callers
 * share one run; a call made during a run schedules one more pass so records
 * retried meanwhile are not skipped.
 */
export function flushOfflineQueue(): Promise<OfflineQueueSummary> {
  if (activeFlush) {
    flushRequested = true;
    return activeFlush;
  }
  activeFlush = (async () => {
    try {
      do {
        flushRequested = false;
        await flushOnce();
      } while (flushRequested);
      return await offlineQueueSummary();
    } finally {
      activeFlush = undefined;
    }
  })();
  return activeFlush;
}

/**
 * Before wiping local data (logout, turning the feature off): sync what can be
 * synced and return how many records would still be lost.
 */
export async function unsyncedCountAfterSync() {
  if (typeof indexedDB === "undefined") return 0;
  const summary =
    typeof navigator !== "undefined" && navigator.onLine
      ? await flushOfflineQueue().catch(() => offlineQueueSummary())
      : await offlineQueueSummary();
  return summary.pending + summary.failed;
}

export const offlineQueueEvent = QUEUE_EVENT;
