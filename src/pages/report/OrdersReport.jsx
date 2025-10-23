import React, { useState, useEffect, useMemo } from "react";
import { fetchOrdersReport, exportOrdersReport } from "../../api";
import { Download, Filter, Search } from "lucide-react";
import TableSkeleton from "../../components/loader/table-skeleton";
import ErrorFetch from "../../components/error-fetch";
import Swal from "sweetalert2";

const OrdersReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  // Filter states
  const [filters, setFilters] = useState({
    year: "",
    startDate: "",
    endDate: "",
    order_status_id: "",
    search: "",
    sortBy: "date_added",
    sortOrder: "DESC",
  });

  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchOrdersReport({
        page: currentPage,
        limit: perPage,
        ...filters,
      });

      setData(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
      console.error("Error fetching orders report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, perPage, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearchSubmit = () => {
    setFilters((prev) => ({ ...prev, search: searchInput }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      year: "",
      startDate: "",
      endDate: "",
      order_status_id: "",
      search: "",
      sortBy: "date_added",
      sortOrder: "DESC",
    });
    setSearchInput("");
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    if (filters.sortBy === column) {
      // Toggle sort order
      setFilters((prev) => ({
        ...prev,
        sortOrder: prev.sortOrder === "ASC" ? "DESC" : "ASC",
      }));
    } else {
      // Set new sort column
      setFilters((prev) => ({
        ...prev,
        sortBy: column,
        sortOrder: "DESC",
      }));
    }
    setCurrentPage(1);
  };

  const handleExport = async () => {
    try {
      // Tampilkan swal loader
      Swal.fire({
        title: "Sedang mengekspor data...",
        text: "Mohon tunggu sebentar",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      setExporting(true);

      // Panggil API export
      const blob = await exportOrdersReport({
        ...filters,
      });

      // Buat link download blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orders-report-${new Date().getTime()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Tutup loader dan tampilkan sukses
      Swal.fire({
        icon: "success",
        title: "Export Berhasil",
        text: "Data berhasil diexport ke Excel",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error exporting orders report:", err);
      Swal.fire({
        icon: "error",
        title: "Export Gagal",
        text: err.message || "Gagal mengexport data",
      });
    } finally {
      setExporting(false);
    }
  };

  const getStatusColor = (statusId) => {
    const colors = {
      0: "bg-blue-100 text-blue-800",
      2: "bg-yellow-100 text-yellow-800",
      3: "bg-purple-100 text-purple-800",
      4: "bg-indigo-100 text-indigo-800",
      5: "bg-teal-100 text-teal-800",
      7: "bg-red-100 text-red-800",
      8: "bg-red-100 text-red-800",
      9: "bg-orange-100 text-orange-800",
      10: "bg-gray-100 text-gray-800",
      14: "bg-red-100 text-red-800",
      16: "bg-cyan-100 text-cyan-800",
      17: "bg-green-100 text-green-800",
      18: "bg-emerald-100 text-emerald-800",
      19: "bg-red-100 text-red-800",
      20: "bg-green-100 text-green-800",
      21: "bg-gray-100 text-gray-800",
      22: "bg-orange-100 text-orange-800",
      90: "bg-gray-100 text-gray-800",
    };
    return colors[statusId] || "bg-gray-100 text-gray-800";
  };
  if (loading) {
    <div className="p-4 mb-10">
      <TableSkeleton />
    </div>;
  }

  if (error) {
    return (
      <div className="p-4 mb-10">
        <h1 className="text-3xl font-semibold mb-6">Tagihan Cabang</h1>
        <ErrorFetch message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="p-4 mb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-semibold">Tagihan Cabang</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <Filter size={18} />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            onClick={handleExport}
            disabled={exporting || loading}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            {exporting ? "Exporting..." : "Export Excel"}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearchSubmit()}
              placeholder="Search by Kode Pesanan, Pelanggan, Sekolah, NPSN, Nama Mall, Nama Cabang..."
              className="w-full border border-gray-300 rounded px-4 py-2 bg-white"
            />
          </div>
          <button
            onClick={handleSearchSubmit}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            <Search size={18} />
            Search
          </button>
        </div>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Tahun</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              >
                <option value="">Semua Tahun</option>
                {data?.filter_options?.years?.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={filters.order_status_id}
                onChange={(e) =>
                  handleFilterChange("order_status_id", e.target.value)
                }
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              >
                {data?.filter_options?.order_statuses?.map((status, idx) => (
                  <option key={idx} value={status.value}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
            >
              Reset
            </button>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Grand Total Card */}
      {data?.grand_total && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-2">Grand Total</h2>
          <p className="text-3xl font-bold">
            {data.grand_total.total_formatted}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mb-6">
          <TableSkeleton />
        </div>
      )}

      {/* Data Table */}
      {!loading && data && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {data?.data && data.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("kode_pesanan")}
                    >
                      <div className="flex items-center gap-1">
                        Kode Pesanan
                        {filters.sortBy === "kode_pesanan" && (
                          <span>{filters.sortOrder === "ASC" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("pelanggan")}
                    >
                      <div className="flex items-center gap-1">
                        Pelanggan
                        {filters.sortBy === "pelanggan" && (
                          <span>{filters.sortOrder === "ASC" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("sekolah")}
                    >
                      <div className="flex items-center gap-1">
                        Sekolah
                        {filters.sortBy === "sekolah" && (
                          <span>{filters.sortOrder === "ASC" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NPSN
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alamat
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provinsi
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-1">
                        Status
                        {filters.sortBy === "status" && (
                          <span>{filters.sortOrder === "ASC" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("total")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Total
                        {filters.sortBy === "total" && (
                          <span>{filters.sortOrder === "ASC" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("nama_mall")}
                    >
                      <div className="flex items-center gap-1">
                        Nama Mall
                        {filters.sortBy === "nama_mall" && (
                          <span>{filters.sortOrder === "ASC" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("nama_cabang")}
                    >
                      <div className="flex items-center gap-1">
                        Nama Cabang
                        {filters.sortBy === "nama_cabang" && (
                          <span>{filters.sortOrder === "ASC" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("waktu_beli")}
                    >
                      <div className="flex items-center gap-1">
                        Waktu Beli
                        {filters.sortBy === "waktu_beli" && (
                          <span>{filters.sortOrder === "ASC" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.data.map((order) => (
                    <tr key={order.no} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{order.no}</td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {order.kode_pesanan}
                      </td>
                      <td className="px-4 py-3 text-sm">{order.pelanggan}</td>
                      <td className="px-4 py-3 text-sm">{order.sekolah}</td>
                      <td className="px-4 py-3 text-sm">{order.npsn}</td>
                      <td className="px-4 py-3 text-sm">{order.alamat}</td>
                      <td className="px-4 py-3 text-sm">{order.provinsi}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 text-xs rounded ${getStatusColor(
                            order.order_status_id
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold">
                        {order.total_formatted}
                      </td>
                      <td className="px-4 py-3 text-sm">{order.nama_mall}</td>
                      <td className="px-4 py-3 text-sm">{order.nama_cabang}</td>
                      <td className="px-4 py-3 text-sm">{order.waktu_beli}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No data available
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && data && (
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            Showing {data.from} to {data.to} of {data.total} entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
            >
              Previous
            </button>

            <span className="px-4 py-2 text-sm">
              Page {currentPage} of {data.lastPage}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(data.lastPage, prev + 1))
              }
              disabled={currentPage === data.lastPage || loading}
              className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
            >
              Next
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">Per page:</label>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              disabled={loading}
              className="border border-gray-300 rounded px-3 py-2 bg-white disabled:opacity-50"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersReport;
