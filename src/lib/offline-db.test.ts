import "fake-indexeddb/auto";

import { beforeAll, describe, expect, it, vi } from "vitest";

const storage = new Map<string, string>();
const eventTarget = new EventTarget();

beforeAll(() => {
  vi.stubGlobal("window", eventTarget);
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  });
});

describe("offline queue", () => {
  it("requires opt-in and stores only serializable form fields", async () => {
    const offline = await import("@/lib/offline-db");
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
});
