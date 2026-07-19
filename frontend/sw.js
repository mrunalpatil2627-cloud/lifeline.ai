// LifeLine AI service worker
// Goal: the app shell + hardcoded first-aid data must work with ZERO network,
// because emergencies often happen with bad or no signal.

const CACHE_NAME = "lifeline-ai-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/icons.js",
  "./js/translations.js",
  "./js/emergencyData.js",
  "./js/api.js",
  "./js/voice.js",
  "./js/app.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Never cache/interfere with calls to our AI backend — those must always hit the network.
  if (url.pathname.startsWith("/api/")) return;

  // App shell: cache-first, so it loads instantly and works offline.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request)
          .then((response) => {
            if (response.ok && event.request.method === "GET") {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => cached)
      );
    })
  );
});
