import React, { useEffect, useRef, useState } from "react";
import { exportOrders, exportOrdersStatus } from "../api";
import { useAuthStore } from "../stores";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const DOWNLOAD_PREFIX = "https://api.siplah.dashboard.eurekagroup.id";

export default function DownloadExcel({ open, onClose }) {
  const { token } = useAuthStore();
  const [step, setStep] = useState(1);
  const [filterOption, setFilterOption] = useState("all");
  const [jobId, setJobId] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState(null);
  const [visibleProgress, setVisibleProgress] = useState(0);
  const progressRef = useRef(0);
  const animationFrameRef = useRef(null);

  // Filter fields
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  // Polling status export tiap 2 detik
  useEffect(() => {
    if (!jobId || step !== 2) return;

    const interval = setInterval(async () => {
      try {
        const res = await exportOrdersStatus(jobId);
        if (res?.data) {
          setStatusData(res);
          animateProgress(res.data.progress || 0);
          if (res.data.status === "completed" || res.data.status === "failed") {
            clearInterval(interval);
            setStep(3);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId, step]);

  const animateProgress = (target) => {
    cancelAnimationFrame(animationFrameRef.current);
    const duration = 500;
    const start = progressRef.current;
    const diff = target - start;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const value = start + diff * progress;
      progressRef.current = value;
      setVisibleProgress(Math.round(value));
      if (progress < 1)
        animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // helper untuk tampilkan date dd/mm/yyyy
  // const formatDateToDisplay = (isoDate) => {
  //   const [year, month, day] = isoDate.split("-");
  //   return `${day}/${month}/${year}`;
  // };

  // useEffect(() => {
  //   console.log("Start Date:", formatDisplay(startDate));
  //   console.log("End Date:", formatDisplay(endDate));
  // }, [startDate, endDate]);

  const handleStartExport = async () => {
    try {
      const payload =
        filterOption === "filtered"
          ? {
              search,
              status: statusFilter,
              startDate,
              endDate,
            }
          : {};

      const res = await exportOrders(payload);
      if (res?.data?.jobId) {
        setJobId(res.data.jobId);
        setStep(2);
      }
    } catch (err) {
      console.error(err);
      setError("Gagal memulai export. Silakan coba lagi.");
    }
  };

  const handleDownload = async () => {
    if (!statusData?.data?.file?.url) {
      setError(
        "File tidak tersedia pada response. Silakan coba lagi atau hubungi tim IT."
      );
      return;
    }

    const fileUrl = DOWNLOAD_PREFIX + statusData.data.file.url;

    try {
      const response = await fetch(fileUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Gagal mengunduh file.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = statusData.data.file.filename || `rekap_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat mengunduh file.");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 "
      onClick={(e) => {
        // pastikan klik di luar modal
        if (e.target === e.currentTarget && step === 1) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-[520px] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Download Recap Excel</h2>
          {/* {step === 1 && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              ✕
            </button>
          )} */}

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {step === 1 && (
          <div className="space-y-4">
            <p>Pilih metode download:</p>
            <div className="form-control">
              <label className="label cursor-pointer mr-4">
                <span className="label-text">Download Semua Rekap</span>
                <input
                  type="radio"
                  name="downloadOption"
                  className="radio checked:bg-blue-500"
                  checked={filterOption === "all"}
                  onChange={() => setFilterOption("all")}
                />
              </label>
              <label className="label cursor-pointer">
                <span className="label-text">Download Berdasarkan Filter</span>
                <input
                  type="radio"
                  name="downloadOption"
                  className="radio checked:bg-blue-500"
                  checked={filterOption === "filtered"}
                  onChange={() => setFilterOption("filtered")}
                />
              </label>
            </div>

            {filterOption === "filtered" && (
              <div className="grid grid-cols-1 gap-3">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari (order_id / invoice / nama perusahaan / NPSN)"
                  className="input input-bordered w-full"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">Semua Status</option>
                  <option value="0">Pesanan Baru</option>
                  <option value="2">Diproses</option>
                  <option value="3">Dikirim</option>
                  <option value="17">Diterima</option>
                  <option value="18">Dibayar</option>
                  <option value="20">Selesai</option>
                  <option value="7">Dibatalkan</option>
                  <option value="21">Ditutup</option>
                </select>

                <div className="flex gap-10">
                  <div className="flex flex-col">
                    <label>Start Date</label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      dateFormat="dd/MM/yyyy"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label>End Date</label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      dateFormat="dd/MM/yyyy"
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              className="btn btn-primary w-full"
              onClick={handleStartExport}
            >
              Mulai Download
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p>Status Export:</p>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${visibleProgress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm">{visibleProgress}%</p>
            <p className="text-sm text-gray-500">
              {statusData?.data?.message || "Memproses data..."}
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-center">
            <p className="text-green-600 font-semibold">Export Selesai!</p>
            <button
              className="btn btn-success w-full text-white"
              onClick={handleDownload}
            >
              Unduh File Excel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
