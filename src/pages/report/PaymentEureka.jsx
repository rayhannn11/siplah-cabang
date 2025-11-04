import React, { useState, useEffect, useMemo } from "react";
import { fetchEurekaPaymentReport } from "../../api";
import { useAuthStore } from "../../stores";
import { Download, Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import TableSkeleton from "../../components/loader/table-skeleton";
import ErrorFetch from "../../components/error-fetch";

const PaymentEureka = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Filter states
  const [filters, setFilters] = useState({
    month: "",
    year: "",
    startDate: "",
    endDate: "",
    no_invoice: "",
    maxOrdersPerCabang: 50,
    includeOrders: true,
  });

  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCabang, setExpandedCabang] = useState({});

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchEurekaPaymentReport({
        page: currentPage,
        limit: perPage,
        cabangId: user?.cabang_id || 49,
        ...filters,
      });

      setData(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
      console.error("Error fetching Eureka payment report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, perPage, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleResetFilters = () => {
    setFilters({
      month: "",
      year: "",
      startDate: "",
      endDate: "",
      no_invoice: "",
      maxOrdersPerCabang: 50,
      includeOrders: true,
    });
    setCurrentPage(1);
  };

  const toggleCabangExpand = (cabangId) => {
    setExpandedCabang((prev) => ({
      ...prev,
      [cabangId]: !prev[cabangId],
    }));
  };

  // Generate year options (current year and 5 years back)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => currentYear - i);
  }, []);

  if (error) {
    return (
      <div className="p-4 mb-10">
        <h1 className="text-3xl font-semibold mb-6 dark:text-black">
          Tagihan Eureka
        </h1>
        <ErrorFetch message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="p-4 mb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold dark:text-black">
          Tagihan Eureka
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <Filter size={18} />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 dark:text-black">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Month Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Bulan</label>
              <select
                value={filters.month}
                onChange={(e) => handleFilterChange("month", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              >
                <option value="">Semua Bulan</option>
                {data?.filter_options?.months?.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Tahun</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              >
                <option value="">Semua Tahun</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Invoice Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Invoice</label>
              <select
                value={filters.no_invoice}
                onChange={(e) =>
                  handleFilterChange("no_invoice", e.target.value)
                }
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              >
                {data?.filter_options?.invoices?.map((invoice, idx) => (
                  <option key={idx} value={invoice.value}>
                    {invoice.name}
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

            {/* Max Orders Per Cabang */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Max Orders Per Cabang
              </label>
              <input
                type="number"
                value={filters.maxOrdersPerCabang}
                onChange={(e) =>
                  handleFilterChange(
                    "maxOrdersPerCabang",
                    parseInt(e.target.value)
                  )
                }
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                min="1"
                max="1000"
              />
            </div>

            {/* Include Orders Toggle */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.includeOrders}
                  onChange={(e) =>
                    handleFilterChange("includeOrders", e.target.checked)
                  }
                  className="mr-2"
                />
                <span className="text-sm font-medium">
                  Include Orders Details
                </span>
              </label>
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

      {/* Summary Card */}
      {data?.grand_total && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Grand Total Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm opacity-90">Total SIBI</p>
              <p className="text-2xl font-bold">
                {data.grand_total.het_total_formatted}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-90">Total NONSIBI</p>
              <p className="text-2xl font-bold">
                {data.grand_total.nonhet_total_formatted}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-90">Total Erlangga</p>
              <p className="text-2xl font-bold">
                {data.grand_total.total_erlangga_formatted}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-90">Tagihan 2%</p>
              <p className="text-2xl font-bold">
                {data.grand_total.tagihan_2persen_formatted}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="mb-6">
          <TableSkeleton />
        </div>
      )}

      {/* Data Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden dark:text-black">
          {data?.data && data.data.length > 0 ? (
            <div className="overflow-x-auto">
              {data.data.map((cabang) => (
                <div
                  key={cabang.cabang_id}
                  className="border-b border-gray-200"
                >
                  {/* Cabang Header */}
                  <div
                    className="bg-gray-100 p-4 cursor-pointer hover:bg-gray-200 transition"
                    onClick={() => toggleCabangExpand(cabang.cabang_id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <button className="text-gray-600">
                          {expandedCabang[cabang.cabang_id] ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </button>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {cabang.cabang_nama}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Total Orders: {cabang.cabang_totals.order_count}
                            {cabang.cabang_totals.order_count_shown &&
                              ` (Showing: ${cabang.cabang_totals.order_count_shown})`}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-right">
                        <div>
                          <p className="text-xs text-gray-600">SIBI</p>
                          <p className="font-semibold">
                            {cabang.cabang_totals.het_formatted}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">NONSIBI</p>
                          <p className="font-semibold">
                            {cabang.cabang_totals.non_formatted}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Total</p>
                          <p className="font-semibold">
                            {cabang.cabang_totals.total_formatted}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Tagihan 2%</p>
                          <p className="font-semibold text-green-600">
                            {cabang.cabang_totals.tagihan_2persen_formatted}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Orders Details */}
                  {expandedCabang[cabang.cabang_id] &&
                    cabang.orders &&
                    cabang.orders.length > 0 && (
                      <div className="p-4">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Invoice No
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  School
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Mall
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  SIBI
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  NONSIBI
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Total
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Tagihan 2%
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {cabang.orders.map((order) => (
                                <tr
                                  key={order.order_id}
                                  className="hover:bg-gray-50"
                                >
                                  <td className="px-4 py-3 text-sm">
                                    {order.invoice_no}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    {new Date(
                                      order.date_added
                                    ).toLocaleDateString("id-ID")}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    {order.shipping_company}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    {order.mall_name}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                                      {order.status_name}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-right">
                                    {order.het_formatted}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-right">
                                    {order.non_formatted}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-right font-semibold">
                                    {order.total_formatted}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                                    {order.tagihan_2persen_formatted}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                </div>
              ))}
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
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentEureka;
