const STATIC_CACHE = 'alphaterminal-static-v1';
const DATA_CACHE = 'alphaterminal-data-v1';
const STATIC_ASSETS = [
  './','./index.html','./404.html','./manifest.json','./css/app.css','./js/app.js','./js/store.js','./js/data.js','./js/charts.js','./js/notifications.js',
  './pages/dashboard.html','./pages/analyse.html','./pages/signaux.html','./pages/inventaire.html','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable.png',
  'https://cdn.jsdelivr.net/npm/chart.js'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => ![STATIC_CACHE, DATA_CACHE].includes(key)).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
async function networkFirst(request) {
  const cache = await caches.open(DATA_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    return (await cache.match(request)) || new Response(JSON.stringify({ offline: true }), { headers: { 'Content-Type': 'application/json' } });
  }
}
async function staleWhileRevalidate(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  const fetched = fetch(request).then(response => { if (response.ok) cache.put(request, response.clone()); return response; }).catch(() => cached);
  return cached || fetched;
}
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.hostname.includes('finance.yahoo.com') || url.hostname.includes('allorigins.win')) event.respondWith(networkFirst(event.request));
  else if (event.request.method === 'GET') event.respondWith(staleWhileRevalidate(event.request));
});
