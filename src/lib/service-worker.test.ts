import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, it, expect, vi } from "vitest";
function worker() {
  const events = new Map<string, (event: unknown) => void>();
  const cache = {
    addAll: vi.fn().mockResolvedValue(undefined),
    match: vi.fn(),
    put: vi.fn().mockResolvedValue(undefined),
  };
  const caches = {
    open: vi.fn().mockResolvedValue(cache),
    match: vi.fn(),
    keys: vi.fn().mockResolvedValue([]),
    delete: vi.fn().mockResolvedValue(true),
  };
  const fetch = vi.fn().mockResolvedValue(new Response("fresh"));
  runInNewContext(readFileSync("public/sw.js", "utf8"), {
    URL,
    fetch,
    caches,
    self: {
      location: { origin: "http://localhost:3000" },
      addEventListener: (name: string, callback: (event: unknown) => void) =>
        events.set(name, callback),
      clients: { claim: vi.fn().mockResolvedValue(undefined) },
      skipWaiting: vi.fn().mockResolvedValue(undefined),
    },
  });
  return { events, cache, caches, fetch };
}
function request(path: string) {
  return {
    request: new Request(`http://localhost:3000${path}`),
    respondWith: vi.fn(),
  };
}
describe("service worker asset freshness", () => {
  it("never intercepts unhashed development scripts, even when an older worker cached them", () => {
    const w = worker();
    w.caches.match.mockResolvedValue(new Response("stale bundle"));
    for (const path of [
      "/_next/static/chunks/app/(app)/knowledge/page.js",
      "/_next/static/chunks/webpack.js",
      "/_next/static/css/app/layout.css",
      "/_next/static/webpack/abcdef123456.hot-update.json",
    ]) {
      const event = request(path);
      w.events.get("fetch")!(event);
      expect(event.respondWith).not.toHaveBeenCalled();
    }
    expect(w.caches.match).not.toHaveBeenCalled();
  });
  it("keeps immutable hashed production assets available from cache", async () => {
    const w = worker();
    const cached = new Response("immutable");
    w.caches.match.mockResolvedValue(cached);
    const event = request(
      "/_next/static/chunks/app/knowledge/page-1234abcd5678efab.js",
    );
    w.events.get("fetch")!(event);
    expect(await event.respondWith.mock.calls[0][0]).toBe(cached);
    expect(w.fetch).not.toHaveBeenCalled();
  });
  it("does not cache or intercept authenticated APIs", () => {
    const w = worker();
    const event = request("/api/knowledge?stage=ALL");
    w.events.get("fetch")!(event);
    expect(event.respondWith).not.toHaveBeenCalled();
  });
  it("cleans up old app caches without touching unrelated caches", async () => {
    const w = worker();
    w.caches.keys.mockResolvedValue([
      "vani-static-v3",
      "vani-static-v4",
      "other-app",
    ]);
    const event = { waitUntil: vi.fn() };
    w.events.get("activate")!(event);
    await event.waitUntil.mock.calls[0][0];
    expect(w.caches.delete).toHaveBeenCalledExactlyOnceWith("vani-static-v3");
  });
  it("precaches only hashed scripts for the offline fallback", async () => {
    const w = worker();
    w.cache.match.mockResolvedValue(
      new Response(
        '<script src="/_next/static/chunks/app/offline/page.js"></script><script src="/_next/static/chunks/1234abcd5678efab.js"></script>',
      ),
    );
    const event = { waitUntil: vi.fn() };
    w.events.get("install")!(event);
    await event.waitUntil.mock.calls[0][0];
    expect(w.cache.addAll.mock.calls[1][0]).toEqual([
      "/_next/static/chunks/1234abcd5678efab.js",
    ]);
  });
});
