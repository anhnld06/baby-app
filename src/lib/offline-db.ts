"use client";

import Dexie, { type EntityTable } from "dexie";
import type {
  OfflineMutationType,
  PendingOfflineMutation,
} from "@/features/offline/types";

const OFFLINE_ENABLED_KEY = "vani-offline-enabled";
const QUEUE_EVENT = "vani-offline-queue-change";

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
  window.dispatchEvent(new Event(QUEUE_EVENT));
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
  };
  await getDatabase().mutations.add(mutation);
  notifyQueueChanged();
  return mutation;
}

export async function pendingOfflineCount() {
  if (typeof indexedDB === "undefined") return 0;
  return getDatabase().mutations.count();
}

export async function clearOfflineData() {
  if (typeof indexedDB !== "undefined") await getDatabase().mutations.clear();
  if (typeof window !== "undefined") {
    localStorage.removeItem(OFFLINE_ENABLED_KEY);
    notifyQueueChanged();
  }
}

export async function flushOfflineQueue() {
  if (typeof navigator === "undefined" || !navigator.onLine) return;
  const items = await getDatabase().mutations.orderBy("createdAt").toArray();
  for (const item of items) {
    try {
      const response = await fetch("/api/offline/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (response.ok) {
        await getDatabase().mutations.delete(item.id);
        notifyQueueChanged();
        continue;
      }
      if (response.status === 401) return;
      const result = (await response.json().catch(() => null)) as { error?: string } | null;
      await getDatabase().mutations.update(item.id, {
        attempts: item.attempts + 1,
        lastError: result?.error ?? `HTTP ${response.status}`,
      });
      if (response.status >= 500) return;
    } catch {
      await getDatabase().mutations.update(item.id, {
        attempts: item.attempts + 1,
        lastError: "Mất kết nối",
      });
      return;
    }
  }
}

export const offlineQueueEvent = QUEUE_EVENT;
