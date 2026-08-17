const CACHE_NAME = 'tawakal-bbq-static-v1';
const DYNAMIC_CACHE = 'tawakal-bbq-dynamic-v1';
const OFFLINE_URL = '/offline';

// Static core assets to precache safely
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.webmanifest',
  '/logo.png',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME && key !== DYNAMIC_CACHE) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Never handle non-GET requests (POST, PUT, DELETE) - always network direct
  if (request.method !== 'GET') {
    return;
  }

  // 2. CRITICAL SECURITY: Never intercept or cache admin routes or admin API endpoints
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/admin')) {
    return;
  }

  // 3. Sensitive / Mutation / Auth endpoints - bypass SW cache completely
  if (
    url.pathname.startsWith('/api/orders') ||
    url.pathname.startsWith('/api/reservations') ||
    url.pathname.startsWith('/api/coupons')
  ) {
    return;
  }

  // 4. Customer API requests (menu, deals, delivery-areas, branches) -> Network-First (Live data always prioritized)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // 5. HTML Navigation requests -> Network-First, with Offline Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // 6. Static assets (Images, CSS, JS, Fonts) -> Cache-First with Network Fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Asynchronously update cache in background
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && url.origin === location.origin) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      });
    })
  );
});
