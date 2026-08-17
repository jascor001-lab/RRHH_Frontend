"use client";
import { useRef } from "react";

export default function Dropzone({ onFiles }: any) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="border border-dashed border-white/20 rounded-xl p-6 md:p-10 text-center bg-white/5"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onFiles(e.dataTransfer.files);
      }}
    >
      <p className="text-sm md:text-base text-gray-300">
        Arrastra y suelta múltiples PDF aquí
      </p>

      <button
        onClick={() => inputRef.current?.click()}
        className="mt-4 bg-green-500 hover:bg-green-600 transition px-5 py-2 rounded-lg font-medium"
      >
        Seleccionar archivos
      </button>

      <input
        type="file"
        multiple
        accept="application/pdf"
        hidden
        ref={inputRef}
        onChange={(e) => e.target.files && onFiles(e.target.files)}
      />
    </div>
  );
}