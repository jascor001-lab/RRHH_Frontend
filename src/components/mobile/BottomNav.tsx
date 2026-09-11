"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Home, Upload, User } from "lucide-react";

import { isAdmin } from "@/lib/auth";

const allLinks = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/boletas", label: "Boletas", icon: FileText },
  { href: "/upload", label: "Cargar", icon: Upload, admin: true },
  { href: "/perfil", label: "Perfil", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    setAdmin(isAdmin());
  }, []);

  const links = useMemo(
    () => allLinks.filter((link) => !link.admin || admin),
    [admin],
  );

  const itemClass = (href: string) =>
    `flex flex-col items-center gap-1 text-xs transition duration-300 ${
      pathname === href ? "text-green-400 scale-105" : "text-gray-400 hover:text-white"
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0D2B24]/90 p-3 backdrop-blur-xl flex justify-around md:hidden">
      {links.map((link) => {
        const Icon = link.icon;

        return (
          <Link key={link.href} href={link.href} className={itemClass(link.href)}>
            <Icon size={18} />
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
