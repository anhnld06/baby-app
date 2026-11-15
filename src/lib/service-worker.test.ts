import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, it, expect, vi } from "vitest";

const ORIGIN = "http://localhost:3000";
const OFFLINE_HTML =
  '<link rel="stylesheet" href="/_next/static/css/abcdef1234567890.css"/>' +
  '<script src="/_next/static/chunks/app/offline/page.js"></script>' +
  '<script src="/_next/static/chunks/1234abcd5678efab.js"></script>';

type Requestish = string | { url: string };

function pathOf(input: Requestish) {
  return new URL(typeof input === "string" ? input : input.url, ORIGIN).pathname;
}

function worker({ offlineHtml = OFFLINE_HTML }: { offlineHtml?: string } = {}) {
  const events = new Map<string, (event: unknown) => void>();
  // In-memory Cache that keeps insertion order like the Cache API.
  const store = new Map<string, Response>();
  const cache = {
    addAll: vi.fn(async (urls: string[]) => {
      for (const url of urls) store.set(pathOf(url), new Response(`asset ${url}`));
    }),
    match: vi.fn(async (input: Requestish) => store.get(pathOf(input))?.clone()),
    put: vi.fn(async (input: Requestish, response: Response) => {
      store.delete(pathOf(input));
      store.set(pathOf(input), response);
    }),
    keys: vi.fn(async () => [...store.keys()].map((path) => new Request(`${ORIGIN}${path}`))),
    delete: vi.fn(async (input: Requestish) => store.delete(pathOf(input))),
  };
  const caches = {
    open: vi.fn().mockResolvedValue(cache),
    match: vi.fn((input: Requestish) => cache.match(input)),
    keys: vi.fn().mockResolvedValue([]),
    delete: vi.fn().mockResolvedValue(true),
  };
  const fetch = vi.fn(async (input: Requestish, init?: RequestInit) => {
    void init;
    if (pathOf(input) === "/offline") {
      return new Response(offlineHtml, { headers: { "content-type": "text/html" } });
    }
    return new Response("fresh");
  });
  const registration = {
    showNotification: vi.fn().mockResolvedValue(undefined),
    pushManager: {
      getSubscription: vi.fn().mockResolvedValue(null),
      subscribe: vi.fn(),
    },
  };
  const clients = {
    claim: vi.fn().mockResolvedValue(undefined),
    matchAll: vi.fn().mockResolvedValue([]),
    openWindow: vi.fn().mockResolvedValue(null),
  };
  runInNewContext(readFileSync("public/sw.js", "utf8"), {
    URL,
    Headers,
    Response,
    atob,
    fetch,
    caches,
    self: {
      location: { origin: ORIGIN },
      addEventListener: (name: string, callback: (event: unknown) => void) =>
        events.set(name, callback),
      clients,
      registration,
      skipWaiting: vi.fn().mockResolvedValue(undefined),
    },
  });
  return { events, store, cache, caches, fetch, registration, clients };
}

function lifecycleEvent() {
  return { waitUntil: vi.fn() };
}

function request(path: string, mode: RequestMode = "no-cors") {
  return {
    request: { method: "GET", url: `${ORIGIN}${path}`, mode },
    respondWith: vi.fn(),
    waitUntil: vi.fn(),
  };
}

async function settle(event: { waitUntil: ReturnType<typeof vi.fn> }) {
  await Promise.all(event.waitUntil.mock.calls.map(([promise]) => promise));
}

