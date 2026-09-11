"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, FileDown, Search } from "lucide-react";

import Layout from "@/components/layout/Layout";
import { getAuthApi } from "@/lib/api";
import { getAccessToken, isAdmin } from "@/lib/auth";
import {
  formatPayslipPeriod,
  formatViewDate,
} from "@/lib/payslipViews";
import { downloadPayslipViewsReportPdf } from "@/lib/reportPdf";

type SummaryRow = {
  dni: string;
  nombre?: string;
  year: string;
  month: string;
  firstViewAt?: string;
  lastViewAt?: string;
  viewCount: number;
  downloadCount: number;
};

type EventRow = {
  id: string;
  dni: string;
  nombre?: string;
  year: string;
  month: string;
  action: "view" | "download";
  objectKey: string;
  viewedAt: string;
};

export default function ReportesPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [month, setMonth] = useState(
    String(new Date().getMonth() + 1).padStart(2, "0"),
  );
  const [search, setSearch] = useState("");
  const [summary, setSummary] = useState<SummaryRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [exporting, setExporting] = useState(false);

  const authHeaders = () => {
    const token = getAccessToken();

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (year) {
        params.set("year", year);
      }

      if (month) {
        params.set("month", month);
      }

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const response = await fetch(
        `${getAuthApi()}/payslip-views/report?${params.toString()}`,
        {
          headers: authHeaders(),
        },
      );

      const data = await response.json().catch(() => null);
      const message = Array.isArray(data?.message)
        ? data.message.join(" ")
        : data?.message;

      if (!response.ok) {
        setError(message || "No se pudo cargar el reporte");
        return;
      }

      setSummary(Array.isArray(data?.summary) ? data.summary : []);
      setEvents(Array.isArray(data?.events) ? data.events : []);
      setTotalEvents(Number(data?.totalEvents || 0));
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el reporte de visualizaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    if (!isAdmin()) {
      router.replace("/dashboard");
      return;
    }

    setAllowed(true);
    loadReport();
  }, [router]);

  const workersWithAccess = useMemo(
    () => summary.length,
    [summary],
  );

  const handleDownloadPdf = () => {
    try {
      setExporting(true);
      setError("");

      downloadPayslipViewsReportPdf({
        year,
        month,
        search,
        summary,
        events,
        totalEvents,
      });
    } catch (err) {
      console.error(err);
      setError("No se pudo generar el PDF del reporte");
    } finally {
      setExporting(false);
    }
  };

  if (!allowed) {
    return null;
  }

  return (
    <Layout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold">
            Reporte de visualización de boletas
          </h1>
          <p className="text-sm text-gray-400 sm:text-base">
            Registro de trabajadores que visualizaron o descargaron su boleta.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={exporting || loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-500 disabled:opacity-60"
        >
          <FileDown size={16} />
          {exporting ? "Generando PDF..." : "Descargar PDF"}
        </button>
      </div>

      <div className="tech-card mb-6 p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm text-gray-300">Año</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-xl border border-green-400/20 bg-black/25 px-4 py-3 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Mes</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full rounded-xl border border-green-400/20 bg-black/25 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="01">Enero</option>
              <option value="02">Febrero</option>
              <option value="03">Marzo</option>
              <option value="04">Abril</option>
              <option value="05">Mayo</option>
              <option value="06">Junio</option>
              <option value="07">Julio</option>
              <option value="08">Agosto</option>
              <option value="09">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-gray-300">
              Buscar trabajador
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="DNI o nombre..."
                className="w-full rounded-xl border border-green-400/20 bg-black/25 py-3 pl-10 pr-4 text-sm text-white outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={loadReport}
            disabled={loading}
            className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/5 disabled:opacity-60"
          >
            {loading ? "Cargando..." : "Actualizar reporte"}
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={exporting || loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(29,185,84,0.35)] transition hover:bg-green-500 disabled:opacity-60"
          >
            <FileDown size={18} />
            {exporting ? "Generando PDF..." : "Descargar PDF"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500 bg-red-500/20 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="tech-card p-4">
          <p className="text-xs text-gray-400">Trabajadores con acceso</p>
          <p className="text-2xl font-bold text-white">{workersWithAccess}</p>
        </div>
        <div className="tech-card p-4">
          <p className="text-xs text-gray-400">Eventos registrados</p>
          <p className="text-2xl font-bold text-white">{totalEvents}</p>
        </div>
        <div className="tech-card p-4">
          <p className="text-xs text-gray-400">Periodo consultado</p>
          <p className="text-2xl font-bold text-white">
            {formatPayslipPeriod(year, month)}
          </p>
        </div>
      </div>

      <div className="tech-card mb-6 overflow-hidden p-5">
        <div className="mb-4 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-green-400" />
          <h2 className="text-lg font-semibold text-white">
            Resumen por trabajador
          </h2>
        </div>

        <div className="max-h-[28rem] overflow-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="sticky top-0 bg-[#0d241f] text-gray-400">
              <tr className="border-b border-green-400/15">
                <th className="px-4 py-3">DNI</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Periodo</th>
                <th className="px-4 py-3">Primera vista</th>
                <th className="px-4 py-3">Última vista</th>
                <th className="px-4 py-3">Vistas</th>
                <th className="px-4 py-3">Descargas</th>
              </tr>
            </thead>
            <tbody>
              {summary.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-gray-400">
                    No hay visualizaciones registradas para este periodo.
                  </td>
                </tr>
              )}

              {summary.map((row) => (
                <tr
                  key={`${row.dni}-${row.year}-${row.month}`}
                  className="border-b border-white/10"
                >
                  <td className="px-4 py-4">{row.dni}</td>
                  <td className="px-4 py-4 font-medium text-white">
                    {row.nombre || "-"}
                  </td>
                  <td className="px-4 py-4">
                    {formatPayslipPeriod(row.year, row.month)}
                  </td>
                  <td className="px-4 py-4">
                    {formatViewDate(row.firstViewAt)}
                  </td>
                  <td className="px-4 py-4">
                    {formatViewDate(row.lastViewAt)}
                  </td>
                  <td className="px-4 py-4">{row.viewCount}</td>
                  <td className="px-4 py-4">{row.downloadCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tech-card overflow-hidden p-5">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Detalle de eventos
        </h2>

        <div className="max-h-[28rem] overflow-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="sticky top-0 bg-[#0d241f] text-gray-400">
              <tr className="border-b border-green-400/15">
                <th className="px-4 py-3">Fecha y hora</th>
                <th className="px-4 py-3">DNI</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Periodo</th>
                <th className="px-4 py-3">Acción</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-gray-400">
                    No hay eventos registrados.
                  </td>
                </tr>
              )}

              {events.map((row) => (
                <tr key={row.id} className="border-b border-white/10">
                  <td className="px-4 py-4">
                    {formatViewDate(row.viewedAt)}
                  </td>
                  <td className="px-4 py-4">{row.dni}</td>
                  <td className="px-4 py-4">{row.nombre || "-"}</td>
                  <td className="px-4 py-4">
                    {formatPayslipPeriod(row.year, row.month)}
                  </td>
                  <td className="px-4 py-4">
                    {row.action === "download" ? "Descarga" : "Visualización"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
