"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "rrhh_pwa_install_dismissed";

/**
 * Igual que Carta Fianza: solo aparece si Chrome dispara beforeinstallprompt.
 * En http://192.168.7.223 no muestra nada en pantalla (comportamiento normal).
 */
export default function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (sessionStorage.getItem(DISMISS_KEY) === "1") return;

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  if (!visible || !deferred) return null;

  return (
    <div className="pwa-install-banner" role="dialog" aria-label="Instalar app">
      <div className="pwa-install-copy">
        <strong>Instalar MoliRecursos</strong>
        <span>Acceso rápido como aplicación en este dispositivo</span>
      </div>
      <div className="pwa-install-actions">
        <button
          type="button"
          className="pwa-install-btn"
          onClick={async () => {
            await deferred.prompt();
            await deferred.userChoice;
            setVisible(false);
            setDeferred(null);
          }}
        >
          <Download size={15} />
          Instalar
        </button>
        <button
          type="button"
          className="pwa-install-dismiss"
          aria-label="Cerrar"
          onClick={() => {
            sessionStorage.setItem(DISMISS_KEY, "1");
            setVisible(false);
          }}
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