async function install(w: ReturnType<typeof worker>) {
  const event = lifecycleEvent();
  w.events.get("install")!(event);
  await settle(event);
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
    const event = request("/_next/static/chunks/app/knowledge/page-1234abcd5678efab.js");
    w.events.get("fetch")!(event);
    expect(await event.respondWith.mock.calls[0][0]).toBe(cached);
    expect(w.fetch).not.toHaveBeenCalled();
  });

  it("caches a hashed asset fetched on a cache miss", async () => {
    const w = worker();
    const path = "/_next/static/chunks/fedcba9876543210.js";
    const event = request(path);
    w.events.get("fetch")!(event);
    const response = (await event.respondWith.mock.calls[0][0]) as Response;
    expect(await response.text()).toBe("fresh");
    await settle(event);
    expect(w.store.has(path)).toBe(true);
  });

  it("does not cache or intercept authenticated APIs", () => {
    const w = worker();
    for (const mode of ["no-cors", "navigate"] as const) {
      const event = request("/api/knowledge?stage=ALL", mode);
      w.events.get("fetch")!(event);
      expect(event.respondWith).not.toHaveBeenCalled();
    }
  });

  it("never caches app HTML navigations and falls back to /offline when the network fails", async () => {
    const w = worker();
    await install(w);
    w.cache.put.mockClear();

    const online = request("/tracking/feeding", "navigate");
    w.events.get("fetch")!(online);
    expect(await ((await online.respondWith.mock.calls[0][0]) as Response).text()).toBe("fresh");
    await settle(online);
    expect(w.store.has("/tracking/feeding")).toBe(false);
    expect(w.cache.put).not.toHaveBeenCalled();

    w.fetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    const offline = request("/tracking/feeding", "navigate");
    w.events.get("fetch")!(offline);
    const fallback = (await offline.respondWith.mock.calls[0][0]) as Response;
    expect(await fallback.text()).toBe(OFFLINE_HTML);
  });

  it("cleans up every older app cache without touching unrelated caches", async () => {
    const w = worker();
    w.caches.keys.mockResolvedValue([
      "vani-static-v3",
      "vani-static-v4",
      "vani-static-v5",
      "other-app",
    ]);
    const event = lifecycleEvent();
    w.events.get("activate")!(event);
    await settle(event);
    expect(w.caches.delete.mock.calls.map(([key]) => key)).toEqual([
      "vani-static-v3",
      "vani-static-v4",
    ]);
  });

  it("precaches /offline with only its hashed assets", async () => {
    const w = worker();
    await install(w);
    expect([...w.store.keys()].sort()).toEqual(
      [
        "/_next/static/chunks/1234abcd5678efab.js",
        "/_next/static/css/abcdef1234567890.css",
        "/icons/vani-photo-192.png",
        "/icons/vani-photo-512.png",
        "/manifest.webmanifest",
        "/offline",
      ].sort(),
    );
  });

  it("refreshes /offline network-first when it is opened online", async () => {
    const w = worker();
    await install(w);
    const newHtml = '<script src="/_next/static/chunks/99999999aaaaaaaa.js"></script>';
    w.fetch.mockResolvedValueOnce(new Response(newHtml));
    const event = request("/offline", "navigate");
    w.events.get("fetch")!(event);
    expect(await ((await event.respondWith.mock.calls[0][0]) as Response).text()).toBe(newHtml);
    await settle(event);
    expect(await (await w.cache.match("/offline"))!.text()).toBe(newHtml);
    expect(w.store.has("/_next/static/chunks/99999999aaaaaaaa.js")).toBe(true);
  });

  it("refreshes a stale /offline fallback after a successful navigation", async () => {
    const w = worker();
    w.store.set(
      "/offline",
      new Response("old build", { headers: { "x-vani-cached-at": "1" } }),
    );
    const event = request("/", "navigate");
    w.events.get("fetch")!(event);
    await event.respondWith.mock.calls[0][0];
    await settle(event);
    expect(await (await w.cache.match("/offline"))!.text()).toBe(OFFLINE_HTML);
  });

  it("does not refetch a fresh /offline fallback on every navigation", async () => {
    const w = worker();
    w.store.set(
      "/offline",
      new Response("current", { headers: { "x-vani-cached-at": String(Date.now()) } }),
    );
    const event = request("/", "navigate");
    w.events.get("fetch")!(event);
    await event.respondWith.mock.calls[0][0];
    await settle(event);
    expect(w.fetch).toHaveBeenCalledTimes(1);
  });

  it("caps the static cache, evicting the oldest assets but never the offline fallback", async () => {
    const w = worker();
    await install(w);
    for (let index = 0; index < 160; index += 1) {
      const hash = index.toString(16).padStart(16, "0");
      w.store.set(`/_next/static/chunks/${hash}.js`, new Response("old"));
    }
    const path = "/_next/static/chunks/ffffffffffffffff.js";
    const event = request(path);
    w.events.get("fetch")!(event);
    await event.respondWith.mock.calls[0][0];
    await settle(event);

    expect(w.store.size).toBe(150);
    expect(w.store.has(path)).toBe(true);
    for (const kept of [
      "/offline",
      "/_next/static/chunks/1234abcd5678efab.js",
      "/_next/static/css/abcdef1234567890.css",
      "/manifest.webmanifest",
    ]) {
      expect(w.store.has(kept)).toBe(true);
    }
    expect(w.store.has("/_next/static/chunks/0000000000000000.js")).toBe(false);
  });
});

