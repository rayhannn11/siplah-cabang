import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white  text-slate-800 dark:text-slate-800 p-4">
      <div className="text-center max-w-md">
        <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h1 className="text-4xl font-bold mb-2">
          404 - Halaman Tidak Ditemukan
        </h1>
        <p className="mb-6 text-sm text-slate-600 ">
          Maaf, halaman yang kamu cari tidak tersedia atau telah dipindahkan.
        </p>
        <Link
          to="/internal/mitraku/login"
          className="btn btn-sm btn-primary normal-case"
        >
          Kembali ke halaman Login
        </Link>
      </div>
    </div>
  );
}
