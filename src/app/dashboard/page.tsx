"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, FileText, Folder } from "lucide-react";

import Layout from "@/components/layout/Layout";
import Card from "@/components/dashboard/Card";
import Table from "@/components/dashboard/Table";
import DashboardHero from "@/components/dashboard/DashboardHero";
import { useEmployeeFiles } from "@/hooks/useEmployeeFiles";
import { AuthUser, getUser } from "@/lib/auth";
import { getPayslipMeta } from "@/lib/payslip";

export default function Dashboard() {
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

  const latestFile = files[0];
  const firstName = user?.nombre?.split(" ")[0] || "usuario";
  const latestMeta = latestFile ? getPayslipMeta(latestFile.key) : null;
  const latestPeriod = latestMeta?.period || "-";

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4 lg:gap-6">
        <div className="hidden lg:block">
          <DashboardHero />
        </div>

        <div className="min-w-0">
          <div className="lg:hidden mb-4">
            <DashboardHero mobile />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold mb-2 leading-tight">
            Hola, {firstName}
          </h1>

          <p className="text-gray-400 mb-5 text-sm sm:text-base leading-relaxed">
            Aquí puedes ver y descargar tus boletas y documentos laborales.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <Card
              title="Última Boleta"
              value={latestPeriod}
              subtitle={latestMeta?.dateLabel || "-"}
              icon={<FileText />}
            />

            <Card
              title="Total Documentos"
              value={String(files.length)}
              icon={<Folder />}
            />

            <Card
              title="Último acceso"
              value="Hoy"
              icon={<Clock />}
            />
          </div>

          <Table files={files} loading={loading} />
        </div>
      </div>
    </Layout>
  );
}
