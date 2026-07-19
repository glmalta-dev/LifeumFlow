const CACHE_NAME = "lifeum-flow-static-v3";
const STATIC_ASSETS = ["/icon.svg", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || !event.request.url.startsWith(self.location.origin)) return;
  const requestUrl = new URL(event.request.url);
  if (!STATIC_ASSETS.includes(requestUrl.pathname)) return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { body: event.data ? event.data.text() : "Voce tem uma nova atualizacao." };
  }

  const title = payload.title || "Lifeum Flow";
  event.waitUntil(self.registration.showNotification(title, {
    body: payload.body || "Voce tem uma nova atualizacao.",
    icon: "/icon.svg",
    badge: "/icon.svg",
    tag: payload.tag || "lifeum-flow",
    renotify: true,
    vibrate: [200, 100, 200],
    data: { url: payload.url || "/alertas" },
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const requestedPath = event.notification.data?.url || "/alertas";
  const targetUrl = new URL(requestedPath, self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(async (clients) => {
      for (const client of clients) {
        if (new URL(client.url).origin === self.location.origin) {
          await client.navigate(targetUrl);
          return client.focus();
        }
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
