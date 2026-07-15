const ONBELLEK = 'kpss-tarih-v1';
const KABUK = ['./', './index.html', './manifest.json', './ikonlar/icon-192.png', './ikonlar/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(ONBELLEK).then((c) => c.addAll(KABUK)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((isimler) => Promise.all(isimler.filter((i) => i !== ONBELLEK).map((i) => caches.delete(i))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  if (e.request.url.includes('data.json')) {
    // veri her zaman ağdan taze çekilsin, sadece ağ yoksa önbellekten dönsün
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((yanit) => yanit || fetch(e.request))
  );
});
