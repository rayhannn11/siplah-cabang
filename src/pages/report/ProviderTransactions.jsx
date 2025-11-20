import React, { useState, useEffect } from "react";
import { Download, Search, X, AlertCircle } from "lucide-react";
import Select from "react-select";
import TableSkeleton from "../../components/loader/table-skeleton";
import ErrorFetch from "../../components/error-fetch";
import {
    searchProviders,
    exportProviderTransactions,
    checkProviderExportStatus,
    downloadProviderExport,
} from "../../api";
import { useAuthStore } from "../../stores";

const ProviderTransactions = () => {
    const { user, token } = useAuthStore();

    // Provider search state
    const [searchInput, setSearchInput] = useState("");
    const [providers, setProviders] = useState([]);
    const [loadingProviders, setLoadingProviders] = useState(false);
    const [selectedProviders, setSelectedProviders] = useState([]);

    // Year selection
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const yearOptions = Array.from({ length: currentYear - 2018 }, (_, i) => ({
        value: 2019 + i,
        label: (2019 + i).toString(),
    }));

    // Export state
    const [exporting, setExporting] = useState(false);
    const [exportJobId, setExportJobId] = useState(null);
    const [exportStatus, setExportStatus] = useState(null);
    const [showExportModal, setShowExportModal] = useState(false);
    const [error, setError] = useState(null);

    // Search providers with debounce
    useEffect(() => {
        if (searchInput.length >= 2) {
            setLoadingProviders(true);
            const delayDebounceFn = setTimeout(() => {
                handleSearchProviders();
            }, 800);

            return () => clearTimeout(delayDebounceFn);
        } else {
            // Reset providers if search input is less than 2 characters
            setProviders([]);
        }
    }, [searchInput]);

    const handleSearchProviders = async () => {
        try {
            const response = await searchProviders({ search: searchInput, limit: 100 });

            console.log("Search response:", response);

            if (response?.data && Array.isArray(response.data)) {
                setProviders(response.data);
                console.log("Providers set:", response.data);
            } else {
                setProviders([]);
            }
            setError(null);
        } catch (err) {
            console.error("Error searching providers:", err);
            setError("Gagal mencari penyedia. Silakan coba lagi.");
            setProviders([]);
        } finally {
            setLoadingProviders(false);
        }
    };

    const handleProviderChange = (selected) => {
        setSelectedProviders(selected || []);
    };

    const handleExport = async () => {
        if (selectedProviders.length === 0) {
            setError("Pilih minimal satu penyedia untuk melakukan export.");
            return;
        }

        try {
            setExporting(true);
            setError(null);
            setShowExportModal(true);

            const mallIds = selectedProviders.map((p) => p.value);
            const response = await exportProviderTransactions({
                mall_id: mallIds,
                year: selectedYear,
            });

            if (response?.data?.jobId) {
                setExportJobId(response.data.jobId);
                setExportStatus(response.data);
                // Start polling for status
                pollExportStatus(response.data.jobId);
            }
        } catch (err) {
            console.error("Error starting export:", err);
            setError("Gagal memulai export. Silakan coba lagi.");
            setShowExportModal(false);
        } finally {
            setExporting(false);
        }
    };

    const pollExportStatus = (jobId) => {
        const interval = setInterval(async () => {
            try {
                const response = await checkProviderExportStatus(jobId);

                if (response?.data) {
                    setExportStatus(response.data);

                    if (
                        response.data.status === "completed" ||
                        response.data.status === "failed"
                    ) {
                        clearInterval(interval);
                    }
                }
            } catch (err) {
                console.error("Error checking export status:", err);
                clearInterval(interval);
            }
        }, 2000); // Poll every 2 seconds
    };

    const handleDownload = async () => {
        if (!exportJobId) {
            setError("Job ID tidak ditemukan. Silakan coba lagi.");
            return;
        }

        try {
            await downloadProviderExport(exportJobId, token);
            setShowExportModal(false);
            setExportJobId(null);
            setExportStatus(null);
        } catch (err) {
            console.error("Error downloading file:", err);
            setError("Gagal mengunduh file. Silakan coba lagi.");
        }
    };

    const handleCloseModal = () => {
        setShowExportModal(false);
        setExportJobId(null);
        setExportStatus(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "text-green-600";
            case "processing":
                return "text-blue-600";
            case "failed":
                return "text-red-600";
            case "queued":
                return "text-yellow-600";
            default:
                return "text-gray-600";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "completed":
                return "Selesai";
            case "processing":
                return "Sedang Diproses";
            case "failed":
                return "Gagal";
            case "queued":
                return "Dalam Antrian";
            default:
                return status;
        }
    };

    // Check if user is cabang 49
    if (user?.cabang_id !== 49) {
        return (
            <div className="p-4 mb-10">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <AlertCircle className="mx-auto mb-4 text-yellow-600" size={48} />
                    <h2 className="text-xl font-semibold text-yellow-800 mb-2">
                        Akses Terbatas
                    </h2>
                    <p className="text-yellow-700">
                        Halaman ini hanya tersedia untuk cabang khusus (ID: 49).
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 mb-10">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-semibold dark:text-black mb-2">
                    Tarik Transaksi Penyedia
                </h1>
                <p className="text-gray-600 dark:text-gray-700">
                    Export transaksi dari semua penyedia di Siplah berdasarkan tahun
                </p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <AlertCircle
                        className="text-red-600 flex-shrink-0 mt-0.5"
                        size={20}
                    />
                    <div className="flex-1">
                        <p className="text-red-800 font-medium">Error</p>
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                    <button
                        onClick={() => setError(null)}
                        className="text-red-600 hover:text-red-800"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}

            {/* Filter Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 dark:text-black">
                <h2 className="text-lg font-semibold mb-4">Filter Export</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Provider Search */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Cari Penyedia <span className="text-red-500">*</span>
                        </label>
                        <Select
                            isMulti
                            isLoading={loadingProviders}
                            options={providers}
                            value={selectedProviders}
                            onChange={handleProviderChange}
                            onInputChange={(value, action) => {
                                // Only update search input on user typing
                                if (action.action === "input-change") {
                                    setSearchInput(value);
                                }
                                return value;
                            }}
                            placeholder="Ketik nama penyedia (min 2 karakter)..."
                            noOptionsMessage={() =>
                                searchInput.length < 2
                                    ? "Ketik minimal 2 karakter untuk mencari"
                                    : loadingProviders
                                    ? "Mencari..."
                                    : providers.length === 0
                                    ? "Tidak ada hasil ditemukan"
                                    : "Ketik untuk mencari lebih banyak"
                            }
                            classNamePrefix="react-select"
                            className="dark:text-black"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderColor: "#d1d5db",
                                    borderRadius: "0.5rem",
                                    padding: "2px",
                                    minHeight: "42px",
                                }),
                                menu: (base) => ({
                                    ...base,
                                    zIndex: 50,
                                }),
                                menuList: (base) => ({
                                    ...base,
                                    maxHeight: "300px",
                                }),
                                multiValue: (base) => ({
                                    ...base,
                                    backgroundColor: "#dbeafe",
                                }),
                                multiValueLabel: (base) => ({
                                    ...base,
                                    color: "#1e40af",
                                }),
                            }}
                            filterOption={null}
                            isClearable
                            closeMenuOnSelect={false}
                            blurInputOnSelect={false}
                            menuIsOpen={searchInput.length >= 2 ? undefined : false}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {providers.length > 0 && searchInput.length >= 2
                                ? `${providers.length} penyedia ditemukan. Pilih satu atau lebih untuk export.`
                                : "Pilih satu atau lebih penyedia untuk export"}
                        </p>
                    </div>

                    {/* Year Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Tahun <span className="text-red-500">*</span>
                        </label>
                        <Select
                            options={yearOptions}
                            value={yearOptions.find((opt) => opt.value === selectedYear)}
                            onChange={(selected) => setSelectedYear(selected.value)}
                            placeholder="Pilih tahun..."
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
                    </div>
                </div>

                {/* Selected Providers Summary */}
                {selectedProviders.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 mb-2">
                            Penyedia Terpilih ({selectedProviders.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {selectedProviders.map((provider) => (
                                <span
                                    key={provider.value}
                                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs"
                                >
                                    {provider.label}
                                    <button
                                        onClick={() =>
                                            setSelectedProviders((prev) =>
                                                prev.filter(
                                                    (p) => p.value !== provider.value
                                                )
                                            )
                                        }
                                        className="hover:text-blue-600"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Export Button */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleExport}
                        disabled={selectedProviders.length === 0 || exporting}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                            selectedProviders.length === 0 || exporting
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                        }`}
                    >
                        <Download size={20} />
                        {exporting ? "Memproses..." : "Export Transaksi"}
                    </button>
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 dark:text-black">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                    Cara Menggunakan:
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-blue-900">
                    <li>Ketik nama penyedia pada kolom pencarian (minimal 2 karakter)</li>
                    <li>Pilih satu atau lebih penyedia dari hasil pencarian</li>
                    <li>Pilih tahun transaksi yang ingin di-export</li>
                    <li>Klik tombol "Export Transaksi" untuk memulai proses</li>
                    <li>Tunggu hingga proses selesai, lalu unduh file Excel</li>
                </ol>
                <p className="mt-4 text-sm text-blue-700">
                    <strong>Catatan:</strong> Proses export mungkin memerlukan waktu
                    beberapa menit tergantung pada jumlah data yang diproses.
                </p>
            </div>

            {/* Export Status Modal */}
            {showExportModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
                    <div
                        className="bg-white rounded-lg shadow-lg w-[520px] p-6 dark:text-black"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Status Export</h2>
                            {exportStatus?.status === "completed" ||
                            exportStatus?.status === "failed" ? (
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-500 hover:text-gray-800 cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            ) : null}
                        </div>

                        {exportStatus && (
                            <div className="space-y-4">
                                {/* Status */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <span className="font-medium">Status:</span>
                                    <span
                                        className={`font-semibold ${getStatusColor(
                                            exportStatus.status
                                        )}`}
                                    >
                                        {getStatusText(exportStatus.status)}
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                {exportStatus.progress !== undefined && (
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Progress</span>
                                            <span className="font-medium">
                                                {exportStatus.progress}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-4">
                                            <div
                                                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${exportStatus.progress}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Message */}
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-900">
                                        {exportStatus.message}
                                    </p>
                                    {exportStatus.estimatedTime && (
                                        <p className="text-xs text-blue-700 mt-2">
                                            {exportStatus.estimatedTime}
                                        </p>
                                    )}
                                </div>

                                {/* File Info */}
                                {exportStatus.file &&
                                    exportStatus.status === "completed" && (
                                        <div className="p-4 bg-green-50 rounded-lg space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-green-800 font-medium">
                                                    File Name:
                                                </span>
                                                <span className="text-green-900">
                                                    {exportStatus.file.filename}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-green-800 font-medium">
                                                    Total Records:
                                                </span>
                                                <span className="text-green-900">
                                                    {exportStatus.file.recordCount?.toLocaleString(
                                                        "id-ID"
                                                    ) || 0}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                {/* Download Button */}
                                {exportStatus.status === "completed" && (
                                    <button
                                        onClick={handleDownload}
                                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
                                    >
                                        <Download size={20} />
                                        Unduh File Excel
                                    </button>
                                )}

                                {/* Failed Message */}
                                {exportStatus.status === "failed" && (
                                    <div className="p-4 bg-red-50 rounded-lg">
                                        <p className="text-red-800 text-sm">
                                            Export gagal. Silakan coba lagi atau hubungi
                                            tim support.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {!exportStatus && (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProviderTransactions;
