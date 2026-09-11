"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";

import { clearSession, getAccessTokenExpiryMs } from "@/lib/auth";

const WARN_BEFORE_MS = 2 * 60 * 1000;

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function SessionExpiryNotice() {
  const router = useRouter();
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const expiryMs = getAccessTokenExpiryMs();

      if (!expiryMs) {
        setRemainingMs(null);
        return;
      }

      const remaining = expiryMs - Date.now();

      if (remaining <= 0) {
        clearSession();
        router.replace("/login?expired=1");
        return;
      }

      setRemainingMs(remaining);
    };

    tick();
    const interval = window.setInterval(tick, 1000);

    return () => window.clearInterval(interval);
  }, [router]);

  if (remainingMs === null || remainingMs > WARN_BEFORE_MS) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <div className="flex w-full max-w-3xl items-start gap-3 rounded-2xl border border-amber-400/40 bg-[#1a1408]/95 px-4 py-3 text-amber-100 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <Clock className="mt-0.5 shrink-0 text-amber-300" size={18} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            Tu sesión se cerrará en {formatRemaining(remainingMs)}
          </p>
          <p className="mt-1 text-xs text-amber-100/80">
            Por seguridad dura 15 minutos. Si estabas registrando un usuario u
            otro cambio, vuelve a iniciar sesión para continuar.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            clearSession();
            router.replace("/login?expired=1");
          }}
          className="shrink-0 rounded-xl bg-amber-400 px-3 py-2 text-xs font-semibold text-[#1a1408] transition hover:bg-amber-300"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}
