"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Layout from "@/components/layout/Layout";
import Dropzone from "@/components/upload/Dropzone";
import UploadTable from "@/components/upload/UploadTable";
import { useUploads } from "@/hooks/useUploads";
import { getUser, isAdmin } from "@/lib/auth";

export default function Upload() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [documentType, setDocumentType] = useState("dni");
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("08");

  const {
    uploads,
    notice,
    sending,
    pendingCount,
    queueFiles,
    submitUploads,
    removeFile,
    clearFinished,
    reportEmptyDrop,
  } = useUploads({
    documentType,
    year,
    month,
  });

  useEffect(() => {
    const session = getUser();

    if (!session?.dni) {
      router.replace("/login");
      return;
    }

    if (!isAdmin(session)) {
      router.replace("/dashboard");
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) {
    return null;
  }

  return (
    <Layout>
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-2xl font-semibold">
          Carga Masiva de Documentos
        </h1>
        <p className="mb-6 text-sm text-gray-400 sm:text-base">
          Apila muchas boletas PDF (cada una con su DNI), revisa la cola y pulsa
          Aceptar. Cada trabajador verá solo las suyas en Mis Boletas.
        </p>

        <div className="tech-card mb-6 p-4 md:p-5">
          <h2 className="mb-3 text-sm font-semibold text-green-400">
            Cómo subir documentos
          </h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-300">
            <li>
              Solo archivos{" "}
              <span className="font-medium text-white">PDF</span>.
            </li>
            <li>
              El nombre debe incluir el{" "}
              <span className="font-medium text-white">DNI de 8 dígitos</span>{" "}
              (ej.{" "}
              <span className="font-medium text-white">04641338.pdf</span> o{" "}
              <span className="font-medium text-white">04641338[R].pdf</span>).
              Puedes subir muchos con DNI distintos a la vez.
            </li>
            <li>
              Elige tipo, año y mes de la boleta.
            </li>
            <li>
              Selecciona o arrastra los PDF: se{" "}
              <span className="font-medium text-white">apilan en la cola</span>.
              Puedes eliminar cualquiera antes de enviar.
            </li>
            <li>
              Pulsa{" "}
              <span className="font-medium text-white">Aceptar</span> para
              subir. Luego cada usuario ve sus documentos en{" "}
              <span className="font-medium text-white">Mis Boletas</span> e{" "}
              <span className="font-medium text-white">Inicio</span>.
            </li>
          </ol>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl md:p-6">
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs text-gray-400">
                Tipo de documento
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                disabled={sending}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3"
              >
                <option value="dni">DNI</option>
                <option value="ce">Carné Extranjería</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs text-gray-400">
                Año de la boleta
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                disabled={sending}
                placeholder="Año"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-gray-400">
                Mes de la boleta
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                disabled={sending}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3"
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
          </div>

          <Dropzone onFiles={queueFiles} onEmptyDrop={reportEmptyDrop} />

          {notice && (
            <p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
              {notice}
            </p>
          )}

          <UploadTable
            uploads={uploads}
            onRemove={removeFile}
            disabled={sending}
          />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-400">
              {pendingCount > 0
                ? `${pendingCount} documento(s) listos para enviar`
                : "Agrega PDFs a la cola para habilitar el envío"}
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={clearFinished}
                disabled={sending}
                className="rounded-xl border border-white/15 px-4 py-3 text-sm text-gray-300 transition hover:bg-white/5 disabled:opacity-50"
              >
                Limpiar subidos
              </button>
              <button
                type="button"
                onClick={submitUploads}
                disabled={sending || pendingCount === 0}
                className={`rounded-xl px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  pendingCount > 0
                    ? "bg-accent hover:bg-green-500 shadow-[0_0_24px_rgba(29,185,84,0.35)]"
                    : "bg-accent/70"
                }`}
              >
                {sending
                  ? "Subiendo…"
                  : `Aceptar y subir${pendingCount ? ` (${pendingCount})` : ""}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
