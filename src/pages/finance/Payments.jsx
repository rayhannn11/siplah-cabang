import React, { useMemo, useState } from "react";
import { Copy, CreditCard, Eye, Trash } from "lucide-react";
import Swal from "sweetalert2";
import Table from "../../components/tables/table";
import useFetch from "../../hooks/useFetch";
import useDebounce from "../../hooks/useDebounce";
import TableSkeleton from "../../components/loader/table-skeleton";
import ErrorFetch from "../../components/error-fetch";
import { fetchPayments, fetchPaymentsSummary } from "../../api";
import { formatNumberToRupiah } from "../../utils";
import { format } from "date-fns";

const Payments = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [localSearch, setLocalSearch] = useState("");
  const [search, setSearch] = useState("");

  const today = format(new Date(), "yyyy-MM-dd");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const [vaStatus, setVaStatus] = useState("");

  const debouncedSearch = useDebounce(search, 800);

  const { data, initialLoading, refetching, error } = useFetch(
    ["payments", page, limit, debouncedSearch, vaStatus, startDate, endDate],
    () =>
      fetchPayments({
        page,
        limit,
        search: debouncedSearch,
        vaStatus,
        startDate,
        endDate,
      }),
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

  // Clear filters function
  const clearFilters = () => {
    setSearch("");
    setVaStatus("");
    setStartDate(today);
    setEndDate(today);
    // Don't reset page - keep current pagination
  };

  const handleSearchClick = () => {
    // baru ubah state pencarian utama
    setSearch(localSearch);
    setPage(1);
  };

  // Label kolom tabel sesuai respon API
  const labelMapping = {
    no: "No",
    invoice_no: "ID invoice",
    pemesan: "Pemesan",
    sekolah: "Sekolah",
    penyedia: "Penyedia",
    total_tagihan: "Total Tagihan",
    total_transfer: "Total Transfer",
    tgl_bayar: "Tgl Bayar",
    tgl_tf: "Tgl TF",
    status: "Status",
    actions: "Action",
  };

  // Style untuk status
  const tableStyleMapping = {
    cell: {
      status: {
        wrapper: "span",
        variant: "status",
        base: "px-2 py-1 rounded-full text-xs font-semibold text-nowrap",
        classes: {
          "Telah Dilengkapi": "bg-green-100 text-green-800",
          default: "bg-gray-100 text-gray-600",
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
      invoice_no: item.invoice_no,
      pemesan: `${item.cfname} ${item.clname}`.trim(),
      sekolah: item.shipping_company,
      penyedia: item.toko,
      total_tagihan: item.total_tagihan_formatted || "Rp0",
      total_transfer: item.total_pembayaran_formatted || "Rp0",
      tgl_bayar: item.tgl_pembayaran,
      tgl_tf: item.tgl_transfer || "-",
      status: item.singkat,
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

  const widgets = {
    widgetClass: "flex justify-start gap-3 mb-4",
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
    ],
  };

  return (
    <div className="p-4 mb-10">
      <h1 className="text-3xl font-semibold mb-6">Daftar Pembayaran</h1>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-white rounded-xl shadow-md mb-6">
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

                <div className="card bg-[#047857] text-white shadow-md hover:shadow-lg transition transform hover:-translate-y-1 rounded-xl">
                    <div className="card-body">
                        <h2 className="card-title text-md font-semibold opacity-90">
                            Dibayar
                        </h2>
                        <p className="text-lg font-bold mt-1">
                            {dataPaymentsSummary.data.by_order_status?.[18]
                                ?.order_count ?? 0}{" "}
                            pesanan
                        </p>
                        <p className="text-sm mt-2 opacity-90">
                            {dataPaymentsSummary.data.by_order_status?.[18]
                                ?.total_amount_formatted ?? "-"}
                        </p>
                    </div>
                </div>

                <div className="card bg-[#334155] text-white shadow-md hover:shadow-lg transition transform hover:-translate-y-1 rounded-xl">
                    <div className="card-body">
                        <h2 className="card-title text-md font-semibold opacity-90">
                            Selesai
                        </h2>
                        <p className="text-lg font-bold mt-1">
                            {dataPaymentsSummary.data.by_order_status?.[20]
                                ?.order_count ?? 0}{" "}
                            pesanan
                        </p>
                        <p className="text-sm mt-2 opacity-90">
                            {dataPaymentsSummary.data.by_order_status?.[20]
                                ?.total_amount_formatted ?? "-"}
                        </p>
                    </div>
                </div>
            </div> */}
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
          onRowClick: (row) => {
            window.location.href = `/payments/detail/${row.order_id}`;
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
              // {
              //     label: "Status Diteruskan",
              //     options: data?.data?.filters?.va_status || [],
              //     value: vaStatus,
              //     onChange: (val) => {
              //         setVaStatus(val);
              //         setPage(1);
              //     },
              // },
            ],
          },
        }}
        widgets={widgets}
      />
    </div>
  );
};

export default Payments;
