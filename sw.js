/* ==========================================================================
   SnapFlow - Progressive Web App Service Worker (v18 Live Network-First)
   ========================================================================== */

const CACHE_NAME = 'snapflow-pwa-v18';

// Install Event - Força atualização imediata
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate Event - Limpa todos os caches antigos imediatamente
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SnapFlow ServiceWorker] Apagando cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Estratégia Network-First (Pega sempre do Netlify primeiro!)
self.addEventListener('fetch', (event) => {
  // Ignora requisições de outras origens ou do Supabase/Google
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Se pegou do servidor com sucesso, atualiza o cache e devolve
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Se estiver 100% offline sem internet, aí sim usa o cache
        return caches.match(event.request);
      })
  );
});
