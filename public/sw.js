// Bump the version when caching rules change: activate deletes every other
// "vani-static-*" cache, including assets pinned by older workers.
const CACHE_PREFIX = "vani-static-";
const CACHE_NAME = "vani-static-v5";
const OFFLINE_URL = "/offline";
const PUBLIC_PRECACHE = [
  "/manifest.webmanifest",
  "/icons/vani-photo-192.png",
  "/icons/vani-photo-512.png",
];
// Hashed build assets accumulate across deploys; keep only the newest ones.
const MAX_CACHE_ENTRIES = 150;
// sw.js is identical across deploys, so the worker rarely reinstalls. Refresh
// the offline fallback periodically so it does not stay pinned to an old build.
const OFFLINE_REFRESH_INTERVAL_MS = 6 * 60 * 60 * 1000;
const CACHED_AT_HEADER = "x-vani-cached-at";
const SUBSCRIPTION_API = "/api/push/subscription";

function isImmutableBuildAsset(path) {
  return (
    path.startsWith("/_next/static/") &&
    !path.includes(".hot-update.") &&
    /(?:^|[.-])[a-f0-9]{8,}(?:[.-]|$)/i.test(path.split("/").pop())
  );
}

function rootUrl() {
  return new URL("/", self.location.origin).href;
}

/** Hashed scripts, styles and fonts the offline HTML needs to render. */
function offlineAssetPaths(html) {
  const assets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1].replace(/&amp;/g, "&"))
    .filter(isImmutableBuildAsset);
  return [...new Set(assets)];
}

function pathOf(url) {
  return new URL(url, self.location.origin).pathname;
}

// ---------------------------------------------------------------------------
// Static cache size limit (oldest entries first; Cache API keeps insertion order)

let trimQueue = Promise.resolve();

async function trimStaticCache() {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  if (keys.length <= MAX_CACHE_ENTRIES) return;
  // Never evict the offline fallback or the files it needs to render.
  const keep = new Set([OFFLINE_URL, ...PUBLIC_PRECACHE]);
  const offline = await cache.match(OFFLINE_URL);
  if (offline) {
    for (const asset of offlineAssetPaths(await offline.text())) keep.add(pathOf(asset));
  }
  let excess = keys.length - MAX_CACHE_ENTRIES;
  for (const key of keys) {
    if (excess <= 0) break;
    if (keep.has(pathOf(key.url))) continue;
    await cache.delete(key);
    excess -= 1;
  }
}

function scheduleTrim() {
  trimQueue = trimQueue.then(trimStaticCache).catch(() => undefined);
  return trimQueue;
}

async function putStatic(request, response) {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
  await scheduleTrim();
}

// ---------------------------------------------------------------------------
// Offline fallback page

/** Stores a fresh /offline response after its assets, so the cached page never references missing files. */
async function storeOfflinePage(response) {
  if (!response.ok || response.redirected) throw new Error("offline page unavailable");
  const html = await response.text();
  const cache = await caches.open(CACHE_NAME);
  const missing = [];
  for (const asset of offlineAssetPaths(html)) {
    if (!(await cache.match(asset))) missing.push(asset);
  }
  if (missing.length) await cache.addAll(missing);
  const headers = new Headers(response.headers);
  headers.set(CACHED_AT_HEADER, String(Date.now()));
  await cache.put(
    OFFLINE_URL,
    new Response(html, { status: response.status, statusText: response.statusText, headers }),
  );
}

async function refreshOfflinePage() {
  await storeOfflinePage(await fetch(OFFLINE_URL, { cache: "no-store", credentials: "same-origin" }));
  await scheduleTrim();
}

let offlineRefresh;

async function maybeRefreshOfflinePage() {
  const cached = await caches.match(OFFLINE_URL);
  const cachedAt = Number(cached?.headers.get(CACHED_AT_HEADER) ?? 0);
  if (cached && Date.now() - cachedAt < OFFLINE_REFRESH_INTERVAL_MS) return;
  offlineRefresh ??= refreshOfflinePage()
    .catch(() => undefined)
    .finally(() => {
      offlineRefresh = undefined;
    });
  return offlineRefresh;
}

function cachedOfflinePage() {
  return caches.match(OFFLINE_URL);
}

// ---------------------------------------------------------------------------
// Lifecycle

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(PUBLIC_PRECACHE);
      await storeOfflinePage(
        await fetch(OFFLINE_URL, { cache: "no-store", credentials: "same-origin" }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
      await maybeRefreshOfflinePage().catch(() => undefined);
      await scheduleTrim();
    })(),
  );
});

