const CACHE_NAME = "todo-pwa-v1.5";

const PRECACHE_ASSETS = [
  "./",
  "./app.html",
  "./manifest.json",
  "./ToDo.png",
  "./static/css/tailwind.css",
  "./static/js/main.4a82c912.js"
];

// INSTALL
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS))
  );
});

// ACTIVATE
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(res => {
        if (
          res.status === 200 &&
          event.request.url.startsWith(self.location.origin)
        ) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache =>
            cache.put(event.request, clone)
          );
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
