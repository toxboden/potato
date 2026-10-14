/* Potato service worker — the app works offline after the first visit */
const VERSION = "potato-20261014-1102";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png", "./icons/apple-touch-icon.png"];
/* A redirected response (e.g. host sends /index.html -> /) must never be served to a navigation: the browser refuses it (ERR_FAILED). Rebuild it as a plain response first. */
const clean = async r => (r && r.redirected) ? new Response(await r.blob(), {status: r.status, statusText: r.statusText, headers: r.headers}) : r;
const grab = async (c, u) => { const r = await fetch(u, {cache: "reload"}); if(!r.ok) throw new Error("precache " + u); await c.put(u, await clean(r)); };
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => Promise.all(SHELL.map(u => grab(c, u)))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if(e.request.method !== "GET") return;
  const isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if(url.origin !== location.origin && !isFont) return;
  e.respondWith(caches.open(VERSION).then(async c => {
    /* opening the app (any address, with or without ?query): always answer with the one cached page, refresh it in the background */
    if(e.request.mode === "navigate"){
      const shell = (await c.match("./index.html")) || (await c.match("./"));
      e.waitUntil(fetch("./index.html", {cache: "no-cache"}).then(async r => { if(r.ok) await c.put("./index.html", await clean(r)); }).catch(() => {}));
      if(shell) return shell;
      try{ return await fetch(e.request); }catch(err){ return new Response("Offline", {status: 503, headers: {"Content-Type": "text/plain"}}); }
    }
    /* everything else: stale-while-revalidate */
    const cached = await c.match(e.request, {ignoreSearch: url.origin === location.origin});
    const net = fetch(e.request).then(async r => { if(r && (r.ok || r.type === "opaque")) c.put(e.request, (await clean(r.clone()))); return r; }).catch(() => null);
    if(cached) return cached;
    const r = await net;
    return r || new Response("", {status: 504});
  }));
});
