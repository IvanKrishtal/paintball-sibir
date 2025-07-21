const CACHE_NAME = 'paintball-sibir-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/equipment.html',
  '/field.html',
  '/advantages.html',
  '/feedback.html',
  '/images/main.jpg',
  '/images/advantages1.jpg',
  '/images/advantages2.jpg',
  '/images/advantages3.jpg',
  '/images/advantages4.jpg',
  '/images/advantages5.jpg',
  '/images/equipment1.jpg',
  '/images/equipment2.jpg',
  '/images/equipment3.jpg',
  '/images/equipment4.jpg',
  '/images/equipment5.jpg',
  '/images/equipment6.jpg',
  '/images/field1.jpg',
  '/images/field2.jpg',
  '/images/field3.jpg',
  '/images/field4.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
