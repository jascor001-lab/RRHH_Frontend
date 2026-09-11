"use client";

import PwaInstallPrompt from "@/components/pwa/PwaInstallPrompt";

export default function PwaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <PwaInstallPrompt />
    </>
  );
}
