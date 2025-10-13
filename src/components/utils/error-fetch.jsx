import { AlertCircle } from "lucide-react";

export default function ErrorState({
  message = "Terjadi kesalahan saat memuat data.",
  onRetry,
}) {
  return (
    <div className="p-6 text-center rounded-md bg-red-50 dark:bg-slate-800 border border-red-300 dark:border-slate-600 max-w-xl mx-auto mt-12">
      <div className="flex justify-center mb-4">
        <AlertCircle className="w-10 h-10 text-red-600" />
      </div>
      <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
        Gagal Memuat Data
      </h2>
      <p className="text-sm text-red-600 dark:text-slate-300 mb-4">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-block px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
}
