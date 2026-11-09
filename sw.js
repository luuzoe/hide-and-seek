const CACHE = 'hs-v73';
const SHELL = ['./', 'index.html', 'manifest.json', 'js/three.module.js', 'js/peerjs.min.js', 'js/addons/loaders/GLTFLoader.js', 'js/addons/utils/BufferGeometryUtils.js', 'js/addons/utils/SkeletonUtils.js'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then((hit) => {
    if (hit) return hit;
    return fetch(e.request).then((res) => {
      if (res && res.ok && new URL(e.request.url).origin === self.location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
      }
      return res;
    }).catch(() => {
      if (e.request.mode === 'navigate') return caches.match('index.html');
      throw new Error('offline');
    });
  }));
});
