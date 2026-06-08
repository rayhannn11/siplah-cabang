import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchOrders,
  exportOrders,
  exportOrdersResult,
  exportOrdersStatus,
  exportPaymentsReport,
  exportPaymentResult,
  exportPaymentStatus,
  exportTagihanStatus,
  exportTagihanReport,
} from "../api";
import { useAuthStore } from "../stores";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_ORIGIN = new URL(API_BASE_URL).origin;

const fallbackOrderStatusOptions = [
  { value: "", label: "Semua Status" },
  { value: "0", label: "Pesanan Baru" },
  { value: "2", label: "Diproses" },
  { value: "3", label: "Dikirim" },
  { value: "4", label: "Sampai" },
  { value: "5", label: "Diterima" },
  { value: "7", label: "Dibatalkan" },
  { value: "8", label: "Ditolak Penyedia" },
  { value: "9", label: "Ditangguhkan Mitra" },
  { value: "10", label: "Pesanan Dibekukan" },
  {
    value: "12",
    label: "Penolakan Pengajuan Pembatalan oleh Penyedia atau Mitra SIPLah Eureka",
  },
  {
    value: "13",
    label: "Penolakan Pengajuan Pembatalan oleh Penyedia atau Mitra SIPLah Eureka",
  },
  { value: "14", label: "Kadaluarsa" },
  { value: "16", label: "Proses eBAST" },
  { value: "17", label: "Belum dibayar" },
  { value: "18", label: "Dibayar" },
  { value: "19", label: "Ditolak Pembeli" },
  { value: "20", label: "Selesai" },
  { value: "21", label: "Ditutup" },
  { value: "22", label: "Pengajuan Pembatalan dari Sekolah" },
];

