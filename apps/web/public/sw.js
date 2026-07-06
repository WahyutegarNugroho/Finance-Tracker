const CACHE_NAME = 'fintrack-v2';
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/transactions',
  '/budget',
  '/analytics',
  '/settings',
  '/login',
  '/register',
  '/offline.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // ponytail: silent catch → log to console.warn when debugging SW install failures
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only cache GET requests
  if (request.method !== 'GET') return;

  // Never cache API responses (financial data)
  if (request.url.includes('/api/')) return;

  // Do not intercept cross-origin requests (e.g. Google Auth APIs, external fonts)
  // This prevents the SW from applying outdated CSP headers to them
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  // Navigation: network-first, fallback to cache, then offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then((cached) => cached || caches.match('/offline.html'))
      )
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      });
    })
  );
});
