"use client";

import { useEffect, useState } from "react";

import { getFilesApi } from "@/lib/api";

export type EmployeeFile = {
  key: string;
  size: number;
  lastModified: string;
};

export function useEmployeeFiles(
  documentType: string,
  documentNumber: string,
) {
  const [files, setFiles] = useState<EmployeeFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!documentType || !documentNumber) {
      setFiles([]);
      setLoading(false);
      return;
    }

    loadFiles();
  }, [documentType, documentNumber]);

  const loadFiles = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${getFilesApi()}/files/employee?documentType=${documentType}&documentNumber=${documentNumber}`,
      );

      if (!response.ok) {
        setFiles([]);
        return;
      }

      const data = await response.json();
      const list = Array.isArray(data) ? data : [];
      setFiles(
        [...list].sort(
          (a, b) =>
            new Date(b.lastModified).getTime() -
            new Date(a.lastModified).getTime(),
        ),
      );
    } catch (error) {
      console.error(error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    files,
    loading,
  };
}