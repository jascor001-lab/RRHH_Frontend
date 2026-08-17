export default function Search() {
  return (
    <div className="flex gap-2">
      <input
        className="p-2 rounded bg-[#123C34] w-full"
        placeholder="Ingrese DNI"
      />

      <button className="bg-accent px-4 rounded">
        Buscar
      </button>
    </div>
  );
}