// ---------------------------------------------------------------------------
// Fetch: HTML navigations are network-only (except /offline), /api/* is never touched.

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/"))
    return;

  if (request.mode === "navigate") {
    if (url.pathname === OFFLINE_URL) {
      // Network-first so the fallback follows the current build when online.
      event.respondWith(
        fetch(request)
          .then((response) => {
            if (response.ok && !url.search) {
              event.waitUntil(storeOfflinePage(response.clone()).catch(() => undefined));
            }
            return response;
          })
          .catch(() => cachedOfflinePage()),
      );
      return;
    }
    event.respondWith(
      fetch(request)
        .then((response) => {
          event.waitUntil(maybeRefreshOfflinePage().catch(() => undefined));
          return response;
        })
        .catch(() => cachedOfflinePage()),
    );
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    // Dev chunk URLs do not change after edits. Never serve them from a cache,
    // even if a previous worker cached an old version at that same URL.
    if (!isImmutableBuildAsset(url.pathname)) return;
    event.respondWith(
      caches.match(request).then(async (cached) => {
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) {
          event.waitUntil(putStatic(request, response.clone()).catch(() => undefined));
        }
        return response;
      }),
    );
    return;
  }

  const isPublicAsset =
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/manifest.webmanifest";
  if (!isPublicAsset) return;
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          event.waitUntil(putStatic(request, response.clone()).catch(() => undefined));
        }
        return response;
      })
      .catch(() => caches.match(request)),
  );
});

self.addEventListener("sync", (event) => {
  if (event.tag !== "vani-offline-sync") return;
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients)
          client.postMessage({ type: "SYNC_OFFLINE_QUEUE" });
      }),
  );
});

// ---------------------------------------------------------------------------
// Push

/** Notification links must stay inside the app. */
function sameOriginUrl(value) {
  try {
    const url = new URL(typeof value === "string" && value ? value : "/", self.location.origin);
    return url.origin === self.location.origin ? url.href : rootUrl();
  } catch {
    return rootUrl();
  }
}

function readPushData(data) {
  if (!data) return {};
  try {
    const value = data.json();
    if (value && typeof value === "object") return value;
    return value == null ? {} : { body: String(value) };
  } catch {
    try {
      const text = data.text();
      return text ? { body: text } : {};
    } catch {
      return {};
    }
  }
}

self.addEventListener("push", (event) => {
  const data = readPushData(event.data);
  event.waitUntil(
    self.registration.showNotification(
      typeof data.title === "string" && data.title ? data.title : "Vani Family",
      {
        body:
          typeof data.body === "string" && data.body
            ? data.body
            : "Bạn có một lịch cần kiểm tra.",
        icon: "/icons/vani-photo-192.png",
        badge: "/icons/vani-photo-192.png",
        tag: typeof data.tag === "string" ? data.tag : undefined,
        data: { url: sameOriginUrl(data.url) },
      },
    ),
  );
});

async function openNotificationTarget(value) {
  const target = sameOriginUrl(value);
  const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  const sameOrigin = windows.filter((client) => {
    try {
      return new URL(client.url).origin === self.location.origin;
    } catch {
      return false;
    }
  });
  const client =
    sameOrigin.find((item) => item.url === target) ??
    sameOrigin.find((item) => item.focused) ??
    sameOrigin[0];
  if (!client) {
    await self.clients.openWindow(target);
    return;
  }
  const focused = (await client.focus().catch(() => null)) ?? client;
  if (focused.url === target) return;
  try {
    // Only works for pages controlled by this worker.
    await focused.navigate(target);
  } catch {
    focused.postMessage({ type: "OPEN_URL", url: target });
  }
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(openNotificationTarget(event.notification.data?.url));
});

function base64UrlToBytes(value) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
}

async function vapidKey(oldSubscription) {
  const fromOld = oldSubscription?.options?.applicationServerKey;
  if (fromOld) return fromOld;
  const response = await fetch(SUBSCRIPTION_API, { credentials: "same-origin" });
  if (!response.ok) return null;
  const body = await response.json().catch(() => null);
  return typeof body?.publicKey === "string" && body.publicKey
    ? base64UrlToBytes(body.publicKey)
    : null;
}

function sendSubscription(method, body) {
  return fetch(SUBSCRIPTION_API, {
    method,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** The push service rotated or expired this device's subscription: subscribe again and tell the server. */
async function renewPushSubscription(oldSubscription, newSubscription) {
  let subscription =
    newSubscription ?? (await self.registration.pushManager.getSubscription());
  if (!subscription) {
    const applicationServerKey = await vapidKey(oldSubscription);
    if (!applicationServerKey) return;
    subscription = await self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });
  }
  await sendSubscription("POST", subscription.toJSON());
  const oldEndpoint = oldSubscription?.endpoint;
  if (oldEndpoint && oldEndpoint !== subscription.endpoint) {
    await sendSubscription("DELETE", { endpoint: oldEndpoint }).catch(() => undefined);
  }
}

self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    renewPushSubscription(event.oldSubscription, event.newSubscription).catch(
      () => undefined,
    ),
  );
});
