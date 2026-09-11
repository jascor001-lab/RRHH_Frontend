"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";

import { getUser, logout } from "@/lib/auth";

const titles: Record<string, string> = {
  "/dashboard": "Inicio",
  "/boletas": "Mis Boletas",
  "/upload": "Cargar documentos",
  "/usermanag": "Usuarios",
  "/reportes": "Reportes",
  "/perfil": "Perfil",
};

export default function Header({ onMenu }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const [nombre, setNombre] = useState("Usuario");

  useEffect(() => {
    const user = getUser();
    if (user?.nombre) {
      setNombre(user.nombre);
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const initials = nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#0B1F1A]/75 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          className="rounded-lg p-1.5 transition hover:bg-green-500/10 md:hidden"
        >
          <Menu />
        </button>

        <h1 className="text-sm font-semibold md:text-base">
          {titles[pathname] || "Panel"}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="max-w-[220px] truncate text-sm">{nombre}</p>
          <p className="text-[10px] uppercase tracking-wider text-green-400/80">
            En línea
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
          {initials || "U"}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
}
