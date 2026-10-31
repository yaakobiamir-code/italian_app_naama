// Service worker: האפליקציה נטענת ועובדת גם בלי אינטרנט (התרגול היומי). AI דורש חיבור.
const VERSION = 'naama-v1';
const FILES = [
  './', 'index.html', 'help.html', 'css/style.css', 'manifest.webmanifest',
  'js/app.js', 'js/data.js', 'js/base.js', 'js/srs.js', 'js/store.js', 'js/ai.js', 'js/speech.js',
  'vendor/anthropic-sdk-1.3.0.js', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'resources.html',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// קודם רשת (כדי לקבל עדכונים), ואם אין – מהמטמון
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then((r) => {
      const copy = r.clone();
      caches.open(VERSION).then((c) => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('index.html')))
  );
});
