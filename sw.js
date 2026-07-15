const ONBELLEK = 'kpss-tarih-v2';
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

  // Her şey her zaman ağdan taze çekilsin (index.html dahil); sadece
  // ağ yoksa (çevrimdışıyken) önbellekten dönsün. Böylece yeni bir
  // değişiklik push'landığında bir sonraki açılışta hemen görünür.
  e.respondWith(
    fetch(e.request)
      .then((yanit) => {
        const kopya = yanit.clone();
        caches.open(ONBELLEK).then((c) => c.put(e.request, kopya));
        return yanit;
      })
      .catch(() => caches.match(e.request))
  );
});
