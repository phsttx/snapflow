/* ==========================================================================
   SnapFlow - Progressive Web App Service Worker (100% Offline Cache)
   ========================================================================== */

const CACHE_NAME = 'snapflow-pwa-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/favicon.svg',
  './css/main.css',
  './css/glass.css',
  './css/components.css',
  './js/jszip.min.js',
  './js/utils.js',
  './js/preset-manager.js',
  './js/compressor.js',
  './js/mockup-studio.js',
  './js/cropper.js',
  './js/bg-remover.js',
  './js/svg-studio.js',
  './js/audio-waveform.js',
  './js/pdf-studio.js',
  './js/upscaler.js',
  './js/favicon-generator.js',
  './js/watermark.js',
  './js/qrcode.js',
  './js/color-extractor.js',
  './js/pattern-generator.js',
  './js/css-effects.js',
  './js/svg-pattern.js',
  './js/exif-cleaner.js',
  './js/frame-extractor.js',
  './js/custom-color-picker.js',
  './js/stellar-bg.js',
  './js/app.js'
];

// Install Event - Cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching static assets for offline use...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[ServiceWorker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Serve from cache first, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
