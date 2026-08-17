"use client";

import { useState } from "react";

export type UploadFile = {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "done" | "error";
  path?: string;
};

type UploadConfig = {
  documentType: string;
  year: string;
  month: string;
};

export function useUploads(config: UploadConfig) {
  const [uploads, setUploads] = useState<UploadFile[]>([]);

  const addFiles = async (files: FileList) => {
    const newFiles: UploadFile[] = Array.from(files).map(
      (file) => ({
        id: crypto.randomUUID(),
        file,
        progress: 0,
        status: "uploading",
      }),
    );

    setUploads((prev) => [...prev, ...newFiles]);

    for (const file of newFiles) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (
    upload: UploadFile,
  ) => {
    try {
      const formData = new FormData();

      const documentNumber = upload.file.name
        .replace(".pdf", "")
        .trim();

      formData.append("file", upload.file);

      formData.append(
        "documentType",
        config.documentType,
      );

      formData.append(
        "documentNumber",
        documentNumber,
      );

      formData.append("year", config.year);

      formData.append("month", config.month);

      const xhr = new XMLHttpRequest();

      xhr.open(
        "POST",
        "http://localhost:3000/files/upload/employee",
      );

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;

        const progress =
          (event.loaded / event.total) * 100;

        setUploads((prev) =>
          prev.map((f) =>
            f.id === upload.id
              ? {
                  ...f,
                  progress,
                }
              : f,
          ),
        );
      };

      xhr.onload = () => {
        if (
          xhr.status >= 200 &&
          xhr.status < 300
        ) {
          const response = JSON.parse(
            xhr.responseText,
          );

          setUploads((prev) =>
            prev.map((f) =>
              f.id === upload.id
                ? {
                    ...f,
                    progress: 100,
                    status: "done",
                    path: response.path,
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
                  }
                : f,
            ),
          );
        }
      };

      xhr.onerror = () => {
        setUploads((prev) =>
          prev.map((f) =>
            f.id === upload.id
              ? {
                  ...f,
                  status: "error",
                }
              : f,
          ),
        );
      };

      xhr.send(formData);
    } catch (error) {
      console.error(error);

      setUploads((prev) =>
        prev.map((f) =>
          f.id === upload.id
            ? {
                ...f,
                status: "error",
              }
            : f,
        ),
      );
    }
  };

  const removeFile = (id: string) => {
    setUploads((prev) =>
      prev.filter((f) => f.id !== id),
    );
  };

  return {
    uploads,
    addFiles,
    removeFile,
  };
}