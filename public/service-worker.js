const CACHE_NAME = 'auctus-pwa-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './src/main.tsx',
  './manifest.json',
  './favicon.svg',
  // CSS and JS will be cached automatically by Vite build
  // We'll cache the built assets
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
    .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, falling back to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests (like to Vite dev server)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if found, otherwise fetch from network
        return cachedResponse || fetch(event.request).then(networkResponse => {
          // Cache successful requests for future use
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
      .catch(() => {
        // If both cache and network fail, show offline fallback
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return Response.error();
      })
  );
});

// Optional: Handle push notifications (placeholder for future implementation)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'You have a new notification from Auctus',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png'
  };
  
  event.waitUntil(
    self.registration.showNotification('Auctus', options)
  );
});

// Optional: Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Focus existing window or open new one
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(windowClients => {
      // Check if there's already a window/tab open with our URL
      for (let client of windowClients) {
        if (client.url === './' && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window/tab is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});