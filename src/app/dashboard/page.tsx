"use client";

import Layout from "@/components/layout/Layout";
import Card from "@/components/dashboard/Card";
import Table from "@/components/dashboard/Table";
import DashboardHero from "@/components/dashboard/DashboardHero";

import {
  FileText,
  Folder,
  Clock,
} from "lucide-react";

import { useEmployeeFiles } from "@/hooks/useEmployeeFiles";

export default function Dashboard() {

  const {
    files,
    loading,
  } = useEmployeeFiles(
    "dni",
    "01158635",
  );

  const latestFile = files[0];

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
            ¡Bienvenido, Andres!
          </h1>

          <p className="text-gray-400 mb-5 text-sm sm:text-base leading-relaxed">
            Aquí puedes ver y descargar tus boletas y documentos laborales.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

            <Card
              title="Última Boleta"
              value={
                latestFile
                  ? latestFile.key.split("/")[3]
                  : "-"
              }
              subtitle={
                latestFile
                  ? new Date(
                      latestFile.lastModified,
                    ).toLocaleDateString()
                  : "-"
              }
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