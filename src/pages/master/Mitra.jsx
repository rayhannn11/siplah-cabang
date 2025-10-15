import React, { useMemo, useState } from "react";
import Table from "../../components/tables/table";
import useFetch from "../../hooks/useFetch";
import useDebounce from "../../hooks/useDebounce";
import TableSkeleton from "../../components/loader/table-skeleton";
import ErrorFetch from "../../components/error-fetch";
import { fetchPartnersActive } from "../../api";
import { formatNumberToRupiah } from "../../utils";

const Mitra = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 800);

  // Fetch data dari API
  const { data, initialLoading, refetching, error } = useFetch(
    ["partnersActive", page, limit, debouncedSearch],
    () =>
      fetchPartnersActive({
        page,
        limit,
        search: debouncedSearch,
      }),
    { keepPreviousData: true }
  );

  // Mapping label kolom sesuai API response
  const labelMapping = {
    no: "No.",
    nama: "Nama Rekanan",
    jml_produk: "Jumlah Produk",
    total_penjualan: "Total Penjualan",
    jenis: "Jenis",
    jenis_usaha: "Jenis Usaha",
    npwp: "NPWP",
    bank: "Bank",
    no_rekening: "No. Rekening",
    nama_pic: "Nama PIC",
    kota: "Kota",
    approve: "Status",
  };

  // Styling untuk status approve
  const tableStyleMapping = {
    cell: {
      approve: {
        wrapper: "span",
        variant: "approve",
        base: "px-2 py-1 rounded-full text-xs font-semibold text-nowrap",
        classes: {
          Diapprove: "bg-green-100 text-green-700",
          Pending: "bg-yellow-100 text-yellow-700",
          Ditolak: "bg-red-100 text-red-700",
          default: "bg-gray-100 text-gray-600",
        },
      },
    },
  };

  // Transform dataSource dari API
  const dataSource = useMemo(() => {
    if (!data?.data?.data) return [];

    return data.data.data.map((item) => ({
      mall_id: item.mall_id,
      no: item.no,
      nama: item.nama,
      jml_produk: item.jml_produk,
      total_penjualan: formatNumberToRupiah(item.total_penjualan),
      jenis: item.jenis,
      jenis_usaha: item.jenis_usaha,
      npwp: item.npwp,
      bank: item.bank,
      no_rekening: item.no_rekening,
      nama_pic: item.nama_pic,
      kota: item.kota,
      approve: item.approve,
      actions: (
        <button
          onClick={(e) => {
            e.stopPropagation(); // 🔥 mencegah trigger redirect row
            window.location.href = `/orders?rekanan=${item.mall_id}`;
          }}
          className="btn btn-sm bg-[#FFC107] text-black text-nowrap hover:bg-[#e9b825]"
        >
          Lihat Pesanan
        </button>
      ),
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

  // Loading & Error State
  if (initialLoading) {
    return (
      <div className="p-10">
        <TableSkeleton rows={6} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorFetch message={error?.message || "Gagal memuat data rekanan."} />
    );
  }

  console.log(dataSource, "dataSource");

  return (
    <div className="p-4 mb-10">
      <h1 className="text-3xl font-semibold mb-6">Daftar Rekanan Aktif</h1>

      <Table
        dataSource={dataSource}
        labelMapping={labelMapping}
        tableStyleMapping={tableStyleMapping}
        columnConfig={{
          actions: false, // ❌ tidak perlu actions
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
          redirectField: "nama",

          // 👇 callback ketika diklik
          onRowRedirect: (row) => {
            window.location.href = `/rekanan/detail/${row.mall_id}`;
          },
        }}
      />
    </div>
  );
};

export default Mitra;
