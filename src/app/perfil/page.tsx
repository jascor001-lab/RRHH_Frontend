"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";

import Layout from "@/components/layout/Layout";
import { getAuthApi } from "@/lib/api";
import { getAccessToken, getUser } from "@/lib/auth";

function Field({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="mb-1 text-xs text-gray-400">{label}</p>
      <p className="text-sm">{value || "-"}</p>
    </div>
  );
}

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState(getUser());
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const session = getUser();

    if (!session?.dni) {
      router.replace("/login");
      return;
    }

    setUser(session);
  }, [router]);

  const handleChangePassword = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("La confirmación no coincide con la nueva contraseña");
      return;
    }

    try {
      setLoading(true);

      const token = getAccessToken();
      const response = await fetch(
        `${getAuthApi()}/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      const data = await response.json().catch(() => null);
      const message = Array.isArray(data?.message)
        ? data.message.join(" ")
        : data?.message;

      if (!response.ok) {
        setError(message || "No se pudo cambiar la contraseña");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Contraseña actualizada correctamente");
    } catch (err) {
      console.error(err);
      setError("No se pudo cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-xl sm:text-2xl font-bold mb-2">
        Perfil
      </h1>
      <p className="text-gray-400 mb-5 text-sm sm:text-base">
        Datos del usuario conectado y cambio de contraseña.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mb-8">
        <Field label="Nombre" value={user?.nombre} />
        <Field label="DNI" value={user?.dni} />
        <Field label="Cargo" value={user?.cargo_contrato} />
        <Field label="Correo" value={user?.email} />
        <Field
          label="Categoría"
          value={user?.rol === "admin" ? "Administrador" : "Usuario"}
        />
      </div>

      <div className="tech-card max-w-3xl p-5">
        <div className="mb-4 flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-green-400" />
          <h2 className="text-lg font-semibold text-white">
            Cambiar contraseña
          </h2>
        </div>

        {success && (
          <div className="mb-4 rounded-xl border border-green-500 bg-green-500/20 px-4 py-3 text-sm text-green-300">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-500 bg-red-500/20 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Contraseña actual
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-green-400/20 bg-black/25 px-4 py-3 text-sm text-white outline-none transition focus:border-green-400/70 focus:ring-2 focus:ring-green-400/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-green-400/20 bg-black/25 px-4 py-3 text-sm text-white outline-none transition focus:border-green-400/70 focus:ring-2 focus:ring-green-400/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-green-400/20 bg-black/25 px-4 py-3 text-sm text-white outline-none transition focus:border-green-400/70 focus:ring-2 focus:ring-green-400/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-500 disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Actualizar contraseña"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
