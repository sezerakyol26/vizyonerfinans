/**
 * Vizyoner Finans Mobil - Offline First Service Worker
 * %100 Çevrimdışı Çalışma, Akıllı Önbellekleme ve GitHub Pages Uyumluluğu
 */

const CACHE_NAME = 'vizyoner-mobile-v1.0.0';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './mobile.css',
  './app.js',
  './mobile-adapter.js',
  './synced_data.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './vendor/lucide.min.js',
  './vendor/chart.umd.min.js',
  './vendor/confetti.browser.min.js',
  './vendor/pdf.min.js',
  './vendor/xlsx.full.min.js',
  './vendor/fonts/fonts.css',
  './vendor/fonts/Inter-Regular.woff2',
  './vendor/fonts/Inter-Medium.woff2',
  './vendor/fonts/Inter-SemiBold.woff2',
  './vendor/fonts/Inter-Bold.woff2',
  './vendor/fonts/Inter-ExtraBold.woff2'
];

// 1. Install & Cache All Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Vizyoner SW] Mobil varlıklar önbelleğe alınıyor...');
      // addAll can fail if a font file is missing, so fetch individually gracefully
      return Promise.allSettled(
        ASSETS_TO_CACHE.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[Vizyoner SW] Önbelleğe alınamadı (${url}):`, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate & Clean Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Vizyoner SW] Eski önbellek siliniyor:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Strategy: Stale-While-Revalidate with Offline Fallback
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET requests or chrome-extension URLs
  if (req.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // API calls are handled via local adapter if offline
  if (url.pathname.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache (revalidate)
        fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, networkResponse));
          }
        }).catch(() => {
          // Offline, cached is fine
        });
        return cachedResponse;
      }

      // If not in cache, fetch from network and store
      return fetch(req).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(req, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Offline fallback for navigation
        if (req.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
