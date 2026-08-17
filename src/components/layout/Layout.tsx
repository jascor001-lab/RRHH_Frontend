"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#061915] via-[#0b2e26] to-[#061915] text-white">

      {/* Desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64">
            <Sidebar />
          </div>

          <div
            className="flex-1 bg-black/50"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      <div className="flex-1 relative">

        <Header onMenu={() => setOpen(true)} />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(29,185,84,0.15),transparent)] pointer-events-none" />

        <main className="p-4 md:p-6 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}