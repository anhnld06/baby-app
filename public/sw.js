const CACHE_NAME = "vani-static-v4";
const PRECACHE = [
  "/offline",
  "/manifest.webmanifest",
  "/icons/vani-photo-192.png",
  "/icons/vani-photo-512.png",
];

function isImmutableBuildAsset(path) {
  return (
    path.startsWith("/_next/static/") &&
    !path.includes(".hot-update.") &&
    /(?:^|[.-])[a-f0-9]{8,}(?:[.-]|$)/i.test(path.split("/").pop())
  );
}

async function precacheOffline() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(PRECACHE);
  // The offline HTML also needs its scripts, stylesheet and font to render on a fresh offline visit.
  // Only the public static fallback and immutable build assets are cached, never health pages or APIs.
  const response = await cache.match("/offline");
  const html = await response.text();
  const assets = [...html.matchAll(/(?:src|href)="([^\"]+)"/g)]
    .map((match) => match[1])
    .filter(isImmutableBuildAsset);
  await cache.addAll([...new Set(assets)]);
}

self.addEventListener("install", (event) => {
  event.waitUntil(precacheOffline().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) => key.startsWith("vani-static-") && key !== CACHE_NAME,
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/"))
    return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match("/offline")));
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
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
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
      .then(async (response) => {
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
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

self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title ?? "Vani Family", {
      body: data.body ?? "Bạn có một lịch cần kiểm tra.",
      icon: "/icons/vani-photo-192.png",
      badge: "/icons/vani-photo-192.png",
      tag: data.tag,
      data: { url: data.url ?? "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data?.url ?? "/"));
});
