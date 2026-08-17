import Search from "@/components/consulta/Search";
import Results from "@/components/consulta/Results";

export default function Consulta() {
  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">
        Buscar documentos por DNI
      </h1>

      <Search />
      <Results />
    </div>
  );
}