import React, { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  CreditCard,
  Eye,
  Trash,
} from "lucide-react";
import Swal from "sweetalert2";
import Table from "../../components/tables/table";
import useFetch from "../../hooks/useFetch";
import useDebounce from "../../hooks/useDebounce";
import TableSkeleton from "../../components/loader/table-skeleton";
import ErrorFetch from "../../components/error-fetch";
import { fetchPayments, fetchPaymentsSummary } from "../../api";
import { formatNumberToRupiah } from "../../utils";

const Payments = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const [vaStatus, setVaStatus] = useState("");

  const debouncedSearch = useDebounce(search, 800);

  const { data, initialLoading, refetching, error } = useFetch(
    ["payments", page, limit, debouncedSearch, vaStatus],
    () => fetchPayments({ page, limit, search: debouncedSearch, vaStatus }),
    { keepPreviousData: true }
  );

  const {
    data: dataPaymentsSummary,
    initialLoading: initialLoadingPaymentsSummary,
    error: errorPaymentsSummary,
  } = useFetch(
    ["paymentsSummary"],
    fetchPaymentsSummary,

    { refetchOnWindowFocus: false }
  );

  console.log(dataPaymentsSummary, "dataPaymentsSummary");

  // Label kolom tabel sesuai respon API
  const labelMapping = {
    no: "No.",
    order_id: "Order ID",
    invoice_no: "No. Invoice",
    payment_va: "VA",
    sekolah: "Sekolah",
    customer_name: "Pelanggan",
    toko: "Toko",
    cabang: "Cabang",
    total: "Total",
    tgl_bayar: "Tanggal Bayar",
    status: "Status",
    va_status: "Status VA",
    actions: "Opsi",
  };

  // Style untuk status
  const tableStyleMapping = {
    cell: {
      status: {
        wrapper: "span",
        variant: "status",
        base: "px-2 py-1 rounded-full text-xs font-semibold text-nowrap",
        classes: {
          Dibayar: "bg-green-100 text-green-800",
          default: "bg-gray-100 text-gray-600",
        },
      },
      va_status: {
        wrapper: "span",
        variant: "va_status",
        base: "px-2 py-1 rounded-full text-xs font-semibold text-nowrap",
        classes: {
          close: "bg-blue-100 text-blue-800",
          open: "bg-yellow-100 text-yellow-800",
        },
      },
      actions: {
        wrapper: "div",
        base: "flex gap-2 justify-center",
      },
    },
  };

  // Mapping dataSource dari API
  const dataSource = useMemo(() => {
    if (!data?.data?.data) return [];

    return data.data.data.map((item) => ({
      no: item.no,
      order_id: item.order_id,
      invoice_no: item.invoice_no,
      payment_va: item.payment_va,
      sekolah: item.sekolah,
      customer_name: item.customer_name,
      toko: item.toko,
      cabang: item.cabang,
      total: formatNumberToRupiah(item.total),
      tgl_bayar: item.tgl_bayar,
      status: item.status_name,
      va_status: item.va_status_raw,
    }));
  }, [data]);

  // Setup pagination
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

  // State loading & error
  if (initialLoading || initialLoadingPaymentsSummary) {
    return (
      <div className="p-10">
        <TableSkeleton rows={6} />
      </div>
    );
  }
  if (error || errorPaymentsSummary)
    return (
      <ErrorFetch message={error?.message || "Gagal memuat data pembayaran."} />
    );

  return (
    <div className="p-4 mb-10">
      <h1 className="text-3xl font-semibold mb-6">Daftar Pembayaran</h1>

      {/* 🔹 Payment Summary Cards */}
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer bg-white select-none hover:bg-gray-50 rounded-t-xl"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-[#1E3A8A]" />
          <h2 className="font-semibold text-lg text-gray-800">
            Informasi Pembayaran
          </h2>
        </div>
        {collapsed ? (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        )}
      </div>

      {/* === Collapsible Content === */}
      {!collapsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl transition-all">
          {/* Total Pembayaran */}
          <div className="card bg-[#1E3A8A] text-white shadow-md hover:shadow-lg transition transform hover:-translate-y-1 rounded-xl">
            <div className="card-body">
              <h2 className="card-title text-md font-semibold opacity-90">
                Total Pembayaran
              </h2>
              <p className="text-2xl font-bold mt-2">
                {dataPaymentsSummary.data.total_payment_formatted ?? "-"}
              </p>
            </div>
          </div>

          {/* 30 Hari Terakhir */}
          <div className="card bg-[#0F766E] text-white shadow-md hover:shadow-lg transition transform hover:-translate-y-1 rounded-xl">
            <div className="card-body">
              <h2 className="card-title text-md font-semibold opacity-90">
                30 Hari Terakhir
              </h2>
              <p className="text-2xl font-bold mt-2">
                {dataPaymentsSummary.data.recent_payment_30days_formatted ??
                  "-"}
              </p>
            </div>
          </div>

          {/* Dibayar */}
          <div className="card bg-[#047857] text-white shadow-md hover:shadow-lg transition transform hover:-translate-y-1 rounded-xl">
            <div className="card-body">
              <h2 className="card-title text-md font-semibold opacity-90">
                Dibayar
              </h2>
              <p className="text-lg font-bold mt-1">
                {dataPaymentsSummary.data.by_order_status?.[18]?.order_count ??
                  0}{" "}
                pesanan
              </p>
              <p className="text-sm mt-2 opacity-90">
                {dataPaymentsSummary.data.by_order_status?.[18]
                  ?.total_amount_formatted ?? "-"}
              </p>
            </div>
          </div>

          {/* Selesai */}
          <div className="card bg-[#334155] text-white shadow-md hover:shadow-lg transition transform hover:-translate-y-1 rounded-xl">
            <div className="card-body">
              <h2 className="card-title text-md font-semibold opacity-90">
                Selesai
              </h2>
              <p className="text-lg font-bold mt-1">
                {dataPaymentsSummary.data.by_order_status?.[20]?.order_count ??
                  0}{" "}
                pesanan
              </p>
              <p className="text-sm mt-2 opacity-90">
                {dataPaymentsSummary.data.by_order_status?.[20]
                  ?.total_amount_formatted ?? "-"}
              </p>
            </div>
          </div>
        </div>
      )}

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
          onRowClick: (row) => {
            window.location.href = `/payments/detail/${row.order_id}`;
          },
        }}
        filterConfig={{
          isFilter: !!data?.data?.filters,
          filters: {
            items: [
              {
                label: "Status Diteruskan",
                options: data?.data?.filters?.va_status || [],
                value: vaStatus,
                onChange: (val) => {
                  setVaStatus(val);
                  setPage(1);
                },
              },
            ],
          },
        }}
      />
    </div>
  );
};

export default Payments;
