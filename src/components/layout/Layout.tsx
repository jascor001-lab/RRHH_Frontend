"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Sidebar from "./Sidebar";
import Header from "./Header";
import SessionExpiryNotice from "./SessionExpiryNotice";
import BottomNav from "@/components/mobile/BottomNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#061915] via-[#0b2e26] to-[#061915] text-white">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 animate-[fade-up_0.25s_ease]">
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(29,185,84,0.15),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(29,185,84,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(29,185,84,0.04)_1px,transparent_1px)] bg-[size:36px_36px]" />

        <SessionExpiryNotice />
        <Header onMenu={() => setOpen(true)} />

        <main className="relative z-10 flex-1 overflow-y-auto scroll-smooth p-4 pb-24 md:p-6 md:pb-6">
          <div key={pathname} className="page-enter">
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
