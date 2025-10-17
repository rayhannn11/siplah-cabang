import React from "react";
import { useParams } from "react-router-dom";
import { fetchPartnerDetail } from "../../api";
import useFetch from "../../hooks/useFetch";
import TableSkeleton from "../../components/loader/table-skeleton";
import {
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle,
  ClipboardCheck,
  Clock,
  Facebook,
  FlaskConical,
  Globe,
  Globe2,
  Hash,
  Home,
  Info,
  Instagram,
  Mail,
  MapPin,
  Percent,
  Phone,
  RefreshCw,
  Settings,
  ShieldCheck,
  Store,
  Truck,
  Twitter,
  User,
  Users,
} from "lucide-react";

const MitraDetail = () => {
  const { id } = useParams();

  // Fetch data dari API
  const { data, initialLoading, refetching, error } = useFetch(
    ["partnerDetail"],
    () => fetchPartnerDetail(id),
    { keepPreviousData: true }
  );

  if (initialLoading) {
    return (
      <div className="p-10">
        <TableSkeleton rows={6} />
      </div>
    );
  }
  console.log(data?.data);

  const mall = data?.data;

  return (
    <div className="w-full flex flex-col gap-8 pb-20 px-6 md:px-16 lg:px-24">
      {/* ====== HEADER / BASIC INFO ====== */}
      <div className="relative rounded-sm overflow-hidden shadow-lg mt-4">
        <img
          src={mall.basic_info.images.header || "/default-header.jpg"}
          alt="Header"
          className="w-full h-60 md:h-72 object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/100 to-transparent text-white p-6 flex flex-col md:flex-row md:items-end gap-5">
          <img
            src={mall.basic_info.images.main || "/default-logo.jpg"}
            alt="Logo"
            className="w-24 h-24 md:w-28 md:h-28 border-4 border-white object-cover shadow-md"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
              {mall.basic_info.name || "-"}
            </h1>
            <p className="text-sm text-gray-200">
              {mall.basic_info.mall_code || "-"}
            </p>
            <p className="text-sm mt-2">
              Status:{" "}
              <span
                className={`font-semibold ${
                  mall.status_info.status.is_active
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {mall.status_info.status.label || "-"}
              </span>
            </p>
          </div>
        </div>
      </div>
      {/* ====== INFO PERUSAHAAN, KONTAK & ALAMAT ====== */}
      <div className="bg-white rounded shadow border border-gray-200">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3 bg-[#0A1F3C] rounded-t">
          <Info className="w-6 h-6 text-white" />
          <span className="text-lg font-semibold text-white">
            Profil & Informasi Kontak
          </span>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base p-6">
          {/* Kolom Kiri */}
          <div className="space-y-6">
            {/* Nama Perusahaan */}
            <div>
              <div className="flex items-center gap-3 text-gray-700 font-semibold">
                <Building2 className="w-5 h-5 text-[#0073B7]" />
                <span>Nama Perusahaan</span>
              </div>
              <p className="ml-8 text-gray-900 font-medium">
                {mall.company_info.nama_perusahaan || "-"}
              </p>
            </div>

            {/* Nama Merek */}
            <div>
              <div className="flex items-center gap-3 text-gray-700 font-semibold">
                <Hash className="w-5 h-5 text-[#0073B7]" />
                <span>Nama Merek</span>
              </div>
              <p className="ml-8 text-gray-900 font-medium">
                {mall.company_info.nama_merk || "-"}
              </p>
            </div>

            {/* Alamat Perusahaan */}
            <div>
              <div className="flex items-center gap-3 text-gray-700 font-semibold">
                <Home className="w-5 h-5 text-[#0073B7]" />
                <span>Alamat Perusahaan</span>
              </div>
              <p className="ml-8 text-gray-900 font-medium">
                {mall.company_info.alamat_perusahaan || "-"}
              </p>
            </div>

            {/* Jenis Usaha */}
            <div>
              <div className="flex items-center gap-3 text-gray-700 font-semibold">
                <Building2 className="w-5 h-5 text-[#0073B7]" />
                <span>Jenis Usaha</span>
              </div>
              <p className="ml-8 text-gray-900 font-medium">
                {mall.company_info.jenis_usaha || "-"}
              </p>
            </div>

            {/* Jenis */}
            <div>
              <div className="flex items-center gap-3 text-gray-700 font-semibold">
                <Hash className="w-5 h-5 text-[#0073B7]" />
                <span>Jenis</span>
              </div>
              <p className="ml-8 text-gray-900 font-medium">
                {mall.company_info.jenis || "-"}
              </p>
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-6">
            {/* Email */}
            <div>
              <div className="flex items-center gap-3 text-gray-700 font-semibold">
                <Mail className="w-5 h-5 text-[#0073B7]" />
                <span>Email</span>
              </div>
              <p className="ml-8 text-gray-900 font-medium">
                {mall.contact_info.email || "-"}
              </p>
            </div>

            {/* Nama PIC */}
            <div>
              <div className="flex items-center gap-3 text-gray-700 font-semibold">
                <User className="w-5 h-5 text-[#0073B7]" />
                <span>Nama PIC</span>
              </div>
              <p className="ml-8 text-gray-900 font-medium">
                {mall.contact_info.pic?.nama || "-"}
              </p>
            </div>

            {/* Jabatan PIC */}
            <div>
              <div className="flex items-center gap-3 text-gray-700 font-semibold">
                <Briefcase className="w-5 h-5 text-[#0073B7]" />
                <span>Jabatan PIC</span>
              </div>
              <p className="ml-8 text-gray-900 font-medium">
                {mall.contact_info.pic?.jabatan || "-"}
              </p>
            </div>

            {/* Telepon PIC */}
            <div>
              <div className="flex items-center gap-3 text-gray-700 font-semibold">
                <Phone className="w-5 h-5 text-[#0073B7]" />
                <span>Telepon PIC</span>
              </div>
              <p className="ml-8 text-gray-900 font-medium">
                {mall.contact_info.pic?.telp || "-"}
              </p>
            </div>

            {/* Alamat Lengkap */}
            <div>
              <div className="flex items-center gap-3 text-gray-700 font-semibold">
                <MapPin className="w-5 h-5 text-[#0073B7]" />
                <span>Alamat Lengkap</span>
              </div>
              <p className="ml-8 text-gray-900 font-medium">
                {mall.address_info.address || "-"}
              </p>
            </div>

            {/* Detail Wilayah */}
            <div className="grid grid-cols-2 gap-4 ml-8">
              <div>
                <p className="text-gray-700 font-semibold">Kecamatan</p>
                <p className="text-gray-900 font-medium">
                  {mall.address_info.district?.kecamatan || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-700 font-semibold">Kota</p>
                <p className="text-gray-900 font-medium">
                  {mall.address_info.city?.name || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-700 font-semibold">Provinsi</p>
                <p className="text-gray-900 font-medium">
                  {mall.address_info.province?.name || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-700 font-semibold">Kode Pos</p>
                <p className="text-gray-900 font-medium">
                  {mall.address_info.postcode || "-"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-700 font-semibold">Pulau</p>
                <p className="text-gray-900 font-medium">
                  {mall.address_info.island?.name || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== DOKUMEN ====== */}
      <div className="bg-white rounded shadow border border-gray-200">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#0A1F3C] rounded-t">
          <Info className="w-5 h-5 text-white" />
          <span className="font-semibold text-white">Dokumen</span>
        </div>

        <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.entries(mall.documents)
            .filter(([_, doc]) => doc.image) // hanya ambil yang ada gambarnya
            .map(([key, doc]) => (
              <div
                key={key}
                className="flex flex-col items-center p-4  rounded-xl hover:shadow-md transition"
              >
                <img
                  src={doc.image}
                  alt={key}
                  className="w-full h-32 object-contain rounded-md p-3 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200"
                />

                <p className="mt-3 text-sm font-semibold uppercase">{key}</p>
                <p className="text-xs text-gray-700 mt-1">{doc.id || "-"}</p>
              </div>
            ))}

          {/* Jika semua dokumen kosong, tampilkan pesan default */}
          {Object.values(mall.documents).every((doc) => !doc.image) && (
            <p className="col-span-full text-center text-gray-500">
              Tidak ada dokumen yang tersedia.
            </p>
          )}
        </div>
      </div>

      {/* ====== PENGATURAN BISNIS ====== */}
      <div className="bg-white rounded shadow border border-gray-200">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3 bg-[#0A1F3C] rounded-t">
          <Settings className="w-6 h-6 text-white" />
          <span className="text-lg font-semibold text-white">
            Pengaturan Bisnis
          </span>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-base p-6">
          {/* Lama Pengiriman */}
          <div>
            <div className="flex items-center gap-3 text-gray-700 font-semibold">
              <Truck className="w-5 h-5 text-[#0073B7]" />
              <span>Lama Pengiriman</span>
            </div>
            <p className="ml-8 text-gray-900 font-medium">
              {mall.business_settings.lama_pengiriman || "-"} hari
            </p>
          </div>

          {/* True PPN */}
          {/* <div>
            <div className="flex items-center gap-3 text-gray-700 font-semibold">
              <Percent className="w-5 h-5 text-[#0073B7]" />
              <span>True PPN</span>
            </div>
            <p className="ml-8 text-gray-900 font-medium">
              {mall.business_settings.is_trueppn?.label || "-"}
            </p>
          </div> */}

          {/* Vendor */}
          <div>
            <div className="flex items-center gap-3 text-gray-700 font-semibold">
              <Store className="w-5 h-5 text-[#0073B7]" />
              <span>Vendor</span>
            </div>
            <p className="ml-8 text-gray-900 font-medium">
              {mall.business_settings.vendor?.label || "-"}
            </p>
          </div>

          {/* Official */}
          <div>
            <div className="flex items-center gap-3 text-gray-700 font-semibold">
              <ShieldCheck className="w-5 h-5 text-[#0073B7]" />
              <span>Official</span>
            </div>
            <p className="ml-8 text-gray-900 font-medium">
              {mall.business_settings.official?.label || "-"}
            </p>
          </div>

          {/* Reseller */}
          <div>
            <div className="flex items-center gap-3 text-gray-700 font-semibold">
              <Users className="w-5 h-5 text-[#0073B7]" />
              <span>Reseller</span>
            </div>
            <p className="ml-8 text-gray-900 font-medium">
              {mall.business_settings.reseller?.label || "-"}
            </p>
          </div>

          {/* Sandbox */}
          {/* <div>
            <div className="flex items-center gap-3 text-gray-700 font-semibold">
              <FlaskConical className="w-5 h-5 text-[#0073B7]" />
              <span>Sandbox</span>
            </div>
            <p className="ml-8 text-gray-900 font-medium">
              {mall.business_settings.sandbox?.label || "-"}
            </p>
          </div> */}
        </div>
      </div>
      {/* ====== STATUS REKANAN ====== */}
      <div className="bg-white rounded shadow border border-gray-200">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3 bg-[#0A1F3C] rounded-t">
          <BadgeCheck className="w-6 h-6 text-white" />
          <span className="text-lg font-semibold text-white">
            Status Rekanan
          </span>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-base p-6">
          {/* Status */}
          <div>
            <div className="flex items-center gap-3 text-gray-700 font-semibold">
              <CheckCircle className="w-5 h-5 text-[#0073B7]" />
              <span>Status</span>
            </div>
            <p className="ml-8 text-gray-900 font-medium">
              {mall.status_info.status?.label || "-"}
            </p>
          </div>

          {/* Approval */}
          <div>
            <div className="flex items-center gap-3 text-gray-700 font-semibold">
              <ClipboardCheck className="w-5 h-5 text-[#0073B7]" />
              <span>Approval</span>
            </div>
            <p className="ml-8 text-gray-900 font-medium">
              {mall.status_info.approval?.label || "-"}
            </p>
          </div>

          {/* Disetujui pada */}
          <div>
            <div className="flex items-center gap-3 text-gray-700 font-semibold">
              <Clock className="w-5 h-5 text-[#0073B7]" />
              <span>Disetujui pada</span>
            </div>
            <p className="ml-8 text-gray-900 font-medium">
              {mall.status_info.approval?.approved_at || "-"}
            </p>
          </div>

          {/* Pembaruan Terakhir */}
          <div>
            <div className="flex items-center gap-3 text-gray-700 font-semibold">
              <RefreshCw className="w-5 h-5 text-[#0073B7]" />
              <span>Pembaruan Terakhir</span>
            </div>
            <p className="ml-8 text-gray-900 font-medium">
              {mall.status_info.last_update?.date || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* ====== INFORMASI TEKNIS & SOSIAL ====== */}
      <div className="bg-white rounded shadow border border-gray-200">
        <div className="flex items-center gap-3 px-5 py-3 bg-[#0A1F3C] rounded-t">
          <Globe size={22} className="text-white" />
          <span className="text-lg font-semibold text-white">
            Info Teknis & Sosial Media
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6 text-base leading-relaxed">
          <div className="flex items-start gap-2">
            <Globe2 className="w-6 h-6 text-blue-600 mt-1" />
            <p>
              <strong>IP Address:</strong>{" "}
              {mall.additional_info.ip_address || "-"}
            </p>
          </div>

          <div className="flex items-start gap-2">
            <Globe className="w-6 h-6 text-gray-600 mt-1" />
            <p>
              <strong>User Agent:</strong>{" "}
              {mall.additional_info.user_agent || "-"}
            </p>
          </div>

          <div className="flex items-start gap-2">
            <Facebook className="w-6 h-6 text-blue-700 mt-1" />
            <p>
              <strong>Facebook:</strong> {mall.social_media.facebook || "-"}
            </p>
          </div>

          <div className="flex items-start gap-2">
            <Instagram className="w-6 h-6 text-pink-600 mt-1" />
            <p>
              <strong>Instagram:</strong> {mall.social_media.instagram || "-"}
            </p>
          </div>

          <div className="flex items-start gap-2">
            <Twitter className="w-6 h-6 text-sky-500 mt-1" />
            <p>
              <strong>Twitter:</strong> {mall.social_media.twitter || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MitraDetail;
