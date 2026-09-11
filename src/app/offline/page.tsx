export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#061915] px-6 text-center text-white">
      <div className="max-w-md rounded-2xl border border-green-400/20 bg-black/30 p-8">
        <h1 className="mb-3 text-2xl font-bold">Sin conexión</h1>
        <p className="mb-6 text-sm text-gray-300">
          No hay conexión a internet. Revisa tu red e intenta nuevamente.
        </p>
        <a
          href="/login"
          className="inline-flex rounded-xl bg-[#1DB954] px-4 py-3 text-sm font-semibold text-white"
        >
          Reintentar
        </a>
      </div>
    </main>
  );
}
