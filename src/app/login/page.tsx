"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  FileText,
  IdCard,
  Lock,
  ShieldCheck,
} from "lucide-react";

import { getAuthApi } from "@/lib/api";
import { saveSession } from "@/lib/auth";

export default function Login() {
  const router = useRouter();
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [expiredNotice, setExpiredNotice] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setExpiredNotice(params.get("expired") === "1");
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${getAuthApi()}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dni: dni.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => null);
      const message = Array.isArray(data?.message)
        ? data.message.join(" ")
        : data?.message;

      if (!response.ok) {
        if (response.status >= 500 || !data) {
          setError(
            "El servidor de login no responde. Enciende el backend de autenticación.",
          );
          return;
        }

        setError(
          message ||
            "No se pudo iniciar sesión. Verifica tu DNI y contraseña.",
        );
        return;
      }

      saveSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });

      router.push("/dashboard");
    } catch {
      setError(
        "No se pudo conectar con el servidor. Comprueba que el sistema esté encendido en esta PC.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06140f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(29,185,84,0.28),transparent_36%),radial-gradient(circle_at_85%_80%,rgba(29,185,84,0.12),transparent_32%),linear-gradient(135deg,#061915_0%,#0b2e26_48%,#061915_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:42px_42px] opacity-30" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-green-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-green-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 lg:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="hidden lg:block">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-300">
              Portal del colaborador
            </div>

            <h1 className="mt-5 text-5xl font-black tracking-tight">
              MoliRecursos
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-gray-300">
              Consulta tus boletas, revisa tu perfil y gestiona tus documentos
              laborales en un solo lugar.
            </p>

            <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <FileText className="mb-3 text-green-400" size={22} />
                <p className="text-sm font-semibold">Mis boletas</p>
                <p className="mt-1 text-xs text-gray-400">
                  Descarga tus pagos cuando los necesites
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <ShieldCheck className="mb-3 text-green-400" size={22} />
                <p className="text-sm font-semibold">Acceso seguro</p>
                <p className="mt-1 text-xs text-gray-400">
                  Ingreso con DNI y sesión protegida
                </p>
              </div>
            </div>

            <div className="relative mt-8 h-[280px] w-[220px]">
              <div className="absolute inset-0 rounded-full bg-green-400/25 blur-3xl" />
              <Image
                src="/girl.png"
                alt="Asistente MoliRecursos"
                width={220}
                height={280}
                className="relative object-contain drop-shadow-[0_20px_40px_rgba(29,185,84,0.35)]"
                priority
              />
            </div>
          </section>

          <form
            onSubmit={handleSubmit}
            className="relative w-full overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent" />

            <div className="mb-7 lg:hidden">
              <p className="text-xs uppercase tracking-[0.2em] text-green-300">
                Portal del colaborador
              </p>
            </div>

            <h2 className="text-3xl font-bold">Bienvenido</h2>
            <p className="mt-2 text-sm text-gray-300">
              Ingresa con tu DNI y contraseña para continuar
            </p>

            {expiredNotice && (
              <p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                Tu sesión se cerró por tiempo. Vuelve a iniciar sesión para
                continuar.
              </p>
            )}

            <label className="mb-2 mt-8 block text-xs font-medium text-gray-300">
              DNI
            </label>
            <div className="relative mb-4">
              <IdCard
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-green-300"
              />
              <input
                className="w-full rounded-2xl border border-white/15 bg-black/25 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-green-400/70 focus:ring-2 focus:ring-green-400/20"
                placeholder="12345678"
                value={dni}
                onChange={(event) => setDni(event.target.value)}
                maxLength={8}
                inputMode="numeric"
                required
              />
            </div>

            <label className="mb-2 block text-xs font-medium text-gray-300">
              Contraseña
            </label>
            <div className="relative mb-5">
              <Lock
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-green-300"
              />
              <input
                className="w-full rounded-2xl border border-white/15 bg-black/25 py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-green-400/70 focus:ring-2 focus:ring-green-400/20"
                placeholder="Tu contraseña"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-accent p-3.5 text-sm font-bold text-white transition hover:bg-green-500 disabled:opacity-60"
            >
              {loading ? "Ingresando..." : "Ingresar al sistema"}
            </button>

            <p className="mt-5 text-center text-xs text-gray-400">
              Municipalidad de La Molina · Acceso interno
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
