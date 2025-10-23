import React, { useMemo, useState } from "react";
import Table from "../../components/tables/table";
import useFetch from "../../hooks/useFetch";
import useDebounce from "../../hooks/useDebounce";
import TableSkeleton from "../../components/loader/table-skeleton";
import ErrorFetch from "../../components/error-fetch";
import { fetchPartnersHistory } from "../../api";
import { formatNumberToRupiah } from "../../utils";

const MitraHistory = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [localSearch, setLocalSearch] = useState("");

  const [search, setSearch] = useState("");
  // const [statusApprove, setStatusApprove] = useState("");
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear.toString());
  const debouncedSearch = useDebounce(search, 800);

  // Clear filters function
  const clearFilters = () => {
    setSearch("");
    setYear(currentYear.toString());
    // Don't reset page - keep current pagination
  };

  const handleSearchClick = () => {
    // baru ubah state pencarian utama
    setSearch(localSearch);
    setPage(1);
  };

  // Fetch API
  const { data, initialLoading, refetching, error } = useFetch(
    ["partnersHistory", page, limit, debouncedSearch, year],
    () =>
      fetchPartnersHistory({
        page,
        limit,
        search: debouncedSearch,
        year,
      }),
    { keepPreviousData: true }
  );

  // Mapping kolom sesuai API
  const labelMapping = {
    no: "No.",
    nama: "Nama",
    status: "Status",
    transaksi_terakhir: "Transaksi Terakhir",
    total_penjualan: "Total Penjualan",
    jenis: "Jenis",
    jenis_usaha: "Jenis Usaha",
    npwp: "NPWP",
    bank: "Bank",
    no_rekening: "No Rekening",
    nama_pic: "Nama PIC",
    kota: "Kota",
    kecamatan: "Kecamatan",
    kelurahan: "Kelurahan",
    telp: "Telp",
  };

  // Style mapping untuk status
  const tableStyleMapping = {
    cell: {
      status: {
        wrapper: "span",
        variant: "status",
        base: "px-2 py-1 rounded-full text-xs font-semibold text-nowrap",
        classes: {
          Diapprove: "bg-green-100 text-green-700",
          "Belum Approve": "bg-yellow-100 text-yellow-700",
          default: "bg-gray-100 text-gray-600",
        },
      },
    },
  };

  // Transform data
  const dataSource = useMemo(() => {
    if (!data?.data?.data) return [];

    return data.data.data.map((item) => ({
      no: item.no,
      nama: item.nama,
      status: item.status,
      transaksi_terakhir: item.transaksi_terakhir,
      total_penjualan: formatNumberToRupiah(item.total_penjualan),
      jenis: item.jenis,
      jenis_usaha: item.jenis_usaha,
      npwp: item.npwp,
      bank: item.bank,
      no_rekening: item.no_rekening,
      nama_pic: item.nama_pic,
      kota: item.kota,
      kecamatan: item.kecamatan,
      kelurahan: item.kelurahan,
      telp: item.telp,
    }));
  }, [data]);

  // Pagination
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
      <ErrorFetch message={error?.message || "Gagal memuat data CV History."} />
    );
  }

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
      <h1 className="text-3xl font-semibold mb-6">Daftar Riwayat Rekanan</h1>

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
        }}
        filterConfig={{
          isFilter: !!data?.data?.filters,
          filters: {
            items: [
              {
                label: "Tahun",
                options: data?.data?.filters?.year || [],
                value: year,
                onChange: (val) => {
                  setYear(val);
                  setPage(1);
                },
              },
            ],
          },
        }}
        widgets={widgets}
      />
    </div>
  );
};

export default MitraHistory;
