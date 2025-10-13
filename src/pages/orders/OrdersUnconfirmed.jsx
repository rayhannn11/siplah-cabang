import React, { useMemo, useState } from "react";
import Table from "../../components/tables/table";
import useFetch from "../../hooks/useFetch";
import useDebounce from "../../hooks/useDebounce";
import TableSkeleton from "../../components/loader/table-skeleton";
import ErrorFetch from "../../components/error-fetch";
import { fetchOrdersUnconfirmed } from "../../api";
import { formatNumberToRupiah } from "../../utils";

const OrdersUnconfirmed = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(""); // state filter Status

  const debouncedSearch = useDebounce(search, 800);

  // Fetch API
  const { data, initialLoading, refetching, error } = useFetch(
    ["ordersUnconfirmed", page, limit, debouncedSearch, status],
    () =>
      fetchOrdersUnconfirmed({
        page,
        limit,
        search: debouncedSearch,
        status, // kirim filter status
      }),
    { keepPreviousData: true }
  );

  // Label mapping sesuai API
  const labelMapping = {
    no: "No.",
    po_id: "PO ID",
    faktur_id: "FAKTUR ID",
    order_id: "Order ID",
    sekolah: "Sekolah",
    tagihan: "Tagihan",
    toko: "Toko",
    wilayah: "Wilayah",
    tgl_order: "Tgl Order",
    status: "Status",
    customer_name: "Pelanggan",
    payment_method: "Metode Pembayaran",
  };

  // Style mapping untuk status
  const tableStyleMapping = {
    cell: {
      status: {
        wrapper: "span",
        variant: "status",
        base: "px-2 py-1 rounded-full text-xs font-semibold text-nowrap",
        classes: {
          Diterima: "bg-green-100 text-green-800",
          "Pesanan Dikirim/Dalam Pengiriman": "bg-blue-100 text-blue-800",
          "Pesanan Sampai Tujuan": "bg-purple-100 text-purple-800",
          default: "bg-gray-100 text-gray-600",
        },
      },
    },
  };

  // Transform data dari API
  const dataSource = useMemo(() => {
    if (!data?.data?.data) return [];

    return data.data.data.map((item) => ({
      no: item.no,
      po_id: item.po_id,
      faktur_id: item.faktur_id,
      order_id: item.order_id,
      sekolah: item.sekolah,
      tagihan: formatNumberToRupiah(item.tagihan),
      toko: item.toko,
      wilayah: item.wilayah,
      tgl_order: item.tgl_order,
      status: item.status,
      customer_name: item.customer_name,
      payment_method: item.payment_method,
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

  // Loading & Error
  if (initialLoading) {
    return (
      <div className="p-10">
        <TableSkeleton rows={6} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorFetch
        message={error?.message || "Gagal memuat data Orders Unconfirmed."}
      />
    );
  }

  return (
    <div className="p-4 mb-10">
      <h1 className="text-3xl font-semibold mb-6">Orders Unconfirmed</h1>

      <Table
        dataSource={dataSource}
        labelMapping={labelMapping}
        tableStyleMapping={tableStyleMapping}
        columnConfig={{
          actions: false,
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
        }}
        // filterConfig={{
        //   isFilter: !!data?.data?.filters,
        //   filters: {
        //     items: [
        //       {
        //         label: "Status",
        //         options: data?.data?.filters?.status || [],
        //         value: status,
        //         onChange: (val) => {
        //           setStatus(val);
        //           setPage(1);
        //         },
        //       },
        //     ],
        //   },
        // }}
      />
    </div>
  );
};

export default OrdersUnconfirmed;
