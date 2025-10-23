import React, { useEffect, useMemo, useState } from "react";
import Table from "../../components/tables/table";
import useFetch from "../../hooks/useFetch";
import useDebounce from "../../hooks/useDebounce";
import TableSkeleton from "../../components/loader/table-skeleton";
import ErrorFetch from "../../components/error-fetch";
import { fetchOrders, fetchOrdersRekanan, fetchOrdersStats } from "../../api";
import { FileDown } from "lucide-react";
import { formatNumberToRupiah } from "../../utils";
import { useLocation } from "react-router-dom";
import DownloadExcel from "../../components/download-excel";
import { format } from "date-fns";

const Orders = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [localSearch, setLocalSearch] = useState("");
  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const today = format(new Date(), "yyyy-MM-dd");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const [productStatus, setProductStatus] = useState("");
  const debouncedSearch = useDebounce(search, 800);

  const [openDownloadModal, setOpenDownloadModal] = useState(false);

  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const rekananQuery = params.get("rekanan");

  const [rekanan, setRekanan] = useState(rekananQuery);

  // Fetch orders
  const { data, initialLoading, refetching, error } = useFetch(
    [
      "orders",
      page,
      limit,
      debouncedSearch,
      status,
      productStatus,
      rekanan,
      startDate,
      endDate,
    ],
    () =>
      fetchOrders({
        page,
        limit,
        search: debouncedSearch,
        status,
        product_status: productStatus,
        mall_id: rekanan,
        startDate,
        endDate,
      }),
    { keepPreviousData: true }
  );

  // Fetch order stats testttt
  const {
    data: dataOrdersStats,
    initialLoading: initialLoadingStats,
    error: errorStats,
  } = useFetch(["ordersStats"], fetchOrdersStats, {
    refetchOnWindowFocus: false,
  });

  const {
    data: dataOrdersRekanan,
    initialLoading: initialLoadingRekanan,
    error: errorRekanan,
  } = useFetch(["ordersRekanan"], fetchOrdersRekanan, {
    refetchOnWindowFocus: false,
  });
  console.log(data?.data, "data");
  console.log(dataOrdersRekanan?.data, "dataOrdersRekanan");

  // Mapping kolom tabel sesuai API
  const labelMapping = {
    no: "No.",
    order_id: "Order ID",
    invoice_no: "No. Invoice",
    shipping_firstname: "Nama Penerima",
    shipping_company: "Sekolah",
    npsn: "NPSN",
    shipping_province: "Provinsi",
    shipping_city: "Kota",
    shipping_kecamatan: "Kecamatan",
    mall_name: "Toko",
    status_name: "Status",
    date_added: "Tanggal Order",
    total: "Total",
    total_akhir: "Total Akhir",
    ppn: "PPN",
    pph: "PPH",
  };

  // Style untuk status
  const tableStyleMapping = {
    cell: {
      status_name: {
        wrapper: "span",
        variant: "status",
        base: "px-2 py-1 rounded-full text-xs font-semibold text-nowrap",
        classes: {
          "Pesanan Baru": "bg-yellow-100 text-yellow-800",
          Diproses: "bg-blue-100 text-blue-800",
          Dikirim: "bg-purple-100 text-purple-800",
          Diterima: "bg-green-100 text-green-800",
          Dibayar: "bg-teal-100 text-teal-800",
          Selesai: "bg-gray-100 text-gray-800",
          Dibatalkan: "bg-red-100 text-red-800",
          Ditutup: "bg-black text-white",
          default: "bg-gray-100 text-gray-600",
        },
      },
    },
  };

  // Clear filters function
  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setProductStatus("");
    setRekanan("");
    setStartDate(today);
    setEndDate(today);
    // Don't reset page - keep current pagination
  };

  const widgets = {
    widgetClass: "flex justify-between gap-3 mb-4",
    widgetsContent: [
      {
        type: "button",
        buttons: [
          {
            text: "Clear Filters",
            onClick: clearFilters,
            classes:
              "cursor-pointer flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all text-sm font-medium",
          },
        ],
      },
      {
        type: "button",
        buttons: [
          {
            text: "Download Recap Pesanan",
            icon: FileDown,
            onClick: () => setOpenDownloadModal(true),
            classes:
              "cursor-pointer flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all text-sm font-medium",
          },
        ],
      },
    ],
  };

  // Mapping dataSource dari API
  const dataSource = useMemo(() => {
    if (!data?.data?.data) return [];

    return data.data.data.map((item) => ({
      no: item.no,
      order_id: item.order_id,
      invoice_no: item.invoice_no,
      shipping_firstname: item.shipping_firstname,
      shipping_company: item.shipping_company,
      npsn: item.npsn,
      shipping_province: item.shipping_province,
      shipping_city: item.shipping_city,
      shipping_kecamatan: item.shipping_kecamatan,
      mall_name: item.mall_name,
      status_name: item.status_name,
      date_added: item.date_added,
      total: formatNumberToRupiah(item.total),
      total_akhir: formatNumberToRupiah(item.total_akhir),
      ppn: formatNumberToRupiah(item.ppn),
      pph: formatNumberToRupiah(item.pph),
    }));
  }, [data]);

  // Pagination setup
  const pagination = data?.data
    ? {
        currentPage: data.data.currentPage,
        lastPage: data.data.lastPage,
        from: data.data.from,
        to: data.data.to,
        total: data.data.total,
        pageSize: limit,
      }
    : null;

  const handleSearchClick = () => {
    // baru ubah state pencarian utama
    setSearch(localSearch);
    setPage(1);
  };

  // State loading & error
  if (initialLoading || initialLoadingStats) {
    return (
      <div className="p-10">
        <TableSkeleton rows={6} />
      </div>
    );
  }
  if (error || errorStats)
    return (
      <ErrorFetch message={error?.message || "Gagal memuat data orders."} />
    );

  console.log(dataSource, "dataSource");

  return (
    <div className="p-4 mb-10">
      <h1 className="text-3xl font-semibold mb-6">Daftar Orders</h1>

      {/* 🔹 Order Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-white rounded-xl shadow-md mb-6">
        {/* Total Orders */}
        <div className="card bg-[#0A1F3C] text-white shadow-md hover:shadow-lg transition transform hover:-translate-y-1 rounded-xl">
          <div className="card-body">
            <h2 className="card-title text-md opacity-90">Total Pesanan</h2>
            <p className="text-xl font-bold mt-1">
              {dataOrdersStats.data.total_orders} pesanan
            </p>
            <p className="text-lg mt-3">
              {dataOrdersStats.data.total_amount_formatted}
            </p>
          </div>
        </div>

        {/* Pesanan Baru */}
        <div className="card bg-[#F1AB33] text-black shadow-md hover:shadow-lg transition transform hover:-translate-y-1 rounded-xl">
          <div className="card-body">
            <h2 className="card-title text-md font-semibold opacity-90">
              Pesanan Baru
            </h2>
            <p className="text-xl font-bold mt-1">
              {dataOrdersStats.data.by_status?.[0]?.count ?? 0} pesanan
            </p>
            <p className="text-lg mt-3">
              {dataOrdersStats.data.by_status?.[0]?.total_amount_formatted ??
                "-"}
            </p>
          </div>
        </div>

        {/* Selesai */}
        <div className="card bg-[#047857] text-white shadow-md hover:shadow-lg transition transform hover:-translate-y-1 rounded-xl">
          <div className="card-body">
            <h2 className="card-title text-md opacity-90">Selesai</h2>
            <p className="text-xl font-bold mt-1">
              {dataOrdersStats.data.by_status?.[20]?.count ?? 0} pesanan
            </p>
            <p className="text-lg mt-3">
              {dataOrdersStats.data.by_status?.[20]?.total_amount_formatted ??
                "-"}
            </p>
          </div>
        </div>

        {/* Dibatalkan */}
        <div className="card bg-[#DC2626] text-white shadow-md hover:shadow-lg transition transform hover:-translate-y-1 rounded-xl">
          <div className="card-body">
            <h2 className="card-title text-md opacity-90">Dibatalkan</h2>
            <p className="text-xl font-bold mt-1">
              {dataOrdersStats.data.by_status?.[7]?.count ?? 0} pesanan
            </p>
            <p className="text-lg mt-3">
              {dataOrdersStats.data.by_status?.[7]?.total_amount_formatted ??
                "-"}
            </p>
          </div>
        </div>
      </div>

      {/* 🔹 Orders Table */}
      <Table
        dataSource={dataSource}
        labelMapping={labelMapping}
        tableStyleMapping={tableStyleMapping}
        columnConfig={{
          actions: true,
          showSearchInput: true,
          showExportExcel: false,
          showExportPDF: false,
          showDateFilter: false,
        }}
        tableConfig={{
          page,
          limit,
          search,
          localSearch,
          onLocalSearchChange: setLocalSearch,
          onSearchSubmit: handleSearchClick,
          onSearchChange: (val) => {
            setSearch(val);
            setPage(1);
          },
          onPageSizeChange: (newLimit) => {
            setLimit(newLimit);
            setPage(1);
          },
          onPageChange: setPage,
          pagination,
          loading: refetching,

          // 👇 field yang akan dijadikan link dinamis
          redirectField: "invoice_no",

          // 👇 callback ketika diklik
          onRowRedirect: (row) => {
            window.location.href = `/cabang/orders/detail/${row.order_id}`;
          },
        }}
        filterConfig={{
          isFilter: !!data?.data?.filters,
          filters: {
            items: [
              {
                label: "Tanggal Mulai",
                type: "date",
                value: startDate,
                onChange: (val) => {
                  setStartDate(val);
                  setPage(1);
                },
              },
              {
                label: "Tanggal Selesai",
                type: "date",
                value: endDate,
                onChange: (val) => {
                  setEndDate(val);
                  setPage(1);
                },
              },
              {
                label: "Daftar Rekanan",
                options: dataOrdersRekanan?.data || [],
                value: rekanan,
                onChange: (val) => {
                  setRekanan(val);
                  setPage(1);
                },
                isSearchable: true,
                isMulti: true,
              },
              {
                label: "Status Pesanan",
                options: data?.data?.filters?.status || [],
                value: status,
                onChange: (val) => {
                  setStatus(val);
                  setPage(1);
                },
                isSearchable: true,
                isMulti: true,
              },
            ],
          },
        }}
        widgets={widgets}
      />

      {openDownloadModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 ">
          <DownloadExcel
            open={openDownloadModal}
            onClose={() => setOpenDownloadModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Orders;
