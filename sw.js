const CACHE_NAME = 'radio-v2';

const ASSETS = [
  '/',
  '/index.html',
  '/logo.png',
  '/background.jpg',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  const url = e.request.url;

  // ❌ Ne pas intercepter certaines requêtes (stream + compteur)
  if (
    url.includes('212.84.160.3') ||        // ton serveur radio
    url.includes('allorigins.win')         // proxy compteur
  ) {
    return; // laisse passer sans cache
  }

  // ✅ cache seulement tes fichiers
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
