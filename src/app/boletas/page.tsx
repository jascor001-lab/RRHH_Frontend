"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Layout from "@/components/layout/Layout";
import Table from "@/components/dashboard/Table";
import { useEmployeeFiles } from "@/hooks/useEmployeeFiles";
import { AuthUser, getUser } from "@/lib/auth";

export default function BoletasPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const session = getUser();

    if (!session?.dni) {
      router.replace("/login");
      return;
    }

    setUser(session);
  }, [router]);

  const { files, loading } = useEmployeeFiles("dni", user?.dni || "");

  return (
    <Layout>
      <h1 className="text-xl sm:text-2xl font-bold mb-2">
        Mis Boletas
      </h1>
      <p className="text-gray-400 mb-5 text-sm sm:text-base">
        Consulta y descarga tus boletas de pago.
      </p>
      <Table files={files} loading={loading} />
    </Layout>
  );
}
