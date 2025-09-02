import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    // console.log("[PWA] Проверка установки...");
    if (window.matchMedia("(display-mode: standalone)").matches) {
      // console.log("[PWA] Приложение уже установлено");
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      // console.log("[PWA] Событие beforeinstallprompt сработало");
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      // console.log("[PWA] Приложение установлено");
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      // console.log("[PWA] Очистка обработчиков событий");
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) {
      console.log("[PWA] deferredPrompt отсутствует!");
      return;
    }
    console.log("[PWA] Запуск установки...");
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      console.log("[PWA] Выбор пользователя:", choiceResult.outcome);
      if (choiceResult.outcome === "accepted") {
        console.log("[PWA] Пользователь согласился установить");
        setIsInstalled(true);
        setDeferredPrompt(null);
      } else {
        console.log("[PWA] Пользователь отказался от установки");
      }
    });
  };

  if (isInstalled) {
    console.log("[PWA] Кнопка скрыта: приложение уже установлено");
    return null;
  }
  if (!deferredPrompt) {
    console.log("[PWA] Кнопка скрыта: нет beforeinstallprompt");
    return null;
  }

  return (
    <button style={{ border: "solid 1px black" }} onClick={handleInstallClick}>
      <FontAwesomeIcon icon={faDownload} /> <span>{t("settings.install")}</span>
    </button>
  );
};

export default InstallPWA;
