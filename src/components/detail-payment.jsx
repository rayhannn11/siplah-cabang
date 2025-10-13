import React from "react";
import {
  Check,
  FileText,
  Mail,
  Hash,
  Store,
  Truck,
  Building2,
  User,
  Phone,
  MapPin,
  Info,
  Package,
  History,
} from "lucide-react";
import { detailOrder } from "../data/config";
import OrderNotFound from "./order-not-found";

const DetailPayment = ({ typeOrder }) => {
  console.log(typeOrder, "typeOrder");
  const config = detailOrder[typeOrder];
  if (!config) return <OrderNotFound />;

  return (
    <>
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">Detail Pesanan</h1>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left Side (7/10) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Status Pesanan */}
          <div className="bg-white rounded shadow border border-gray-200">
            <div className="text-[#0073B7]  px-4 py-2 rounded-t flex items-center gap-2 bg-[#f2f2f2]">
              <Mail className="w-5 h-5" />
              <span className="font-semibold">{config.status}</span>
            </div>
          </div>
          {/* Unduh Dokumen */}
          <div className="bg-white rounded shadow border border-gray-200">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#f2f2f2] rounded-t">
              <FileText className="w-5 h-5 text-[#0073B7]" />
              <span className="font-semibold text-[#0073B7]">
                Unduh Dokumen
              </span>
            </div>
            <div className="p-4 flex gap-2">
              {config.documents?.map((doc, idx) => (
                <button
                  key={idx}
                  className="bg-[#0073B7] cursor-pointer text-white px-3 py-1 rounded shadow hover:bg-blue-800"
                >
                  {doc}
                </button>
              ))}
            </div>
          </div>

          {/* History Payment */}
          <div className="bg-white rounded shadow border border-gray-200">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#f2f2f2] rounded-t">
              <History className="w-5 h-5 text-[#0073B7]" />
              <span className="font-semibold text-[#0073B7]">
                History Payment
              </span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-1">Tgl History</th>
                  <th className="px-2 py-1">Status</th>
                  <th className="px-2 py-1">Memo</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {config.historyPayment?.map((row, idx) => (
                  <tr key={idx}>
                    <td className="px-2 py-1">{row.tgl}</td>
                    <td className="px-2 py-1">{row.status}</td>
                    <td className="px-2 py-1">{row.memo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Informasi Pemesanan */}
          <div className="bg-white rounded shadow border border-gray-200">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#f2f2f2] rounded-t">
              <Info className="w-5 h-5 text-[#0073B7]" />
              <span className="font-semibold text-[#0073B7]">
                Informasi Pemesanan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm p-4">
              {/* Kolom Kiri */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 font-semibold">
                    <Hash className="w-4 h-4 text-[#0073B7]" />
                    <span>No Pesanan</span>
                  </div>
                  <p className="ml-6 text-gray-800">
                    {config.informasiPemesanan.noPesanan}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 font-semibold">
                    <Store className="w-4 h-4 text-[#0073B7]" />
                    <span>Toko</span>
                  </div>
                  <p className="ml-6 text-gray-800">
                    {config.informasiPemesanan.toko}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 font-semibold">
                    <Truck className="w-4 h-4 text-[#0073B7]" />
                    <span>Ekspedisi</span>
                  </div>
                  <p className="ml-6 text-gray-800">
                    {config.informasiPemesanan.ekspedisi}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 font-semibold">
                    <FileText className="w-4 h-4 text-[#0073B7]" />
                    <span>Keterangan</span>
                  </div>
                  <p className="ml-6 text-gray-800">
                    {config.informasiPemesanan.keterangan}
                  </p>
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 font-semibold">
                    <Building2 className="w-4 h-4 text-[#0073B7]" />
                    <span>Sekolah</span>
                  </div>
                  <p className="ml-6 text-gray-800">
                    {config.informasiPemesanan.sekolah}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 font-semibold">
                    <User className="w-4 h-4 text-[#0073B7]" />
                    <span>PIC Sekolah</span>
                  </div>
                  <p className="ml-6 text-gray-800">
                    {config.informasiPemesanan.picSekolah}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 font-semibold">
                    <Phone className="w-4 h-4 text-[#0073B7]" />
                    <span>No Telp</span>
                  </div>
                  <p className="ml-6 text-gray-800">
                    {config.informasiPemesanan.noTelp}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 font-semibold">
                    <MapPin className="w-4 h-4 text-[#0073B7]" />
                    <span>Alamat Pengiriman</span>
                  </div>
                  <p className="ml-6 text-gray-800">
                    {config.informasiPemesanan.alamat}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informasi Produk */}
          <div className="bg-white rounded shadow border border-gray-200">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#f2f2f2] rounded-t">
              <Package className="w-5 h-5 text-[#0073B7]" />
              <span className="font-semibold text-[#0073B7]">
                Informasi Produk
              </span>
            </div>
            <table className="w-full border text-sm mb-4">
              <thead>
                <tr>
                  <th className="px-2 py-1">No</th>
                  <th className="px-2 py-1">Produk</th>
                  <th className="px-2 py-1">Nama</th>
                  <th className="px-2 py-1">Harga</th>
                  <th className="px-2 py-1">Jumlah</th>
                  <th className="px-2 py-1">Subtotal</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {config.produk?.map((p) => (
                  <tr key={p.no}>
                    <td>{p.no}</td>
                    <td>{p.produk}</td>
                    <td>{p.nama}</td>
                    <td>Rp{p.harga.toLocaleString("id-ID")}</td>
                    <td>{p.jumlah}</td>
                    <td>Rp{p.subtotal.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Ringkasan */}
            <div className="bg-white rounded p-4 pr-10 pb-10 text-sm w-full md:w-1/2 ml-auto">
              <div className="space-y-2">
                {config.ringkasan?.map((r, idx) => (
                  <div
                    key={idx}
                    className={`flex justify-between mb-2 ${
                      r.bold ? "font-bold" : ""
                    }`}
                  >
                    <span>{r.label}</span>
                    <span>Rp{r.value.toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (3/10) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div>
            <div className="bg-red-600 text-white px-4 py-2 rounded-t font-semibold w-44 rounded-md">
              Riwayat Pesanan
            </div>
            <ul className="ml-4 relative border-s border-[#DDDDDD] border-l-5 py-6 pl-6 pr-0">
              {config.riwayatPesanan?.map((r, idx) => (
                <li key={idx} className="mb-6 ms-6">
                  <span
                    className={`absolute flex items-center justify-center w-5 h-5 rounded-full -start-3 ring-8 ${
                      r.done
                        ? "bg-white ring-[#0073B7] text-[#0073B7]"
                        : "bg-[#666666] ring-[#D2D6DE] text-[#D2D6DE]"
                    }`}
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <p className="text-lg font-semibold text-blue-600">
                      {r.step}
                    </p>
                    <time className="mb-1 text-xs font-normal text-gray-400">
                      {r.tanggal}
                    </time>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailPayment;
