const CACHE_NAME = "v7"; // Обновляй версию!

// Список статических файлов для кэширования
const STATIC_FILES = [
  "/mrspacks/",
  "/mrspacks/assets/index-DSWLSKx0.css",
  "/mrspacks/assets/index-BtePvpWJ.js",
  "/mrspacks/assets/favicon.ico",
  "/mrspacks/manifest.json",
];

// 📌 Установка (кэширование статических ресурсов)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_FILES))
      .catch((err) => console.error("[SW] Ошибка кэширования:", err))
  );
  self.skipWaiting();
});

// 📌 Активация (очистка старого кеша)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );

  self.clients.claim();

  // 🔄 Оповещаем клиентов о новом SW
  setTimeout(() => {
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => client.postMessage({ action: "reload" }));
    });
  }, 1000);
});

// 📌 Интерсепт запросов
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // ❌ Игнорируем chrome-расширения
  if (url.protocol === "chrome-extension:") return;

  // 📌 Кэшируем только статические файлы
  if (
    STATIC_FILES.includes(url.pathname) ||
    STATIC_FILES.includes(url.pathname.substring(1))
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(event.request)
          .then((response) => {
            if (
              response &&
              response.status === 200 &&
              response.type === "basic"
            ) {
              const responseClone = response.clone();
              caches
                .open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseClone));
            }
            return response;
          })
          .catch(
            () =>
              new Response("Ошибка сети. Проверьте подключение!", {
                status: 503,
              })
          );
      })
    );
  } else {
    // ⚠️ API-запросы не кэшируем, просто прокидываем дальше
    event.respondWith(fetch(event.request));
  }
});
