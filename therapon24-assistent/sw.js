/* ===========================================================================
   Service Worker — macht die App offline nutzbar.
   Wichtig für den Schulalltag: in vielen Schulgebäuden ist der Empfang
   schlecht, die Antworten müssen trotzdem da sein.

   Beim Ausrollen einer neuen Version die VERSION hochzählen — dann wird der
   alte Zwischenspeicher verworfen.
   =========================================================================== */

const VERSION = "t24-v1";
const DATEIEN = [
  "./",
  "./index.html",
  "./admin.html",
  "./css/theme.css",
  "./css/app.css",
  "./js/config.js",
  "./js/wissen.js",
  "./js/engine.js",
  "./js/app.js",
  "./img/logo.svg",
  "./img/logo-dark.svg",
  "./img/icon.svg",
  "./manifest.webmanifest"
];

self.addEventListener("install", (ev) => {
  ev.waitUntil(
    caches.open(VERSION)
      .then((c) => c.addAll(DATEIEN))
      .then(() => self.skipWaiting())
      .catch(() => { /* einzelne Datei fehlt: Installation trotzdem zulassen */ })
  );
});

self.addEventListener("activate", (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((namen) => Promise.all(
        namen.filter((n) => n !== VERSION).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (ev) => {
  const url = new URL(ev.request.url);

  /* Der KI-Endpunkt darf nie aus dem Zwischenspeicher kommen. */
  if (url.pathname.startsWith("/api/")) return;
  if (ev.request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  /* Netz zuerst (damit Inhaltsänderungen sofort ankommen),
     bei Netzfehler aus dem Zwischenspeicher. */
  ev.respondWith(
    fetch(ev.request)
      .then((antwort) => {
        const kopie = antwort.clone();
        caches.open(VERSION).then((c) => c.put(ev.request, kopie)).catch(() => {});
        return antwort;
      })
      .catch(() => caches.match(ev.request).then((t) => t || caches.match("./index.html")))
  );
});