export default function DownloadExcel({ type = "orders", open, onClose }) {
  const { token, user } = useAuthStore();

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

  const resultFn =
    type === "payments"
      ? exportPaymentResult
      : type === "orders"
        ? exportOrdersResult
        : null;
  const isNewExport =
    type === "orders" || type === "payments" || type === "tagihan";
  const canSelectFormat = type === "orders" || type === "payments";

  const [step, setStep] = useState(1);
  const [filterOption, setFilterOption] = useState(
    isNewExport ? "filtered" : "all",
  );
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
  const [orderStatusOptions, setOrderStatusOptions] = useState(
    fallbackOrderStatusOptions,
  );
  const [loadingStatusOptions, setLoadingStatusOptions] = useState(false);
  const [forwardedFilter, setForwardedFilter] = useState("");
  const [exportFormat, setExportFormat] = useState("xlsx");

  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  const [tagihanFilterMode, setTagihanFilterMode] = useState("date");
  const [tagihanInvoiceMode, setTagihanInvoiceMode] = useState("");

  const animateProgress = useCallback((target) => {
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
  }, []);

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

  useEffect(() => {
    if (!open || type !== "orders") return;

    let cancelled = false;

    const loadOrderStatusOptions = async () => {
      try {
        setLoadingStatusOptions(true);
        const response = await fetchOrders({ page: 1, limit: 10, status: "0" });
        const rawOptions = response?.filters?.status;

        if (!cancelled && Array.isArray(rawOptions) && rawOptions.length > 0) {
          const normalizedOptions = rawOptions
            .filter((item) => item && item.value !== undefined)
            .map((item) => ({
              value: String(item.value),
              label: item.name,
            }));

          setOrderStatusOptions(normalizedOptions);
          return;
        }
      } catch (err) {
        console.error("Gagal mengambil filter status order:", err);
      } finally {
        if (!cancelled) setLoadingStatusOptions(false);
      }

      if (!cancelled) {
        setOrderStatusOptions(fallbackOrderStatusOptions);
      }
    };

    loadOrderStatusOptions();

    return () => {
      cancelled = true;
    };
  }, [open, type]);

  const formatDate = (date) => {
    if (!date) return null;
    return date.toISOString().split("T")[0]; // hasil: "2025-11-08"
  };

  const exportPayload = useCallback(
    (response) => response?.data || response || {},
    [],
  );
  const exportJobId = useCallback(
    (payload) => payload?.jobId || payload?.job_id,
    [],
  );
  const exportProgress = useCallback(
    (payload) => payload?.progress ?? payload?.progress_percent ?? 0,
    [],
  );
  const exportStatus = useCallback((payload) => payload?.status, []);
  const exportMessage = useCallback(
    (payload) =>
      payload?.message || payload?.error_message || "Memproses data...",
    [],
  );
  const exportResult = () => statusData?.result || statusData?.data || null;
  const shouldShowFilters = isNewExport || filterOption === "filtered";

  const formatSeconds = (value) => {
    if (value === undefined || value === null || value === "") return "-";
    const number = Number(value);
    return Number.isNaN(number) ? String(value) : `${number.toFixed(3)} detik`;
  };

  const detailRows = (data) => {
    if (!data) return [];

    return [
      ["Job ID", data.job_id || data.jobId],
      ["Status", data.status],
      [
        "Progress",
        data.progress_percent !== undefined
          ? `${data.progress_percent}%`
          : data.progress,
      ],
      ["Processed Rows", data.processed_rows],
      ["Total Rows", data.total_rows],
      ["Row Count", data.row_count],
      [
        "Elapsed Time",
        data.elapsed_seconds !== undefined
          ? formatSeconds(data.elapsed_seconds)
          : data.elapsedTime,
      ],
      ["Requested Format", data.requested_format],
      ["Actual Format", data.actual_format],
      ["File Name", data.file_name || data.file?.filename],
      ["Download URL", data.download_url],
      [
        "Expires In",
        data.expires_in_seconds
          ? `${data.expires_in_seconds} detik`
          : undefined,
      ],
      ["Requested By", data.requested_by],
      ["Export Type", data.metadata?.export_type],
      ["Fallback Reason", data.fallback_reason],
      ["Error Message", data.error_message],
      ["Message", data.message],
    ].filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    );
  };

  useEffect(() => {
    if (!jobId || step !== 2) return;

    let stopped = false;
    let timeoutId;

    const poll = async () => {
      try {
        const res = await checkStatusFn(jobId);
        if (stopped) return;

        const payload = exportPayload(res);
        if (payload) {
          setStatusData({ data: payload, progress: payload });

          const nextJobId = exportJobId(payload);
          if (nextJobId && String(nextJobId) !== String(jobId)) {
            setJobId(nextJobId);
          }

          animateProgress(exportProgress(payload));

          if (exportStatus(payload) === "completed") {
            if (resultFn) {
              const resultRes = await resultFn(nextJobId || jobId);
              const resultPayload = exportPayload(resultRes);
              setStatusData({
                data: { ...payload, ...resultPayload },
                progress: payload,
                result: resultPayload,
              });
            }
            setStep(3);
            return;
          } else if (exportStatus(payload) === "failed") {
            setError(
              exportMessage(payload) || "Export gagal. Silakan coba lagi.",
            );
            setStep(4);
            return;
          }
        }
      } catch (err) {
        console.error(err);
      }

      if (!stopped) {
        const currentProgress = progressRef.current || 0;
        timeoutId = setTimeout(poll, currentProgress >= 90 ? 6000 : 2500);
      }
    };

    poll();

    return () => {
      stopped = true;
      clearTimeout(timeoutId);
    };
  }, [
    animateProgress,
    checkStatusFn,
    exportJobId,
    exportMessage,
    exportPayload,
    exportProgress,
    exportStatus,
    jobId,
    resultFn,
    step,
  ]);

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

      if (shouldShowFilters) {
        if (type === "tagihan") {
          // payload =
          //   startDate && endDate ? { startDate, endDate } : { month, year };
          if (tagihanFilterMode === "date") {
            payload = {
              startDate: formatDate(startDate),
              endDate: formatDate(endDate),
            };
          } else {
            payload = { month, year };
          }
          if (tagihanInvoiceMode === "filled") {
            payload.no_invoice = "filled";
          } else if (tagihanInvoiceMode === "specific" && search) {
            payload.no_invoice = search;
          }
        } else if (type === "payments") {
          // 💰 PAYMENTS
          payload = {
            format: exportFormat,
            status: statusFilter,
            is_forwarded: forwardedFilter,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
          };
        } else {
          // 📦 ORDERS
          payload = {
            format: exportFormat,
            status: statusFilter,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
          };
        }
      }

      if (isNewExport) {
        payload.requested_by =
          user?.name || user?.email || String(user?.cabang_id || "");
      }

      const res = await exportFn(payload);
      const payloadData = exportPayload(res);
      const nextJobId = exportJobId(payloadData);

      if (nextJobId) {
        setJobId(nextJobId);
        setStatusData({ data: payloadData });
        setStep(2);
      }
    } catch (err) {
      console.error(err);
      setError("Gagal memulai export. Silakan coba lagi.");
    }
  };

  const handleDownload = async () => {
    let latestStatus = statusData;

    if (jobId) {
      try {
        if (resultFn) {
          const resultRes = await resultFn(jobId);
          const resultPayload = exportPayload(resultRes);
          latestStatus = {
            ...latestStatus,
            data: { ...(latestStatus?.data || {}), ...resultPayload },
            result: resultPayload,
          };
          setStatusData(latestStatus);
        } else {
          const res = await checkStatusFn(jobId);
          const payload = exportPayload(res);
          if (payload) {
            latestStatus = { data: payload };
            setStatusData(latestStatus);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    const latestData = latestStatus?.result || latestStatus?.data;

    if (latestData?.download_url) {
      const a = document.createElement("a");
      a.href = latestData.download_url;
      a.download = latestData.file_name || `export_${jobId}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      onClose();
      return;
    }

    if (!latestStatus?.data?.file?.url) {
      setError(
        "File belum siap diunduh. Silakan tunggu beberapa detik lalu coba lagi.",
      );
      return;
    }

    const fileUrl = new URL(latestStatus.data.file.url, API_ORIGIN).toString();

    try {
      const response = await fetch(fileUrl, {
        method: "GET",
        headers: {
          Accept:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengunduh file.");
      }

      const contentType = response.headers.get("content-type") || "";
      if (
        !contentType.includes(
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ) &&
        !contentType.includes("application/octet-stream")
      ) {
        throw new Error("Response download bukan file Excel.");
      }

      const blob = await response.blob();
      if (!blob.size) {
        throw new Error("File download kosong.");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        latestStatus.data.file.filename || `rekap_${Date.now()}.xlsx`;
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
            Download Rekap{" "}
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
            {canSelectFormat && (
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm font-medium">Format File</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex cursor-pointer items-center gap-2 rounded border border-gray-200 px-3 py-2">
                    <input
                      type="radio"
                      name={`exportFormat-${type}`}
                      className="radio radio-sm checked:bg-blue-500"
                      checked={exportFormat === "csv"}
                      onChange={() => setExportFormat("csv")}
                    />
                    <span className="text-sm">CSV</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded border border-gray-200 px-3 py-2">
                    <input
                      type="radio"
                      name={`exportFormat-${type}`}
                      className="radio radio-sm checked:bg-blue-500"
                      checked={exportFormat === "xlsx"}
                      onChange={() => setExportFormat("xlsx")}
                    />
                    <span className="text-sm">XLSX</span>
                  </label>
                </div>
                {exportFormat === "xlsx" && (
                  <p className="text-xs text-amber-600">
                    XLSX maksimal 1 juta baris.
                  </p>
                )}
              </div>
            )}

            {!isNewExport && (
              <>
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
                    <span className="label-text">
                      Download Berdasarkan Filter
                    </span>
                    <input
                      type="radio"
                      name="downloadOption"
                      className="radio checked:bg-blue-500"
                      checked={filterOption === "filtered"}
                      onChange={() => setFilterOption("filtered")}
                    />
                  </label>
                </div>
              </>
            )}

            {shouldShowFilters && (
              <div className="grid grid-cols-1 gap-3">
                {type === "tagihan" && (
                  <div className="grid grid-cols-1 gap-2">
                    <select
                      value={tagihanInvoiceMode}
                      onChange={(e) => {
                        setTagihanInvoiceMode(e.target.value);
                        if (e.target.value !== "specific") {
                          setSearch("");
                        }
                      }}
                      className="select select-bordered w-full dark:text-black dark:bg-white dark:outline-1 dark:outline-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Belum Ada No Tagihan</option>
                      <option value="filled">No Tagihan Sudah Terisi</option>
                      <option value="specific">No Tagihan Spesifik</option>
                    </select>
                    {tagihanInvoiceMode === "specific" && (
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="No Tagihan"
                        className="input input-bordered w-full dark:text-black dark:bg-white dark:outline-1 dark:outline-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  </div>
                )}

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

                {(type === "payments" || type === "orders") && (
                  <Select
                    isMulti
                    options={
                      type === "orders"
                        ? orderStatusOptions
                        : fallbackOrderStatusOptions
                    }
                    value={selectedStatuses}
                    onChange={handleStatusChange}
                    placeholder="Pilih status..."
                    isLoading={type === "orders" && loadingStatusOptions}
                    classNamePrefix="react-select"
                    className="dark:text-black"
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: "#d1d5db",
                        borderRadius: "0.5rem",
                        padding: "2px",
                        color: "#111827",
                        backgroundColor: "#ffffff",
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 60,
                        color: "#111827",
                      }),
                      menuList: (base) => ({
                        ...base,
                        color: "#111827",
                        maxHeight: "260px",
                      }),
                      option: (base, state) => ({
                        ...base,
                        color: "#111827",
                        backgroundColor: state.isSelected
                          ? "#dbeafe"
                          : state.isFocused
                            ? "#eff6ff"
                            : "#ffffff",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "#111827",
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: "#e5e7eb",
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: "#111827",
                      }),
                      input: (base) => ({
                        ...base,
                        color: "#111827",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#6b7280",
                      }),
                    }}
                  />
                )}

                {type === "payments" && (
                  <select
                    value={forwardedFilter}
                    onChange={(e) => setForwardedFilter(e.target.value)}
                    className="select select-bordered w-full dark:text-black dark:bg-white dark:outline-1 dark:outline-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Semua Status Forward</option>
                    <option value="false">Belum Diteruskan</option>
                    <option value="true">Sudah Diteruskan</option>
                  </select>
                )}

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
                          (_, i) => 2019 + i,
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
              {exportMessage(statusData?.progress || statusData?.data) ||
                (visibleProgress >= 90
                  ? "Menyelesaikan dan menyiapkan file Excel..."
                  : "Memproses data...")}
            </p>
            {statusData?.data?.elapsed_seconds !== undefined && (
              <p className="text-xs text-gray-500">
                Elapsed time: {formatSeconds(statusData.data.elapsed_seconds)}
              </p>
            )}
            {detailRows(statusData?.data).length > 0 && (
              <div className="max-h-44 overflow-auto rounded border border-gray-200 text-left">
                {detailRows(statusData.data).map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[150px_1fr] gap-2 border-b border-gray-100 px-3 py-2 text-xs last:border-b-0"
                  >
                    <span className="font-medium text-gray-600">{label}</span>
                    <span className="break-all text-gray-800">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-center">
            <p className="text-green-600 font-semibold">Export Selesai!</p>
            {detailRows(exportResult()).length > 0 && (
              <div className="max-h-64 overflow-auto rounded border border-gray-200 text-left">
                {detailRows(exportResult()).map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[150px_1fr] gap-2 border-b border-gray-100 px-3 py-2 text-xs last:border-b-0"
                  >
                    <span className="font-medium text-gray-600">{label}</span>
                    <span className="break-all text-gray-800">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <button
              className="btn btn-success w-full text-white"
              onClick={handleDownload}
            >
              Unduh File {isNewExport ? exportFormat.toUpperCase() : "Excel"}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 text-center">
            <p className="text-red-600 font-semibold">Export Gagal</p>
            <p className="text-sm text-gray-600">
              {statusData?.data?.message ||
                "Silakan coba lagi beberapa saat lagi."}
            </p>
            <button
              className="btn btn-primary w-full"
              onClick={() => {
                setError(null);
                setStatusData(null);
                setJobId(null);
                setVisibleProgress(0);
                progressRef.current = 0;
                setStep(1);
              }}
            >
              Coba Lagi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
