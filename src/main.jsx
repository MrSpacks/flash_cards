import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./i18n";
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered!", registration);

        // Проверяем обновления Service Worker
        registration.onupdatefound = () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.onstatechange = () => {
              if (newWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  console.log("New Service Worker is available. Reloading...");
                  window.location.reload();
                }
              }
            };
          }
        };
      })
      .catch((error) =>
        console.log("Error registering Service Worker:", error)
      );
  });

  // Обработчик сообщений от SW
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data.action === "reload") {
      console.log("Reloading Service Worker");
      window.location.reload();
    }
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
