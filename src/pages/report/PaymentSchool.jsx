import React, { useMemo, useState } from "react";
import { reportConfig } from "../../data/config";
import Table from "../../components/tables/table";
import { parseDateFlexible } from "../../utils";

const PaymentCv = () => {
  const config = reportConfig["reportCV"];

  // state tanggal filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // convert "Rp25.000.000" → 25000000
  const parseRupiah = (value) => {
    if (!value) return 0;
    return parseInt(value.replace(/[^0-9]/g, ""), 10);
  };

  // filter data sesuai range tanggal
  const filteredData = useMemo(() => {
    // kalau belum pilih range, tampilkan semua
    if (!startDate || !endDate) return config.dummyData;

    // startDate / endDate dari <input type="date">: format "YYYY-MM-DD"
    // set start ke jam 00:00:00 dan end ke 23:59:59.999 supaya inklusif
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59.999`);

    return config.dummyData.filter((item) => {
      // ambil dulu nilai tanggal dari beberapa kemungkinan nama field
      const raw =
        item.tglDiteruskan ??
        item.tglDiteruskanRaw ??
        item.tglTransfer ??
        item.tgl;

      const t = parseDateFlexible(raw);
      if (!t) return false; // kalau gak bisa parse, exclude atau sesuaikan kebijakanmu

      return t >= start && t <= end;
    });
  }, [config.dummyData, startDate, endDate]);

  // jumlah totalInvoice hasil filter
  const totalInvoice = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => acc + parseRupiah(item.totalInvoice),
      0
    );
  }, [filteredData]);

  // format ke Rp
  const formatRupiah = (angka) => {
    return angka.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  };

  return (
    <div className="p-4 mb-10">
      <h1 className="text-3xl font-semibold mb-6">{config.title}</h1>

      {/* Filter Tanggal */}
      <div className="flex flex-col md:flex-row items-stretch justify-between mb-6 gap-6">
        {/* Box Filter Tanggal */}
        <div className="bg-white p-4 rounded shadow flex  items-end gap-4 md:w-3/5 w-full">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Tgl Mulai:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Tgl Akhir:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
        </div>

        {/* Box Total Dana */}
        <div className="bg-[#3C8DBC] text-white px-8 py-6 rounded md:w-2/5 w-full flex flex-col justify-center text-xl">
          <p className="font-semibold">Daftar Penerusan Dana</p>
          <p>{formatRupiah(totalInvoice)}</p>
        </div>
      </div>

      {/* Table */}
      <Table
        dataSource={filteredData}
        labelMapping={config.labelMapping}
        tableStyleMapping={config.tableStyleMapping}
        widgets={config.widgets}
        columnConfig={{
          actions: true,
          actionsList: config.actionsList,
          showSearchInput: true,
          showExportExcel: false,
          showExportPDF: false,
          showDateFilter: false,
        }}
        name="Laporan Harian"
        excel_name="Report General"
      />
    </div>
  );
};

export default PaymentCv;
