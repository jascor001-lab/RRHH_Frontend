"use client";

import { Trash2 } from "lucide-react";

import type { UploadFile } from "@/hooks/useUploads";

type Props = {
  uploads: UploadFile[];
  onRemove: (id: string) => void;
  disabled?: boolean;
};

export default function UploadTable({
  uploads,
  onRemove,
  disabled = false,
}: Props) {
  if (uploads.length === 0) {
    return (
      <p className="mt-6 text-sm text-gray-400">
        Todavía no hay archivos en cola. Selecciona PDFs con DNI distintos para
        la carga masiva.
      </p>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-white/10 text-gray-400">
          <tr>
            <th className="py-3 text-left">Archivo</th>
            <th className="py-3 text-left">DNI</th>
            <th className="py-3 text-left">Estado</th>
            <th className="py-3 text-right">Quitar</th>
          </tr>
        </thead>

        <tbody>
          {uploads.map((item) => (
            <tr key={item.id} className="border-b border-white/5">
              <td className="max-w-[240px] truncate py-3 pr-3 text-white">
                {item.file.name}
              </td>

              <td className="py-3 pr-3 font-medium text-green-300">
                {item.dni}
              </td>

              <td className="py-3 pr-3">
                {item.status === "pending" && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-300">
                    En cola
                  </span>
                )}

                {item.status === "uploading" && (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-28 rounded bg-gray-700">
                      <div
                        className="h-2 rounded bg-green-500"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      {Math.round(item.progress)}%
                    </span>
                  </div>
                )}

                {item.status === "done" && (
                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
                    Subido
                  </span>
                )}

                {item.status === "error" && (
                  <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-400">
                    {item.errorMessage || "Error"}
                  </span>
                )}
              </td>

              <td className="py-3 text-right">
                <button
                  type="button"
                  disabled={disabled || item.status === "uploading"}
                  onClick={() => onRemove(item.id)}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-gray-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-40"
                  aria-label={`Quitar ${item.file.name}`}
                >
                  <Trash2 size={16} />
                  <span className="hidden sm:inline">Eliminar</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
