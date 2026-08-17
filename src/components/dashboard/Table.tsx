"use client";

import {
  Eye,
  Download,
} from "lucide-react";

type Props = {
  files: any[];
  loading: boolean;
};

const months: Record<string, string> = {
  "01": "Enero",
  "02": "Febrero",
  "03": "Marzo",
  "04": "Abril",
  "05": "Mayo",
  "06": "Junio",
  "07": "Julio",
  "08": "Agosto",
  "09": "Septiembre",
  "10": "Octubre",
  "11": "Noviembre",
  "12": "Diciembre", 
};

export default function Table({
  files,
  loading,
}: Props) {

  const openFile = async (
    objectKey: string,
  ) => {

    const response = await fetch(
      `http://localhost:3000/files/url?key=${encodeURIComponent(objectKey)}`,
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
  <div className="
    mt-6
    bg-white/5
    backdrop-blur-xl
    border border-white/10
    rounded-2xl
    p-4
  ">

    <div className="
      flex flex-col sm:flex-row
      sm:items-center
      sm:justify-between
      gap-3
      mb-5
    ">

      <h2 className="text-lg font-semibold">
        Mis Boletas
      </h2>

      <input
        placeholder="Buscar..."
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

      {files.map((file, i) => {

        const parts = file.key.split("/");

        const year = parts[2];
        const month = parts[3];

        const period =
          `${months[month]} ${year}`;

        return (
          <div
            key={i}
            className="
              border border-white/10
              rounded-xl
              p-4
              bg-white/5
            "
          >

            <div className="space-y-2">

              <div>
                <p className="text-xs text-gray-400">
                  Fecha
                </p>

                <p className="text-sm">
                  {new Date(
                    file.lastModified,
                  ).toLocaleDateString()}
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
                  openFile(file.key)
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
                  openFile(file.key)
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

          {files.map((file, i) => {

            const parts =
              file.key.split("/");

            const year = parts[2];
            const month = parts[3];

            const period =
              `${months[month]} ${year}`;

            return (

              <tr
                key={i}
                className="border-t border-white/10"
              >

                <td className="py-4">

                  {new Date(
                    file.lastModified,
                  ).toLocaleDateString()}

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
                        openFile(file.key)
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
                        openFile(file.key)
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