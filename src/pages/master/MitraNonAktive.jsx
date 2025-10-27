import React, { useMemo, useState } from "react";
import Table from "../../components/tables/table";
import useFetch from "../../hooks/useFetch";
import useDebounce from "../../hooks/useDebounce";
import TableSkeleton from "../../components/loader/table-skeleton";
import ErrorFetch from "../../components/error-fetch";
import { fetchPartnersInactive } from "../../api";

const MitraNonAktive = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [localSearch, setLocalSearch] = useState("");

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 800);

  // Fetch data dari API
  const { data, initialLoading, refetching, error } = useFetch(
    ["partnersInactive", page, limit, debouncedSearch],
    () =>
      fetchPartnersInactive({
        page,
        limit,
        search: debouncedSearch,
      }),
    { keepPreviousData: true }
  );
  console.log(data, "mitra modar");
  // Label tabel sesuai response
  const labelMapping = {
    no: "No.",
    nama: "Nama Rekanan",
    jenis: "Jenis",
    jenis_usaha: "Jenis Usaha",
    nama_pic: "Nama PIC",
    kota: "Kota",
    approve: "Status",
    last_transaction: "Transaksi Terakhir",
    inactive_duration: "Durasi Tidak Aktif",
  };

  // Styling approve
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

  // DataSource dari API
  const dataSource = useMemo(() => {
    if (!data?.data?.data) return [];

    return data.data.data.map((item) => ({
      no: item.no,
      nama: item.nama,
      jenis: item.jenis,
      jenis_usaha: item.jenis_usaha,
      nama_pic: item.nama_pic,
      kota: item.kota,
      kecamatan: item.kecamatan,
      approve: item.approve,
      last_transaction: item.last_transaction,
      inactive_duration: item.inactive_duration,
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
        message={error?.message || "Gagal memuat data rekanan tidak aktif."}
      />
    );
  }

  const criteria = data?.data?.criteria;

  return (
    <div className="p-4 mb-10">
      <h1 className="text-3xl font-semibold mb-6">
        Daftar Rekanan Tidak Aktif
      </h1>

      {criteria && (
        <div className="mb-6 rounded-md bg-red-100 border border-red-400 text-red-700 px-6 py-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 mt-0.5 text-red-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M9.17 9.17a7 7 0 0110.66 0M12 3a9 9 0 100 18 9 9 0 000-18z"
              />
            </svg>
            <div>
              <h2 className="font-semibold text-lg">
                Perhatian! Data Rekanan Tidak Aktif
              </h2>
              <p className="text-sm mt-1">
                {criteria.description} sejak <b>{criteria.inactive_since}</b>.
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
          onRowClick: (row) => {
            window.location.href = `/rekanan/nonaktif/detail/${row.no}`;
          },
        }}
      />
    </div>
  );
};

export default MitraNonAktive;
