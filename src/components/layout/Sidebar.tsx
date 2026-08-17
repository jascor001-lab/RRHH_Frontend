import { Home, FileText, User, LogOut } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white/5 backdrop-blur-xl border-r border-white/10 p-4 flex flex-col justify-between">

      <div>
        <h2 className="text-lg font-bold mb-6">
          La Molina
        </h2>

        <nav className="space-y-2">
          <a className="flex items-center gap-2 p-2 rounded-lg bg-green-500/20 text-green-400">
            <Home size={18}/> Inicio
          </a>

          <a className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10">
            <FileText size={18}/> Mis Boletas
          </a>

          <a className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10">
            <User size={18}/> Perfil
          </a>
        </nav>
      </div>

      <button className="flex items-center gap-2 text-red-400 hover:bg-red-500/10 p-2 rounded-lg">
        <LogOut size={18}/> Cerrar sesión
      </button>
    </aside>
  );
}