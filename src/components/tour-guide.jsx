"use client";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    target: "#menu-dashboard",
    title: "📊 Dashboard",
    content:
      "Halaman utama yang menampilkan rangkuman menyeluruh dari aktivitas pada sistem, mencakup statistik pesanan, pembayaran, serta informasi penting lainnya.",
  },
  {
    target: "#menu-orders",
    title: "📦 Orders",
    content:
      "Menu untuk mengelola seluruh pesanan yang masuk, termasuk pesanan dengan berbagai status (baru, diproses, selesai) serta pesanan yang belum dikonfirmasi.",
  },
  {
    target: "#menu-finance",
    title: "💰 Payments",
    content:
      "Bagian untuk memantau dan mengelola transaksi keuangan. Di sini Anda dapat melihat pembayaran dengan status dibayar/selesai, serta memeriksa virtual account yang aktif maupun sudah ditutup.",
  },
  {
    target: "#menu-rekanan-active",
    title: "🤝 Rekanan",
    content:
      "Menu rekanan yang mencakup daftar rekanan aktif, rekanan nonaktif, serta riwayat kerjasama yang pernah dilakukan.",
  },
];

export default function TourGuide() {
  const EXPIRY_HOURS = 24;

  const [currentStep, setCurrentStep] = useState(0);
  const [seen, setSeen] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const tourData = JSON.parse(localStorage.getItem("tourSeen") || "{}");
    const hasSeen = tourData?.seen || false;
    // const hasSeen = localStorage.getItem("tourSeen") === "true";
    setSeen(hasSeen);
  }, []);

  const handleSkip = () => {
    const data = {
      seen: true,
      timestamp: Date.now(), // waktu disimpan
    };
    localStorage.setItem("tourSeen", JSON.stringify(data));
    setSeen(true);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const data = {
        seen: true,
        timestamp: Date.now(),
      };
      localStorage.setItem("tourSeen", JSON.stringify(data));
      setSeen(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (seen) return null;

  const step = steps[currentStep];
  const targetEl = document.querySelector(step.target);
  const rect = targetEl?.getBoundingClientRect();

  let top = 0;
  let left = 0;

  if (rect && tooltipRef.current) {
    const tooltipHeight = tooltipRef.current.offsetHeight;
    const tooltipWidth = tooltipRef.current.offsetWidth;

    // posisi vertikal: sejajarkan tengah target dengan tengah tooltip
    top = rect.top + window.scrollY + rect.height / 2 - tooltipHeight / 2;

    // posisi horizontal: kanan target + sedikit jarak
    left = rect.left + rect.width + 20;
  }

  return (
    <>
      {/* Overlay gelap */}
      <div className="fixed inset-0 bg-black/40 z-[80]" />

      {/* Tooltip Card */}
      {rect && (
        <div
          ref={tooltipRef}
          className="absolute z-[100] bg-white rounded-xl shadow-lg border p-5 w-80 animate-fadeIn"
          style={{ top, left }}
        >
          {/* Arrow */}
          <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-[10px] border-y-transparent border-r-[10px] border-r-white drop-shadow" />

          {/* Header */}
          <h2 className="font-semibold text-gray-900 flex items-center gap-2 text-base">
            {step.title}
          </h2>

          {/* Content */}
          <p className="text-sm text-gray-600 mt-2">{step.content}</p>

          {/* Actions */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 text-sm cursor-pointer hover:underline"
            >
              Lewati
            </button>

            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="btn btn-sm bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-40"
              >
                Kembali
              </button>
              <button
                onClick={handleNext}
                className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
              >
                {currentStep < steps.length - 1
                  ? `Next (Step ${currentStep + 1} of ${steps.length})`
                  : "Selesai ✅"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
