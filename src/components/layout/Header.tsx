import { Menu } from "lucide-react";

export default function Header({ onMenu }: any) {
  return (
    <header className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-xl border-b border-white/10">

      <div className="flex items-center gap-2">
        <button onClick={onMenu} className="md:hidden">
          <Menu />
        </button>

        <h1 className="font-bold text-sm md:text-base">
          Recursos Humanos
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-sm">
          Juan Pérez
        </span>

        <div className="w-8 h-8 bg-green-500 rounded-full" />
      </div>
    </header>
  );
}