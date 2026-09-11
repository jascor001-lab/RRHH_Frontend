"use client";

import { useRef, useState } from "react";

import { getFilesApi } from "@/lib/api";

export type UploadStatus = "pending" | "uploading" | "done" | "error";

export type UploadFile = {
  id: string;
  file: File;
  dni: string;
  progress: number;
  status: UploadStatus;
  path?: string;
  errorMessage?: string;
};

type UploadConfig = {
  documentType: string;
  year: string;
  month: string;
};

export function extractDocumentNumber(fileName: string) {
  const match = fileName.match(/(\d{8})/);
  return match?.[1] || null;
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `up-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function isPdfFile(file: File) {
  if (/\.pdf$/i.test(file.name)) {
    return true;
  }

  if (
    file.type === "application/pdf" ||
    file.type === "application/x-pdf"
  ) {
    return true;
  }

  // Windows / carpetas de red a veces no informan el tipo
  return !file.type || file.type === "application/octet-stream";
}

export function useUploads(config: UploadConfig) {
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const [notice, setNotice] = useState("");
  const [sending, setSending] = useState(false);
  const configRef = useRef(config);
  configRef.current = config;

  const pendingCount = uploads.filter((f) => f.status === "pending").length;

  const queueFiles = (files: FileList | File[]) => {
    try {
      const list = Array.from(files || []);
      setNotice("");

      if (list.length === 0) {
        setNotice(
          "El arrastre no entregó archivos (suele pasar con carpetas de red). Usa Seleccionar archivos.",
        );
        return;
      }

      const rejected: string[] = [];
      const candidates: UploadFile[] = [];

      for (const file of list) {
        const dni = extractDocumentNumber(file.name);

        if (!isPdfFile(file)) {
          rejected.push(`${file.name} (no es PDF)`);
          continue;
        }

        if (!dni) {
          rejected.push(`${file.name} (sin DNI de 8 dígitos)`);
          continue;
        }

        const duplicatedInBatch = candidates.some(
          (item) =>
            item.file.name === file.name && item.file.size === file.size,
        );

        if (duplicatedInBatch) {
          continue;
        }

        candidates.push({
          id: createId(),
          file,
          dni,
          progress: 0,
          status: "pending",
        });
      }

      if (candidates.length === 0) {
        setNotice(
          rejected.length > 0
            ? `No se agregaron: ${rejected.slice(0, 4).join(", ")}${
                rejected.length > 4 ? "…" : ""
              }`
            : "No hay archivos nuevos para agregar a la cola.",
        );
        return;
      }

      setUploads((prev) => {
        const fresh = candidates.filter(
          (candidate) =>
            !prev.some(
              (item) =>
                item.status === "pending" &&
                item.file.name === candidate.file.name &&
                item.file.size === candidate.file.size,
            ),
        );

        if (fresh.length === 0) {
          queueMicrotask(() =>
            setNotice("Esos archivos ya están en la cola."),
          );
          return prev;
        }

        queueMicrotask(() =>
          setNotice(
            rejected.length > 0
              ? `${fresh.length} en cola. No se agregaron: ${rejected
                  .slice(0, 3)
                  .join(", ")}`
              : `${fresh.length} archivo(s) en cola. Ahora pulsa «Aceptar y subir».`,
          ),
        );

        return [...prev, ...fresh];
      });
    } catch (error) {
      console.error(error);
      setNotice(
        "No se pudo agregar el archivo a la cola. Recarga la página e inténtalo de nuevo.",
      );
    }
  };

  const uploadFile = async (upload: UploadFile) => {
    const documentNumber = upload.dni || extractDocumentNumber(upload.file.name);

    if (!documentNumber) {
      setUploads((prev) =>
        prev.map((f) =>
          f.id === upload.id
            ? {
                ...f,
                status: "error",
                errorMessage: "El nombre debe incluir un DNI de 8 dígitos",
              }
            : f,
        ),
      );
      return;
    }

    setUploads((prev) =>
      prev.map((f) =>
        f.id === upload.id
          ? { ...f, status: "uploading", progress: 0, errorMessage: undefined }
          : f,
      ),
    );

    try {
      const { documentType, year, month } = configRef.current;
      const formData = new FormData();

      formData.append("file", upload.file);
      formData.append("documentType", documentType);
      formData.append("documentNumber", documentNumber);
      formData.append("year", year);
      formData.append("month", month);

      await new Promise<void>((resolve) => {
        const xhr = new XMLHttpRequest();

        xhr.open("POST", `${getFilesApi()}/files/upload/employee`);

        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;

          const progress = (event.loaded / event.total) * 100;

          setUploads((prev) =>
            prev.map((f) =>
              f.id === upload.id ? { ...f, progress } : f,
            ),
          );
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            let path: string | undefined;

            try {
              path = JSON.parse(xhr.responseText)?.path;
            } catch {
              path = undefined;
            }

            setUploads((prev) =>
              prev.map((f) =>
                f.id === upload.id
                  ? {
                      ...f,
                      progress: 100,
                      status: "done",
                      path,
                    }
                  : f,
              ),
            );
          } else {
            setUploads((prev) =>
              prev.map((f) =>
                f.id === upload.id
                  ? {
                      ...f,
                      status: "error",
                      errorMessage: `Error al subir (${xhr.status})`,
                    }
                  : f,
              ),
            );
          }

          resolve();
        };

        xhr.onerror = () => {
          setUploads((prev) =>
            prev.map((f) =>
              f.id === upload.id
                ? {
                    ...f,
                    status: "error",
                    errorMessage: "Error de conexión al subir",
                  }
                : f,
            ),
          );
          resolve();
        };

        xhr.send(formData);
      });
    } catch (error) {
      console.error(error);

      setUploads((prev) =>
        prev.map((f) =>
          f.id === upload.id
            ? {
                ...f,
                status: "error",
                errorMessage: "Error inesperado al subir",
              }
            : f,
        ),
      );
    }
  };

  const submitUploads = async () => {
    const pending = uploads.filter((f) => f.status === "pending");

    if (pending.length === 0) {
      setNotice("No hay documentos pendientes. Agrega PDFs a la cola primero.");
      return;
    }

    setSending(true);
    setNotice(`Subiendo ${pending.length} documento(s)…`);

    for (const item of pending) {
      await uploadFile(item);
    }

    setSending(false);
    setNotice(
      "Carga finalizada. Cada trabajador verá su boleta en Mis Boletas con su DNI.",
    );
  };

  const removeFile = (id: string) => {
    setUploads((prev) => prev.filter((f) => f.id !== id));
  };

  const clearFinished = () => {
    setUploads((prev) =>
      prev.filter((f) => f.status === "pending" || f.status === "uploading"),
    );
  };

  const reportEmptyDrop = () => {
    setNotice(
      "El arrastre no entregó archivos. Usa Seleccionar archivos (carpetas de red suelen fallar al arrastrar).",
    );
  };

  return {
    uploads,
    notice,
    sending,
    pendingCount,
    queueFiles,
    submitUploads,
    removeFile,
    clearFinished,
    reportEmptyDrop,
  };
}
