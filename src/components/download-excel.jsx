import React, { useEffect, useRef, useState } from "react";
import {
  exportOrders,
  exportOrdersStatus,
  exportPaymentsReport,
  exportPaymentStatus,
  exportTagihanStatus,
  exportTagihanReport,
} from "../api";
import { useAuthStore } from "../stores";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

import { format } from "date-fns";

const DOWNLOAD_PREFIX = "https://api.siplah.dashboard.eurekagroup.id";

const statusOptions = [
  { value: "0", label: "Pesanan Baru" },
  { value: "2", label: "Diproses" },
  { value: "3", label: "Dikirim" },
  { value: "17", label: "Diterima" },
  { value: "18", label: "Dibayar" },
  { value: "20", label: "Selesai" },
  { value: "7", label: "Dibatalkan" },
  { value: "21", label: "Ditutup" },
];

export default function DownloadExcel({ type = "orders", open, onClose }) {
  const { token } = useAuthStore();

  const exportFn =
    type === "tagihan"
      ? exportTagihanReport
      : type === "payments"
      ? exportPaymentsReport
      : exportOrders;

  const checkStatusFn =
    type === "tagihan"
      ? exportTagihanStatus
      : type === "payments"
      ? exportPaymentStatus
      : exportOrdersStatus;

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
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  const [tagihanFilterMode, setTagihanFilterMode] = useState("date");

  // Polling status export tiap 2 detik
  useEffect(() => {
    if (!jobId || step !== 2) return;

    const interval = setInterval(async () => {
      try {
        const res = await checkStatusFn(jobId);
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

  const handleStatusChange = (selected) => {
    setSelectedStatuses(selected);
    const joinedValues = selected.map((s) => s.value).join(","); // "2,3"
    setStatusFilter(joinedValues);
  };

  const handleStartExport = async () => {
    try {
      // const payload =
      //   filterOption === "filtered"
      //     ? type === "payments"
      //       ? {
      //           search,
      //           is_forwarded: statusFilter, // ✅ sesuai Swagger
      //           startDate,
      //           endDate,
      //         }
      //       : {
      //           search,
      //           status: statusFilter,
      //           startDate,
      //           endDate,
      //         }
      //     : {};
      let payload = {};

      if (filterOption === "filtered") {
        if (type === "tagihan") {
          // payload =
          //   startDate && endDate ? { startDate, endDate } : { month, year };
          if (tagihanFilterMode === "date") {
            payload = { startDate, endDate };
          } else {
            payload = { month, year };
          }
        } else if (type === "payments") {
          // 💰 PAYMENTS
          payload = {
            search,
            is_forwarded: statusFilter,
            startDate,
            endDate,
          };
        } else {
          // 📦 ORDERS
          payload = {
            search,
            status: statusFilter,
            startDate,
            endDate,
          };
        }
      }

      const res = await exportFn(payload);
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
      className="dark:text-black fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 "
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
          <h2 className="text-lg font-semibold">
            Download Recap Excel{" "}
            {type === "tagihan"
              ? "Tagihan"
              : type === "payments"
              ? "Pembayaran"
              : "Pesanan"}
          </h2>
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
                  className="radio checked:bg-blue-500 "
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
                  className="input input-bordered w-full  dark:text-black dark:bg-white dark:outline-1 dark:outline-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                {/* {type === "payments" ? (
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="select select-bordered w-full dark:text-black dark:bg-white dark:outline-1 dark:outline-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Semua</option>
                    <option value="false">Diteruskan </option>
                    <option value="true">Selesai </option>
                  </select>
                ) : (
                  <Select
                    isMulti
                    options={statusOptions}
                    value={selectedStatuses}
                    onChange={handleStatusChange}
                    placeholder="Pilih status..."
                    classNamePrefix="react-select"
                    className="dark:text-black"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: "#d1d5db",
                        borderRadius: "0.5rem",
                        padding: "2px",
                      }),
                    }}
                  />
                )} */}

                {type === "payments" ? (
                  // 💰 FILTER UNTUK PAYMENTS
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="select select-bordered w-full dark:text-black dark:bg-white dark:outline-1 dark:outline-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Semua</option>
                    <option value="false">Diteruskan</option>
                    <option value="true">Selesai</option>
                  </select>
                ) : type === "orders" ? (
                  // 📦 FILTER UNTUK ORDERS
                  <Select
                    isMulti
                    options={statusOptions}
                    value={selectedStatuses}
                    onChange={handleStatusChange}
                    placeholder="Pilih status..."
                    classNamePrefix="react-select"
                    className="dark:text-black"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: "#d1d5db",
                        borderRadius: "0.5rem",
                        padding: "2px",
                      }),
                    }}
                  />
                ) : null}

                {type === "tagihan" && (
                  <div className="space-y-4">
                    {/* === 🔘 PILIH MODE FILTER === */}
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text font-medium">
                          Gunakan Rentang Tanggal
                        </span>
                        <input
                          type="radio"
                          name="tagihanFilterMode"
                          className="radio checked:bg-blue-500"
                          checked={tagihanFilterMode === "date"}
                          onChange={() => setTagihanFilterMode("date")}
                        />
                      </label>

                      <label className="ml-6 label cursor-pointer">
                        <span className="label-text font-medium">
                          Gunakan Bulan & Tahun
                        </span>
                        <input
                          type="radio"
                          name="tagihanFilterMode"
                          className="radio checked:bg-blue-500"
                          checked={tagihanFilterMode === "year"}
                          onChange={() => setTagihanFilterMode("year")}
                        />
                      </label>
                    </div>

                    {/* === 📆 RANGE DATE MODE === */}
                    {tagihanFilterMode === "date" && (
                      <div className="flex gap-10">
                        <div className="flex flex-col">
                          <label>Start Date</label>
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="input input-bordered w-full dark:text-black dark:bg-white focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label>End Date</label>
                          <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="input input-bordered w-full dark:text-black dark:bg-white focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* === 🗓️ RANGE YEAR MODE === */}
                    {tagihanFilterMode === "year" &&
                      (() => {
                        const currentYear = new Date().getFullYear();
                        const years = Array.from(
                          { length: currentYear - 2018 },
                          (_, i) => 2019 + i
                        );
                        const months = [
                          { value: 1, label: "Januari" },
                          { value: 2, label: "Februari" },
                          { value: 3, label: "Maret" },
                          { value: 4, label: "April" },
                          { value: 5, label: "Mei" },
                          { value: 6, label: "Juni" },
                          { value: 7, label: "Juli" },
                          { value: 8, label: "Agustus" },
                          { value: 9, label: "September" },
                          { value: 10, label: "Oktober" },
                          { value: 11, label: "November" },
                          { value: 12, label: "Desember" },
                        ];

                        return (
                          <div className="flex gap-3">
                            <select
                              value={month}
                              onChange={(e) => setMonth(e.target.value)}
                              className="select select-bordered w-1/2 dark:text-black dark:bg-white"
                            >
                              <option value="">Semua Bulan</option>
                              {months.map((m) => (
                                <option key={m.value} value={m.value}>
                                  {m.label}
                                </option>
                              ))}
                            </select>

                            <select
                              value={year}
                              onChange={(e) => setYear(e.target.value)}
                              className="select select-bordered w-1/2 dark:text-black dark:bg-white"
                            >
                              {years.map((y) => (
                                <option key={y} value={y}>
                                  {y}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      })()}
                  </div>
                )}

                {type !== "tagihan" && (
                  <div className="flex gap-10">
                    <div className="flex flex-col">
                      <label>Start Date</label>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="dd/MM/yyyy"
                        className="input input-bordered w-full dark:text-black dark:bg-white dark:outline-1 dark:outline-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label>End Date</label>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="dd/MM/yyyy"
                        className="input input-bordered w-full dark:text-black dark:bg-white dark:outline-1 dark:outline-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
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