describe("service worker notifications", () => {
  function pushEvent(data: { json(): unknown; text(): string } | null) {
    return { data, waitUntil: vi.fn() };
  }

  it("shows JSON push payloads and keeps links inside the app", async () => {
    const w = worker();
    const event = pushEvent({
      json: () => ({ title: "Tiêm chủng", body: "Ngày mai", url: "https://evil.example/x", tag: "t1" }),
      text: () => "",
    });
    w.events.get("push")!(event);
    await settle(event);
    const [title, options] = w.registration.showNotification.mock.calls[0];
    expect(title).toBe("Tiêm chủng");
    expect(options).toMatchObject({ body: "Ngày mai", tag: "t1", data: { url: `${ORIGIN}/` } });
  });

  it("falls back to the text body when the payload is not JSON", async () => {
    const w = worker();
    const event = pushEvent({
      json: () => {
        throw new SyntaxError("Unexpected token");
      },
      text: () => "Đến giờ uống thuốc",
    });
    expect(() => w.events.get("push")!(event)).not.toThrow();
    await settle(event);
    const [title, options] = w.registration.showNotification.mock.calls[0];
    expect(title).toBe("Vani Family");
    expect(options.body).toBe("Đến giờ uống thuốc");
  });

  it("focuses an open app window and navigates it instead of opening a new one", async () => {
    const w = worker();
    const navigate = vi.fn().mockResolvedValue(null);
    const client = {
      url: `${ORIGIN}/`,
      focused: false,
      focus: vi.fn(),
      navigate,
      postMessage: vi.fn(),
    };
    client.focus.mockResolvedValue(client);
    w.clients.matchAll.mockResolvedValue([
      { url: "https://other.example/", focus: vi.fn(), navigate: vi.fn() },
      client,
    ]);
    const event = {
      notification: { close: vi.fn(), data: { url: "/vaccination-schedule" } },
      waitUntil: vi.fn(),
    };
    w.events.get("notificationclick")!(event);
    await settle(event);
    expect(event.notification.close).toHaveBeenCalled();
    expect(client.focus).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(`${ORIGIN}/vaccination-schedule`);
    expect(w.clients.openWindow).not.toHaveBeenCalled();
  });

  it("asks an uncontrolled window to route itself when it cannot be navigated", async () => {
    const w = worker();
    const client = {
      url: `${ORIGIN}/profile`,
      focused: true,
      focus: vi.fn(),
      navigate: vi.fn().mockRejectedValue(new TypeError("not controlled")),
      postMessage: vi.fn(),
    };
    client.focus.mockResolvedValue(client);
    w.clients.matchAll.mockResolvedValue([client]);
    const event = { notification: { close: vi.fn(), data: { url: "/" } }, waitUntil: vi.fn() };
    w.events.get("notificationclick")!(event);
    await settle(event);
    expect(client.postMessage).toHaveBeenCalledWith({ type: "OPEN_URL", url: `${ORIGIN}/` });
  });

  it("opens a new window when the app is not open", async () => {
    const w = worker();
    const event = { notification: { close: vi.fn(), data: { url: "/today" } }, waitUntil: vi.fn() };
    w.events.get("notificationclick")!(event);
    await settle(event);
    expect(w.clients.openWindow).toHaveBeenCalledWith(`${ORIGIN}/today`);
  });

  it("re-subscribes on pushsubscriptionchange, saves the new endpoint and drops the old one", async () => {
    const w = worker();
    const key = new Uint8Array([1, 2, 3]).buffer;
    const renewed = {
      endpoint: "https://fcm.googleapis.com/fcm/send/new",
      toJSON: () => ({
        endpoint: "https://fcm.googleapis.com/fcm/send/new",
        keys: { p256dh: "p", auth: "a" },
      }),
    };
    w.registration.pushManager.subscribe.mockResolvedValue(renewed);
    const event = {
      oldSubscription: {
        endpoint: "https://fcm.googleapis.com/fcm/send/old",
        options: { applicationServerKey: key },
      },
      newSubscription: null,
      waitUntil: vi.fn(),
    };
    w.events.get("pushsubscriptionchange")!(event);
    await settle(event);
    expect(w.registration.pushManager.subscribe).toHaveBeenCalledWith({
      userVisibleOnly: true,
      applicationServerKey: key,
    });
    const calls = w.fetch.mock.calls.map(([url, init]) => ({
      url,
      method: init?.method,
      credentials: init?.credentials,
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    }));
    expect(calls).toEqual([
      {
        url: "/api/push/subscription",
        method: "POST",
        credentials: "same-origin",
        body: renewed.toJSON(),
      },
      {
        url: "/api/push/subscription",
        method: "DELETE",
        credentials: "same-origin",
        body: { endpoint: "https://fcm.googleapis.com/fcm/send/old" },
      },
    ]);
  });

  it("fetches the VAPID key when the old subscription does not expose it", async () => {
    const w = worker();
    w.fetch.mockResolvedValueOnce(Response.json({ configured: true, publicKey: "AQID" }));
    const renewed = { endpoint: "https://web.push.apple.com/new", toJSON: () => ({}) };
    w.registration.pushManager.subscribe.mockResolvedValue(renewed);
    const event = { oldSubscription: null, newSubscription: null, waitUntil: vi.fn() };
    w.events.get("pushsubscriptionchange")!(event);
    await settle(event);
    const [{ applicationServerKey }] = w.registration.pushManager.subscribe.mock.calls[0];
    expect([...applicationServerKey]).toEqual([1, 2, 3]);
    expect(w.fetch.mock.calls[1][1]).toMatchObject({ method: "POST" });
  });
});
