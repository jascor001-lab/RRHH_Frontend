"use client";

import { useState } from "react";
import {
  Eye,
  Download,
} from "lucide-react";

import { getAuthApi, getFilesApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { getPayslipMeta } from "@/lib/payslip";

type Props = {
  files: any[];
  loading: boolean;
};

export default function Table({
  files,
  loading,
}: Props) {
  const [query, setQuery] = useState("");
  const rows = (Array.isArray(files) ? files : []).filter((file) => {
        const haystack = `${file.key} ${getPayslipMeta(file.key).period}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  const openFile = async (
    objectKey: string,
    action: "view" | "download",
  ) => {
    const token = getAccessToken();

    if (token) {
      try {
        await fetch(`${getAuthApi()}/payslip-views`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            objectKey,
            action,
          }),
        });
      } catch (error) {
        console.error("No se pudo registrar la visualización", error);
      }
    }

    const response = await fetch(
      `${getFilesApi()}/files/url?key=${encodeURIComponent(objectKey)}`,
    );

    const data = await response.json();

    window.open(data.url, "_blank");
  };

  if (loading) {
    return (
      <div className="mt-6">
        Cargando...
      </div>
    );
  }

 return (
  <div className="tech-card mt-6 p-4">

    <div className="
      flex flex-col sm:flex-row
      sm:items-center
      sm:justify-between
      gap-3
      mb-5
    ">

      <h2 className="text-lg font-semibold tracking-wide">
        Registros
      </h2>

      <input
        placeholder="Filtrar periodo o archivo..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="
          bg-white/10
          border border-white/10
          p-2.5
          rounded-xl
          text-sm
          w-full
          sm:w-64
          outline-none
        "
      />
    </div>

    {/* MOBILE CARDS */}
    <div className="flex flex-col gap-3 md:hidden">

      {rows.length === 0 && (
        <p className="text-sm text-gray-400 py-4">
          No hay boletas para mostrar.
        </p>
      )}

      {rows.map((file, i) => {

        const { period, dateLabel } = getPayslipMeta(file.key);

        return (
          <div
            key={i}
            className="
              border border-green-400/15
              rounded-xl
              p-4
              bg-white/5
              transition duration-300
              hover:border-green-400/40
              hover:bg-green-400/10
            "
          >

            <div className="space-y-2">

              <div>
                <p className="text-xs text-gray-400">
                  Fecha
                </p>

                <p className="text-sm">
                  {dateLabel}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Tipo
                </p>

                <p className="text-sm">
                  Boleta de Pago
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Periodo
                </p>

                <p className="text-sm">
                  {period}
                </p>
              </div>

            </div>

            <div className="flex gap-2 mt-4">

              <button
                onClick={() =>
                  openFile(file.key, "view")
                }
                className="
                  flex-1
                  bg-green-500/20
                  text-green-400
                  py-2
                  rounded-lg
                  flex items-center
                  justify-center
                  gap-2
                  text-sm
                "
              >
                <Eye size={16}/>
                Ver
              </button>

              <button
                onClick={() =>
                  openFile(file.key, "download")
                }
                className="
                  flex-1
                  bg-blue-500/20
                  text-blue-400
                  py-2
                  rounded-lg
                  flex items-center
                  justify-center
                  gap-2
                  text-sm
                "
              >
                <Download size={16}/>
                Descargar
              </button>

            </div>
          </div>
        );
      })}
    </div>

    {/* DESKTOP TABLE */}
    <div className="hidden md:block overflow-x-auto">

      <table className="w-full text-sm">

        <thead className="text-gray-400">

          <tr>
            <th className="text-left py-3">
              Fecha
            </th>

            <th className="text-left py-3">
              Tipo
            </th>

            <th className="text-left py-3">
              Periodo
            </th>

            <th></th>
          </tr>

        </thead>

        <tbody>

          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-gray-400">
                No hay boletas para mostrar.
              </td>
            </tr>
          )}

          {rows.map((file, i) => {

            const { period, dateLabel } = getPayslipMeta(file.key);

            return (

              <tr
                key={i}
                className="border-t border-white/10 transition duration-300 hover:bg-green-400/10"
              >

                <td className="py-4">

                  {dateLabel}

                </td>

                <td>
                  Boleta de Pago
                </td>

                <td>
                  {period}
                </td>

                <td className="py-2">

                  <div className="flex justify-end gap-2">

                    <button
                      onClick={() =>
                        openFile(file.key, "view")
                      }
                      className="
                        bg-green-500/20
                        text-green-400
                        px-3 py-2
                        rounded-lg
                        flex items-center
                        gap-2
                      "
                    >
                      <Eye size={15}/>
                      Ver
                    </button>

                    <button
                      onClick={() =>
                        openFile(file.key, "download")
                      }
                      className="
                        bg-blue-500/20
                        text-blue-400
                        px-3 py-2
                        rounded-lg
                        flex items-center
                        gap-2
                      "
                    >
                      <Download size={15}/>
                      Descargar
                    </button>

                  </div>

                </td>

              </tr>
            );
          })}

        </tbody>
      </table>
    </div>
  </div>
);
}