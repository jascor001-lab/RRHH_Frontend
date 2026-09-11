"use client";

import { useEffect, useRef, useState } from "react";

type DropzoneProps = {
  onFiles: (files: File[]) => void;
  onEmptyDrop?: () => void;
};

function collectDroppedFiles(dataTransfer: DataTransfer): File[] {
  const fromFiles = Array.from(dataTransfer.files || []);
  if (fromFiles.length > 0) {
    return fromFiles;
  }

  const fromItems: File[] = [];
  const items = dataTransfer.items;

  if (!items) {
    return [];
  }

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (item.kind === "file") {
      const file = item.getAsFile();
      if (file) {
        fromItems.push(file);
      }
    }
  }

  return fromItems;
}

export default function Dropzone({ onFiles, onEmptyDrop }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);

  useEffect(() => {
    const allowDrop = (event: DragEvent) => {
      event.preventDefault();
    };

    window.addEventListener("dragover", allowDrop);
    window.addEventListener("drop", allowDrop);

    return () => {
      window.removeEventListener("dragover", allowDrop);
      window.removeEventListener("drop", allowDrop);
    };
  }, []);

  const deliverFiles = (files: File[]) => {
    if (files.length === 0) {
      onEmptyDrop?.();
      return;
    }

    onFiles(files);
  };

  return (
    <div
      className={`rounded-xl border border-dashed p-6 text-center transition md:p-10 ${
        dragging
          ? "border-green-400 bg-green-500/15 ring-2 ring-green-400/30"
          : "border-white/20 bg-white/5 hover:border-green-400/40"
      }`}
      onDragEnter={(event) => {
        event.preventDefault();
        event.stopPropagation();
        dragDepth.current += 1;
        setDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = "copy";
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        event.stopPropagation();
        dragDepth.current = Math.max(0, dragDepth.current - 1);
        if (dragDepth.current === 0) {
          setDragging(false);
        }
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        dragDepth.current = 0;
        setDragging(false);
        deliverFiles(collectDroppedFiles(event.dataTransfer));
      }}
    >
      <p className="text-sm text-gray-300 md:text-base">
        Arrastra aquí varios PDF con DNI distintos
      </p>
      <p className="mt-2 text-xs text-gray-400">
        Al soltar se agregan a la cola. Después pulsa{" "}
        <span className="font-medium text-green-300">Aceptar y subir</span>.
      </p>
      <p className="mt-2 text-xs text-amber-200/80">
        Si arrastras desde una carpeta de red y no aparece nada, usa el botón.
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-4 rounded-lg bg-green-500 px-5 py-2 font-medium transition hover:bg-green-600"
      >
        Seleccionar archivos
      </button>

      <input
        type="file"
        multiple
        accept=".pdf,application/pdf,*/*"
        className="hidden"
        ref={inputRef}
        onChange={(event) => {
          deliverFiles(Array.from(event.target.files || []));
          event.target.value = "";
        }}
      />
    </div>
  );
}
