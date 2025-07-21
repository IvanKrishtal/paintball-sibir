const CACHE_NAME = 'paintball-sibir-v2';
const OFFLINE_URL = '/offline.html';  // Путь к оффлайн-странице
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon-192x192.png',  // Основная иконка для кэша
  '/icons/icon-512x512.png',  // Иконка для splash-экрана
  '/images/main.jpg'          // Главное изображение
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Кэширование ресурсов');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  // Пропускаем запросы к API и внешние ресурсы
  if (event.request.url.includes('/api/') || 
      event.request.url.startsWith('http')) {
    return fetch(event.request);
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // Оффлайн-страница для HTML-запросов
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match(OFFLINE_URL);
          }
        });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});
