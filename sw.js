const CACHE = 'ottoman-studio-v21';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon.svg', './fonts/aref-ruqaa.woff2', './fonts/noto-naskh.woff2', './fonts/noto-naskh-bold.woff2', './vendor/pdf.min.js', './vendor/pdf.worker.min.js'];

self.addEventListener('install', event => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  await Promise.all(CORE.map(async url => {
    try {
      const request = new Request(new URL(url, self.location.href), { cache: 'reload' });
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response);
    } catch (_) { /* çevrimdışı kurulumda eksik kalan dosya sonra önbelleğe girer */ }
  }));
  await self.skipWaiting();
})()));

self.addEventListener('activate', event => event.waitUntil((async () => {
  const keys = await caches.keys();
  await Promise.all(keys.filter(k => k.startsWith('ottoman-studio-') && k !== CACHE).map(k => caches.delete(k)));
  await self.clients.claim();
})()));

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;
  const isShell = req.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/');
  if (isShell) {
    event.respondWith(fetch(req, { cache: 'no-store' }).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
