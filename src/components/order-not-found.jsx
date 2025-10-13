import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const OrderNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-6">
      <div className="card w-full max-w-lg shadow-xl bg-base-100 border border-base-300">
        <div className="card-body items-center text-center animate-fadeIn">
          {/* Icon Warning */}
          <div className="bg-error/10 p-4 rounded-full mb-6">
            <AlertCircle className="w-12 h-12 text-error" />
          </div>

          {/* Title */}
          <h2 className="card-title text-2xl font-bold mb-3">
            Order Tidak Ditemukan
          </h2>

          {/* Description */}
          <p className="text-base-content/70 mb-6">
            Maaf, halaman atau jenis order yang Anda cari tidak tersedia.
            Pastikan Anda memilih jenis order yang benar.
          </p>

          {/* Actions */}
          <div className="card-actions justify-center gap-4">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/orders")}
            >
              Kembali ke Daftar Order
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/")}>
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderNotFound;
