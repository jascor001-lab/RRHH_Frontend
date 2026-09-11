"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, Home, LogOut, Upload, User, Users, ClipboardList } from "lucide-react";

import { isAdmin, logout } from "@/lib/auth";

const allLinks = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/boletas", label: "Mis Boletas", icon: FileText },
  { href: "/upload", label: "Cargar documentos", icon: Upload, admin: true },
  { href: "/usermanag", label: "Usuarios", icon: Users, admin: true },
  { href: "/reportes", label: "Reportes", icon: ClipboardList, admin: true },
  { href: "/perfil", label: "Perfil", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    setAdmin(isAdmin());
  }, []);

  const links = useMemo(
    () => allLinks.filter((link) => !link.admin || admin),
    [admin],
  );

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <aside className="flex h-screen w-64 flex-col justify-between border-r border-white/10 bg-[#0B1F1A]/90 p-4 backdrop-blur-xl">
      <div>
        <div className="mb-8 px-1">
          <h2 className="text-xl font-black text-white">
            MoliRecursos
          </h2>
        </div>

        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${active ? "nav-link-active" : ""}`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-green-500" />
                )}
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-xl p-2.5 text-sm text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
      >
        <LogOut size={18} /> Salir
      </button>
    </aside>
  );
}
