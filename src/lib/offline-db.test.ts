import "fake-indexeddb/auto";

import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const storage = new Map<string, string>();
const eventTarget = new EventTarget();
const connection = { onLine: true };

beforeAll(() => {
  vi.stubGlobal("window", eventTarget);
  vi.stubGlobal("navigator", connection);
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  });
});

async function freshQueue() {
  const offline = await import("@/lib/offline-db");
  await offline.clearOfflineData();
  offline.setOfflineStorageEnabled(true);
  return offline;
}

function feedingForm(note: string) {
  const formData = new FormData();
  formData.set("babyId", "baby-1");
  formData.set("note", note);
  return formData;
}

function reply(status: number, body: unknown = {}) {
  return Response.json(body, { status });
}

describe("offline queue", () => {
  beforeEach(() => {
    connection.onLine = true;
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.stubGlobal("window", eventTarget);
    vi.stubGlobal("navigator", connection);
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    });
  });

  it("requires opt-in and stores only serializable form fields", async () => {
    const offline = await import("@/lib/offline-db");
    await offline.clearOfflineData();
    const formData = new FormData();
    formData.set("babyId", "baby-1");
    formData.set("type", "BREASTFEEDING");
    formData.set("id", "must-not-be-stored");

    await expect(
      offline.queueOfflineForm("CREATE_FEEDING", formData),
    ).rejects.toThrow("offline-disabled");

    offline.setOfflineStorageEnabled(true);
    const mutation = await offline.queueOfflineForm("CREATE_FEEDING", formData);
    expect(mutation.payload).toEqual({
      babyId: "baby-1",
      type: "BREASTFEEDING",
    });
    expect(await offline.pendingOfflineCount()).toBe(1);

    await offline.clearOfflineData();
    expect(await offline.pendingOfflineCount()).toBe(0);
    expect(offline.isOfflineStorageEnabled()).toBe(false);
  });

  it("classifies only permanent client errors as dead letters", async () => {
    const { isDeadLetterStatus } = await import("@/lib/offline-db");
    for (const status of [400, 403, 404, 409, 413, 422]) expect(isDeadLetterStatus(status)).toBe(true);
    for (const status of [200, 401, 408, 429, 500, 502, 503]) expect(isDeadLetterStatus(status)).toBe(false);
  });

  it("parks rejected records as failed, keeps syncing the rest and stops re-posting them", async () => {
    const offline = await freshQueue();
    const rejected = await offline.queueOfflineForm("CREATE_FEEDING", feedingForm("bad"));
    const accepted = await offline.queueOfflineForm("CREATE_SLEEP", feedingForm("good"));
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      return body.id === rejected.id
        ? reply(403, { error: "Không có quyền ghi dữ liệu này" })
        : reply(200, { ok: true });
    });
    vi.stubGlobal("fetch", fetchMock);

    expect(await offline.flushOfflineQueue()).toEqual({ pending: 0, failed: 1 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [failed] = await offline.failedOfflineMutations();
    expect(failed).toMatchObject({
      id: rejected.id,
      status: "failed",
      lastError: "Không có quyền ghi dữ liệu này",
    });
    expect(failed.failedAt).toBeTruthy();
    expect(await offline.pendingOfflineCount()).toBe(0);
    expect((await offline.offlineQueueSummary()).failed).toBe(1);
    expect(accepted.id).not.toBe(rejected.id);

    // A later flush does not send the dead record again.
    fetchMock.mockClear();
    await offline.flushOfflineQueue();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("retries a failed record on demand and removes it once accepted", async () => {
    const offline = await freshQueue();
    const mutation = await offline.queueOfflineForm("CREATE_DIAPER", feedingForm("x"));
    const fetchMock = vi.fn().mockResolvedValueOnce(reply(400, {})).mockResolvedValue(reply(200, { ok: true }));
    vi.stubGlobal("fetch", fetchMock);

    await offline.flushOfflineQueue();
    const [failed] = await offline.failedOfflineMutations();
    expect(failed.lastError).toBe("Máy chủ từ chối bản ghi (mã 400)");

    expect(await offline.retryOfflineMutation(mutation.id)).toEqual({ pending: 0, failed: 0 });
    const retryBody = JSON.parse(String(fetchMock.mock.calls[1][1].body));
    expect(retryBody).toEqual({
      id: mutation.id,
      type: "CREATE_DIAPER",
      payload: { babyId: "baby-1", note: "x" },
      createdAt: mutation.createdAt,
      attempts: 0,
    });
  });

  it("keeps records pending on server errors, expired sessions and network loss", async () => {
    const offline = await freshQueue();
    await offline.queueOfflineForm("CREATE_FEEDING", feedingForm("a"));
    await offline.queueOfflineForm("CREATE_FEEDING", feedingForm("b"));
    for (const outcome of [
      () => Promise.resolve(reply(500, { error: "Máy chủ chưa thể đồng bộ dữ liệu" })),
      () => Promise.resolve(reply(401, {})),
      () => Promise.reject(new TypeError("Failed to fetch")),
    ]) {
      const fetchMock = vi.fn(outcome);
      vi.stubGlobal("fetch", fetchMock);
      expect(await offline.flushOfflineQueue()).toEqual({ pending: 2, failed: 0 });
      // Stops at the first failure instead of hammering the server.
      expect(fetchMock).toHaveBeenCalledTimes(1);
    }
  });

  it("never reports more attempts than the sync API accepts", async () => {
    const offline = await freshQueue();
    await offline.queueOfflineForm("CREATE_FEEDING", feedingForm("a"));
    const fetchMock = vi.fn().mockResolvedValue(reply(503, {}));
    vi.stubGlobal("fetch", fetchMock);
    for (let index = 0; index < 102; index += 1) await offline.flushOfflineQueue();
    const lastBody = JSON.parse(String(fetchMock.mock.calls.at(-1)![1].body));
    expect(lastBody.attempts).toBe(100);
  });

  it("does not try to sync while offline", async () => {
    const offline = await freshQueue();
    await offline.queueOfflineForm("CREATE_FEEDING", feedingForm("a"));
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    connection.onLine = false;
    expect(await offline.unsyncedCountAfterSync()).toBe(1);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports pending and failed records that would be lost on logout after syncing", async () => {
    const offline = await freshQueue();
    await offline.queueOfflineForm("CREATE_FEEDING", feedingForm("ok"));
    await offline.queueOfflineForm("CREATE_FEEDING", feedingForm("bad"));
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(reply(200, { ok: true })).mockResolvedValueOnce(reply(422, {})),
    );
    expect(await offline.unsyncedCountAfterSync()).toBe(1);
  });

  it("discards a single record", async () => {
    const offline = await freshQueue();
    const mutation = await offline.queueOfflineForm("CREATE_FEEDING", feedingForm("a"));
    await offline.discardOfflineMutation(mutation.id);
    expect(await offline.offlineQueueSummary()).toEqual({ pending: 0, failed: 0 });
  });
});
