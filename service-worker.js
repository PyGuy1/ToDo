const CACHE_NAME = "todo-pwa-v3";

const PRECACHE_ASSETS = [
  "/",
  "/app.html",
  "/manifest.json",
  "/ToDo.png"
];

// --------------------
// INSTALL
// --------------------
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => 
      cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.error("Precache failed:", err);
      })
    )
  );
  self.skipWaiting();
});

// --------------------
// ACTIVATE
// --------------------
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// --------------------
// FETCH
// --------------------
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  // Navigation requests (page loads)
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("/app.html").then(cached =>
        cached || fetch(event.request)
      )
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });
        }
        return response;
      });
    })
  );
});
