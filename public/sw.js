const CACHE_NAME = 'tawakal-bbq-static-v2';
const DYNAMIC_CACHE = 'tawakal-bbq-dynamic-v2';
const OFFLINE_URL = '/offline';
const SW_VERSION = 'v1.3.0-push-debug';

// Service Worker In-Memory Push Diagnostics
let swPushDiagnostics = {
  swVersion: SW_VERSION,
  pushCount: 0,
  lastTimestamp: 'None',
  lastPayload: 'None',
  lastStatus: 'No push received yet',
  lastError: 'None',
};

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
  console.log(`[SW] Installing Service Worker ${SW_VERSION}...`);
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activating Service Worker ${SW_VERSION}...`);
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

// Message Event Listener for SW Diagnostics
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_SW_DIAGNOSTICS') {
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage({
        type: 'SW_DIAGNOSTICS_RESPONSE',
        diagnostics: swPushDiagnostics,
      });
    }
  }
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

// Cache size limit helper function to prevent unbounded dynamic cache growth
function trimCache(cacheName, maxItems) {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > maxItems) {
        cache.delete(keys[0]).then(() => trimCache(cacheName, maxItems));
      }
    });
  });
}

// Customer API requests (menu, deals, delivery-areas, branches) -> Network-First (Live data always prioritized)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
              trimCache(DYNAMIC_CACHE, 50);
            });
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
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
              trimCache(DYNAMIC_CACHE, 50);
            });
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

// Push Event Listener for Admin Order Notifications
self.addEventListener('push', (event) => {
  const promise = (async () => {
    let payload = {};

    try {
      if (event.data) {
        try {
          payload = event.data.json();
        } catch {
          payload = { body: event.data.text() };
        }
      }

      const title = payload.title || '🔔 Tawakal BBQ';
      const options = {
        body: payload.body || 'New notification',
        icon: payload.icon || '/icon-192.png',
        badge: payload.badge || '/icon-192.png',
        data: {
          url: payload.url || '/admin/orders',
        },
        tag: payload.tag || `tawakal-${Date.now()}`,
      };

      console.log('[SW PUSH] Received push payload:', payload);
      console.log('[SW PUSH] Showing notification...');

      await self.registration.showNotification(title, options);

      console.log('[SW PUSH] showNotification SUCCESS');

      swPushDiagnostics.pushCount++;
      swPushDiagnostics.lastTimestamp = new Date().toLocaleTimeString();
      swPushDiagnostics.lastPayload = JSON.stringify(payload);
      swPushDiagnostics.lastStatus = 'showNotification SUCCESS';
      swPushDiagnostics.lastError = 'None';
    } catch (error) {
      console.error('[SW PUSH] FAILED:', error?.name, error?.message);
      swPushDiagnostics.lastStatus = 'showNotification FAILED';
      swPushDiagnostics.lastError = `${error?.name || 'Error'}: ${error?.message || String(error)}`;
      throw error;
    }
  })();

  event.waitUntil(promise);
});

// Notification Click Event Listener
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/admin/orders';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/admin') && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
