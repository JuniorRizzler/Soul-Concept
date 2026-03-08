const CACHE_NAME = "soulconcept-v73";
const ASSETS = [
  "/",
  "/index.html",
  "/about.html",
  "/contact.html",
  "/services.html",
  "/subjects.html",
  "/work.html",
  "/geography-library.html",
  "/study-library.html",
  "/grade-10-math.html",
  "/math/index.html",
  "/math-quiz-simulator.html",
  "/math/auto-quiz.html",
  "/anki/index.html",
  "/styles.css",
  "/app.js",
  "/auth-config.js",
  "/auth-guard.js",
  "/library-whiteboard.js",
  "/auth/callback.html",
  "/manifest.json",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  "/images/geography/ocean-banks.png",
  "/images/geography/fish-types.png",
  "/images/geography/cod-collapse.png",
  "/images/geography/drainage-basin.png",
  "/images/geography/energy-mix.png",
  "/images/geography/electricity-consumption.png",
  "/offline.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.pathname === "/supabase-config.json") {
    event.respondWith(fetch(req));
    return;
  }
  const isSameOrigin = url.origin === self.location.origin;
  const isHTML = req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");

  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match("/offline.html")))
    );
    return;
  }

  // Always try network first for frequently updated app bundles.
  if (
    isSameOrigin &&
    (
      url.pathname === "/math/math.bundle.js" ||
      url.pathname === "/study-library.bundle.js" ||
      url.pathname === "/app.js" ||
      url.pathname === "/ai-bridge.js" ||
      url.pathname === "/library-whiteboard.js" ||
      url.pathname === "/styles.css" ||
      url.pathname === "/auth-config.js" ||
      url.pathname === "/auth-guard.js"
    )
  ) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match("/offline.html")))
    );
    return;
  }

  if (isSameOrigin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
            return res;
          })
          .catch(() => cached || caches.match("/offline.html"));
      })
    );
  }
});

self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (err) {
      data = { title: "Soul Concept", body: event.data.text() };
    }
  }

  const title = data.title || "Soul Concept";
  const type = data.type || "general";
  const tag = data.tag || ("sc-" + type);
  const requireInteraction =
    typeof data.requireInteraction === "boolean"
      ? data.requireInteraction
      : type === "streak" || type === "reminder";
  const options = {
    body: data.body || "You have a new update.",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag,
    renotify: true,
    requireInteraction,
    vibrate: Array.isArray(data.vibrate) ? data.vibrate : [120, 50, 120],
    timestamp: Date.now(),
    actions: Array.isArray(data.actions) && data.actions.length
      ? data.actions
      : [
          { action: "open", title: "Open" },
          { action: "dismiss", title: "Dismiss" }
        ],
    data: {
      url: data.url || "/",
      type,
      sentAt: new Date().toISOString()
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "dismiss") return;

  const targetUrl = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && client.url.indexOf(targetUrl) !== -1 && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
