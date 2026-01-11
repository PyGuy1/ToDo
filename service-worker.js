const CACHE_NAME = "todo-pwa-v1";
const ASSETS = [
  "./",
  "./app.html",
  "./ToDo.png",
  "./manifest.json",
  "./static/css/tailwind.css",
  "./static/js/main.4a82c912.js"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
