"use client";

import { useEffect, useState } from "react";

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
    loadFiles();
  }, [documentType, documentNumber]);

  const loadFiles = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:3000/files/employee?documentType=${documentType}&documentNumber=${documentNumber}`,
      );

      const data = await response.json();

      setFiles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    files,
    loading,
  };
}