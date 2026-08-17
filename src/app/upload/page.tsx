"use client";

import Layout from "@/components/layout/Layout";
import Dropzone from "@/components/upload/Dropzone";
import UploadTable from "@/components/upload/UploadTable";
import { useUploads } from "@/hooks/useUploads";
import { useState } from "react";

export default function Upload() {
  const [documentType, setDocumentType] =
    useState("dni");

  const [year, setYear] =
    useState("2026");

  const [month, setMonth] =
    useState("05");

  const {
    uploads,
    addFiles,
    removeFile,
  } = useUploads({
    documentType,
    year,
    month,
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">
          Carga Masiva de Documentos
        </h1>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 shadow-xl">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

            <select
              value={documentType}
              onChange={(e) =>
                setDocumentType(e.target.value)
              }
              className="bg-black/30 border border-white/10 rounded-lg px-4 py-3"
            >
              <option value="dni">
                DNI
              </option>

              <option value="ce">
                Carné Extranjería
              </option>
            </select>

            <input
              type="text"
              value={year}
              onChange={(e) =>
                setYear(e.target.value)
              }
              placeholder="Año"
              className="bg-black/30 border border-white/10 rounded-lg px-4 py-3"
            />

            <select
              value={month}
              onChange={(e) =>
                setMonth(e.target.value)
              }
              className="bg-black/30 border border-white/10 rounded-lg px-4 py-3"
            >
              <option value="01">
                Enero
              </option>

              <option value="02">
                Febrero
              </option>

              <option value="03">
                Marzo
              </option>

              <option value="04">
                Abril
              </option>

              <option value="05">
                Mayo
              </option>

              <option value="06">
                Junio
              </option>

              <option value="07">
                Julio
              </option>

              <option value="08">
                Agosto
              </option>

              <option value="09">
                Septiembre
              </option>

              <option value="10">
                Octubre
              </option>

              <option value="11">
                Noviembre
              </option>

              <option value="12">
                Diciembre
              </option>
            </select>
          </div>

          <Dropzone onFiles={addFiles} />

          <UploadTable
            uploads={uploads}
            onRemove={removeFile}
          />
        </div>
      </div>
    </Layout>
  );
}