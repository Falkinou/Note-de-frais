"use strict";
const CACHE = "stampfel-v1.10.1";
const ROOT = new URL("./", self.location.href);
const SHELL = ["./", "index.html", "app.js", "app.css", "receipt.js", "stamp-renderer.js", "ocr.js", "export-file.js", "counters.js", "pdf-import.js",
  "image-processing.js", "image-tools.js", "image-worker.js", "document-analysis.js", "pdf-export.js", "local-store.js", "receipt-viewer.js", "manifest.webmanifest", "assets/icon-180.png", "assets/icon-192.png", "assets/icon-512.png"];
const shellURLs = new Set(SHELL.map(file => new URL(file, ROOT).href));
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if ((key.startsWith("stampfel-") || key === "ndf-v1") && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== ROOT.origin) return;
  const isVendor = url.pathname.startsWith(new URL("vendor/", ROOT).pathname);
  if (!shellURLs.has(url.href) && !isVendor && request.mode !== "navigate") return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok && response.type === "basic") await cache.put(request, response.clone());
      return response;
    } catch (error) {
      if (request.mode === "navigate") {
        const home = await cache.match(new URL("index.html", ROOT).href);
        if (home) return home;
      }
      throw error;
    }
  })());
});
