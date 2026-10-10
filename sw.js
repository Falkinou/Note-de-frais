'use strict';
importScripts('./offline-assets.js');
const MANIFEST = self.STAMPFEL_OFFLINE;
const ROOT = new URL('./', self.location.href);
// Content-addressed resources are reused across releases, including the 19 MB engines.
const CACHE = 'stampfel-assets-v1';
const assets = MANIFEST.assets.map(asset => ({ ...asset, url: new URL(asset.path, ROOT).href, key: new URL('__offline__/' + asset.sha256, ROOT).href }));
const byURL = new Map(assets.map(asset => [asset.url, asset]));
const total = assets.reduce((sum, asset) => sum + asset.size, 0);
let preparation;
async function broadcast(status, completed = 0) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  clients.forEach(client => client.postMessage({ type: 'OFFLINE_STATUS', version: MANIFEST.version, status, completed, total }));
}
async function download(cache, asset) {
  const response = await fetch(new Request(asset.url, { cache: 'reload' }));
  if (!response.ok) throw new Error('Resource unavailable');
  const buffer = await response.clone().arrayBuffer();
  const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', buffer)), byte => byte.toString(16).padStart(2, '0')).join('');
  if (digest !== asset.sha256) throw new Error('Resource version mismatch');
  await cache.put(asset.key, response);
}
async function prepare() {
  if (preparation) return preparation;
  preparation = (async () => {
    const cache = await caches.open(CACHE); let completed = 0, index = 0, failure;
    await broadcast('preparing');
    await Promise.all(Array.from({ length: 3 }, async () => {
      while (!failure && index < assets.length) {
        const asset = assets[index++];
        try { if (!await cache.match(asset.key)) await download(cache, asset); }
        catch (error) { failure = error; return; }
        completed += asset.size; await broadcast('preparing', completed);
      }
    }));
    if (failure) throw failure;
    await broadcast('ready', total);
  })().catch(async error => { await broadcast('error'); throw error; }).finally(() => { preparation = null; });
  return preparation;
}
self.addEventListener('install', event => {
  // The previous version stays active if even one required resource fails.
  event.waitUntil(prepare().then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    await self.clients.claim();
    for (const name of await caches.keys()) if ((name.startsWith('stampfel-') || name === 'ndf-v1') && name !== CACHE) await caches.delete(name);
    const cache = await caches.open(CACHE), keep = new Set(assets.map(asset => asset.key));
    for (const request of await cache.keys()) if (!keep.has(request.url)) await cache.delete(request);
    await broadcast('ready', total);
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'PREPARE_OFFLINE') event.waitUntil(prepare().catch(() => {}));
  if (event.data?.type === 'OFFLINE_STATUS') event.waitUntil((async () => {
    const cache = await caches.open(CACHE); let completed = 0;
    for (const asset of assets) if (await cache.match(asset.key)) completed += asset.size;
    await broadcast(completed === total ? 'ready' : 'incomplete', completed);
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== ROOT.origin) return;
  if (url.pathname === ROOT.pathname) url.pathname += 'index.html';
  url.search = '';
  const asset = byURL.get(url.href);
  // Documents, counter requests and other paths never enter this cache.
  if (!asset) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE), cached = await cache.match(asset.key);
    if (cached) return cached;
    try { await download(cache, asset); return await cache.match(asset.key); }
    catch (error) { await broadcast('incomplete'); throw error; }
  })());
});
