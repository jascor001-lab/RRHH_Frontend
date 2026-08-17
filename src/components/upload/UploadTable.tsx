export default function UploadTable({ uploads, onRemove }: any) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-gray-400 border-b border-white/10">
          <tr>
            <th className="text-left py-3">Archivo</th>
            <th className="text-left py-3">Estado</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {uploads.map((file: any) => (
            <tr key={file.id} className="border-b border-white/5">
              <td className="py-3">{file.file.name}</td>

              <td className="py-3">
                {file.status === "uploading" && (
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-700 rounded">
                      <div
                        className="h-2 bg-purple-500 rounded"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      {Math.round(file.progress)}%
                    </span>
                  </div>
                )}

                {file.status === "done" && (
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">
                    ✔ Completado
                  </span>
                )}

                {file.status === "error" && (
                  <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs">
                    ⚠ Error
                  </span>
                )}
              </td>

              <td>
                <button
                  onClick={() => onRemove(file.id)}
                  className="text-gray-400 hover:text-red-400"
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}