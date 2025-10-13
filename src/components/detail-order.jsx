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
  Clock,
  CreditCard,
} from "lucide-react";
import { detailOrder } from "../data/config";
import OrderNotFound from "./order-not-found";
import { formatNumberToRupiah } from "../utils";

const DetailOrder = ({ data }) => {
  console.log(data, "data");
  // const config = detailOrder[typeOrder];
  if (!data) return <OrderNotFound />;

  return (
    <>
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">Detail Pesanan</h1>

      {/* Content Grid */}
      <div className="flex flex-col gap-6">
        {/* === Container Utama: Left + Right === */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Left Side (7/10) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Status Pesanan */}
            <div className="bg-white rounded shadow border border-gray-200">
              <div className="flex items-center justify-between px-4 py-2 bg-[#0A1F3C]  rounded-t">
                <div className="flex items-center gap-2 text-white">
                  <Mail className="w-5 h-5" />
                  <span className="font-semibold">
                    {data.processing.column.find((c) => c.isActive)?.title ||
                      "Status Tidak Diketahui"}{" "}
                    {(data.cancelReason || data.closeReason) && (
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-sm ${
                          data.cancelReason
                            ? "bg-[#dc2626] text-white"
                            : "bg-[#000000] text-white"
                        }`}
                      >
                        {data.cancelReason
                          ? -data.cancelReason
                          : -data.closeReason}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Unduh Dokumen */}
            <div className="bg-white rounded shadow border border-gray-200">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#0A1F3C] rounded-t">
                <FileText className="w-5 h-5 text-white" />
                <span className="font-semibold text-white">Unduh Dokumen</span>
              </div>
              <div className="p-4 flex gap-2">
                {data.printDocuments.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#FFC107] cursor-pointer text-black px-3 py-1 rounded shadow hover:bg-[#e7b212] w-fit"
                  >
                    {doc.name}
                  </a>
                ))}
              </div>
            </div>

            {/* History Payment */}
            <div className="bg-white rounded shadow border border-gray-200">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#0A1F3C] rounded-t">
                <History className="w-5 h-5 text-[#fff]" />
                <span className="font-semibold text-[#fff]">
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
                  {data.paymentHistory.length > 0 ? (
                    data.paymentHistory.map((row, idx) => (
                      <tr key={idx}>
                        <td className="px-2 py-1">{row.tgl || "-"}</td>
                        <td className="px-2 py-1">{row.status || "-"}</td>
                        <td className="px-2 py-1">{row.memo || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-3 text-gray-400">
                        Belum ada riwayat pembayaran
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Informasi Pemesanan */}
            <div className="bg-white rounded shadow border border-gray-200">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#0A1F3C] rounded-t">
                <Info className="w-5 h-5 text-[#fff]" />
                <span className="font-semibold text-[#fff]">
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
                      {data.sectionOrderInformation.noPesanan}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-600 font-semibold">
                      <Store className="w-4 h-4 text-[#0073B7]" />
                      <span>Toko</span>
                    </div>
                    <p className="ml-6 text-gray-800">
                      {data.sectionOrderInformation.mall.name}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-600 font-semibold">
                      <Truck className="w-4 h-4 text-[#0073B7]" />
                      <span>Ekspedisi</span>
                    </div>
                    <p className="ml-6 text-gray-800">
                      {data.sectionOrderInformation.shipping.name}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-600 font-semibold">
                      <FileText className="w-4 h-4 text-[#0073B7]" />
                      <span>Invoice</span>
                    </div>
                    <p className="ml-6 text-gray-800">
                      {data.sectionOrderInformation.invoice}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-600 font-semibold">
                      <CreditCard className="w-4 h-4 text-[#0073B7]" />
                      <span>Metode Pembayaran</span>
                    </div>
                    <p className="ml-6 text-gray-800 capitalize">
                      {(() => {
                        const bank =
                          data.sectionOrderInformation.paymentMethod.bank;
                        if (!bank) return "-";
                        return bank
                          .replace("bank_", "Bank ")
                          .replace("_va", " Va")
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase());
                      })()}
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
                      {data.sectionOrderInformation.school.name}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-600 font-semibold">
                      <User className="w-4 h-4 text-[#0073B7]" />
                      <span>PIC Sekolah</span>
                    </div>
                    <p className="ml-6 text-gray-800">
                      {data.sectionOrderInformation.school.pic}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-600 font-semibold">
                      <Phone className="w-4 h-4 text-[#0073B7]" />
                      <span>No Telp</span>
                    </div>
                    <p className="ml-6 text-gray-800">
                      {data.sectionOrderInformation.school.phoneNumber}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-600 font-semibold">
                      <MapPin className="w-4 h-4 text-[#0073B7]" />
                      <span>Alamat Pengiriman</span>
                    </div>
                    <p className="ml-6 text-gray-800">
                      {data.sectionOrderInformation.shipping.address}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-600 font-semibold">
                      <Clock className="w-4 h-4 text-[#0073B7]" />
                      <span>Jatuh Tempo Pembayaran</span>
                    </div>
                    <p className="ml-6 text-gray-800">
                      {data.sectionOrderInformation.paymentMethod
                        .termOfPayment || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side (3/10) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div>
              <div className="bg-[#0A1F3C] text-white px-4 py-2 rounded-t font-semibold w-44 rounded-md">
                Riwayat Pesanan
              </div>
              <ul className="ml-4 relative border-s border-[#DDDDDD] border-l-5 py-6 pl-6 pr-0">
                {[...data.orderHistory].reverse().map((r, idx) => (
                  <li key={idx} className="mb-6 ms-6">
                    <span className="absolute flex items-center justify-center w-5 h-5 rounded-full -start-3 ring-8 bg-[#facd46] ring-[#facd46] text-[#000] ">
                      <Check size={17} strokeWidth={3} />
                    </span>
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <p className="text-lg font-semibold text-black">
                        {r.title}
                      </p>
                      <time className="mb-1 text-xs font-normal text-gray-400">
                        {r.createdAt} {r.timeAt}
                      </time>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* === Informasi Produk di bawah === */}
        <div className="bg-white rounded shadow border border-gray-200 w-full">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#0A1F3C] rounded-t">
            <Package className="w-5 h-5 text-[#fff]" />
            <span className="font-semibold text-[#fff]">Informasi Produk</span>
          </div>
          <div className="w-full overflow-x-auto mt-6 px-4">
            <table className="w-full min-w-max text-sm mb-4 border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-left">
                  {[
                    "No",
                    "Image",
                    "Nama",
                    "Harga Produk",
                    "DPP per Item",
                    "DPP Total",
                    "PPN Item",
                    "PPN Total",
                    "Qty Terima Baik",
                    "Qty Terima Buruk",
                    "Jumlah",
                    "Subtotal",
                  ].map((header, idx) => (
                    <th
                      key={idx}
                      className="px-3 py-2 font-semibold text-gray-700 whitespace-nowrap border border-gray-300"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="text-center border border-gray-300">
                {data.sectionProductInformation.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    {/* No */}
                    <td className="py-3 px-2 whitespace-nowrap border border-gray-300">
                      {idx + 1}
                    </td>

                    {/* Image Produk */}
                    <td className="py-3 px-2 border border-gray-300">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover mx-auto rounded"
                      />
                    </td>

                    {/* Nama Produk */}
                    <td className="py-3 px-2 whitespace-nowrap border border-gray-300">
                      {item.name}
                    </td>

                    {/* Harga Produk */}
                    <td className="py-3 px-2 whitespace-nowrap border border-gray-300">
                      {formatNumberToRupiah(item.price)}
                    </td>

                    {/* DPP per Item */}
                    <td className="py-3 px-2 whitespace-nowrap border border-gray-300">
                      {formatNumberToRupiah(item.dpp)}
                    </td>

                    {/* DPP Total */}
                    <td className="py-3 px-2 whitespace-nowrap border border-gray-300">
                      {formatNumberToRupiah(item.total_dpp)}
                    </td>

                    {/* PPN Item */}
                    <td className="py-3 px-2 whitespace-nowrap border border-gray-300">
                      {formatNumberToRupiah(item.ppn_price_item)}
                    </td>

                    {/* PPN Total */}
                    <td className="py-3 px-2 whitespace-nowrap border border-gray-300">
                      {formatNumberToRupiah(item.ppn_price)}
                    </td>

                    {/* Qty Terima Baik */}
                    <td className="py-3 px-2 whitespace-nowrap border border-gray-300">
                      {item.qty_terima_baik}
                    </td>

                    {/* Qty Terima Buruk */}
                    <td className="py-3 px-2 whitespace-nowrap border border-gray-300">
                      {item.qty_terima_buruk}
                    </td>

                    {/* Jumlah */}
                    <td className="py-3 px-2 whitespace-nowrap border border-gray-300">
                      {item.qty}
                    </td>

                    {/* Subtotal */}
                    <td className="py-3 px-2 whitespace-nowrap border border-gray-300">
                      {formatNumberToRupiah(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded p-4 pr-10 pb-10 text-sm w-full md:w-1/2 ml-auto">
            {data.sectionProductInformation.descriptionTotal.map(
              ([label, value], idx) => (
                <div
                  key={idx}
                  className={`flex justify-between mb-2 mt-4 ${
                    label.includes("Total") || label.includes("Grand")
                      ? "font-bold"
                      : ""
                  }`}
                >
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailOrder;
