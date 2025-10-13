import React from "react";
import useZodForm from "../../hooks/useZodForms";
import { profileSchema } from "../../lib/schema";
import { useForm } from "react-hook-form";

// asumsi hook zod form kamu
import BaseForm from "../../components/form/base-form";
import FormInput from "../../components/form/form-input";
import { BookOpen, MapPin, FileText } from "lucide-react";
import { useAuthStore } from "../../stores";
import axios from "../../lib/axios";
import Swal from "sweetalert2";

const DEFAULT_IMAGE =
  "https://cdn.eurekabookhouse.co.id/ebh/mall/EurekaBookhouse_foto18_37_57.png";

const Profile = () => {
  const { user, setUser } = useAuthStore();

  const methods = useZodForm(profileSchema, {
    defaultValues: {
      name: user?.name || "",
      slug: user?.slug || "",
      company: user?.nama_perusahaan || "",
      owner: user?.owner || "",
      email: user?.email_pic || user?.email || "",
      picName: user?.nama_pic || "",
      picPosition: user?.jabatan_pic || "",
      picPhone: user?.telp_pic || "",
      address: user?.address || "",
      province: user?.province || "",
      city: user?.city || "",
      zone1: user?.zone_1 || "",
      zone2: user?.zone_2 || "",
      postcode: user?.postcode || "",
      phone: user?.phone || "",
      facebook: user?.facebook || "",
      instagram: user?.instagram || "",
      twitter: user?.twitter || "",
      status: user?.status === "1" ? "Aktif" : "Non Aktif",
    },
  });

  const { handleSubmit, formState } = methods;
  const { errors, isSubmitting } = formState;

  const onSubmit = async (values) => {
    try {
      // Mapping reqBody langsung dari form values
      const reqBody = {
        name: values.name,
        slug: values.slug,
        nama_perusahaan: values.company,
        owner: values.owner,
        email_pic: values.email,
        nama_pic: values.picName,
        jabatan_pic: values.picPosition,
        telp_pic: values.picPhone,
        address: values.address,
        province: values.province,
        city: values.city,
        zone_1: values.zone1,
        zone_2: values.zone2,
        postcode: values.postcode,
        phone: values.phone,
        facebook: values.facebook,
        instagram: values.instagram,
        twitter: values.twitter,
        status: values.status === "Aktif" ? "1" : "0", // convert ke format API
      };

      const { data } = await axios.put("auth/profile", reqBody);

      if (data?.status?.code === 200) {
        setUser(data?.data?.cabang); // ambil dari profile

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: data?.status?.message || "Profile updated successfully",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: data?.status?.message || "Update profile gagal",
        });
      }
    } catch (error) {
      let message = "Terjadi kesalahan saat update profile";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
      });
    }
  };
  return (
    <div className="p-6 bg-[#ECF0F5] min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="space-y-4">
          {/* Card Profile Perusahaan */}
          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
            <img
              src={
                user?.image
                  ? `https://cdn.eurekabookhouse.co.id/ebh/mall/${user.image}`
                  : DEFAULT_IMAGE
              }
              alt="Company Logo"
              className="w-40 h-40 object-contain"
            />
            <h2 className="text-xl font-bold">{user?.nama_perusahaan}</h2>
            <p className="text-gray-500 mb-4">{user?.province}</p>
          </div>

          {/* Card Tentang */}
          <div className="bg-white shadow rounded-lg">
            {/* Header */}
            <div className="border-b px-4 py-2 bg-[#2A3042] text-white rounded-t-lg">
              <h3 className="font-semibold ">Tentang</h3>
            </div>

            <div className="p-4 space-y-4">
              {/* Sosial Media */}
              <div>
                <div className="flex items-center gap-2 font-semibold">
                  <BookOpen size={16} />
                  <span>Sosial Media</span>
                </div>
                <p className="text-sm text-gray-600">{user?.facebook || "-"}</p>
                <p className="text-sm text-gray-600">
                  {user?.instagram || "-"}
                </p>
                <p className="text-sm text-gray-600">{user?.twitter || "-"}</p>
              </div>

              {/* Alamat */}
              <div>
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <MapPin size={16} />
                  <span>Alamat</span>
                </div>
                <p className="text-sm text-gray-600">{user?.address}</p>
                <p className="text-sm text-gray-600">{user?.zone_1}</p>
                <p className="text-sm text-gray-600">{user?.zone_2}</p>
                <p className="text-sm text-gray-600">
                  {user?.city}, {user?.province}, {user?.postcode}
                </p>
              </div>

              {/* Notes */}
              <div>
                <div className="flex items-center gap-2 font-semibold">
                  <FileText size={16} />
                  <span>Notes</span>
                </div>
                <p className="text-sm text-gray-600">
                  {user?.description || "Tidak ada deskripsi"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-2 shadow-sm bg-white rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-[#2A3042] text-white px-6 py-4 rounded-t-lg">
            <h2 className="text-lg font-semibold">Data Cabang</h2>
          </div>

          {/* Form Section */}
          <div className="">
            <BaseForm
              methods={methods}
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  name="name"
                  label="Nama"
                  placeholder="Masukkan nama cabang"
                />
                <FormInput
                  name="slug"
                  label="Slug"
                  placeholder="Masukkan slug unik"
                />
                <FormInput
                  name="company"
                  label="Nama Perusahaan"
                  placeholder="Masukkan nama perusahaan"
                />
                <FormInput
                  name="owner"
                  label="Pemilik"
                  placeholder="Masukkan nama pemilik"
                />
                <FormInput
                  name="email"
                  label="Email PIC"
                  type="email"
                  placeholder="Masukkan email PIC"
                />
                <FormInput
                  name="picName"
                  label="Nama PIC"
                  placeholder="Masukkan nama PIC"
                />
                <FormInput
                  name="picPosition"
                  label="Jabatan PIC"
                  placeholder="Masukkan jabatan PIC"
                />
                <FormInput
                  name="picPhone"
                  label="Telp PIC"
                  placeholder="Masukkan nomor telepon PIC"
                />

                <FormInput
                  name="address"
                  label="Alamat"
                  placeholder="Masukkan alamat lengkap cabang"
                />
                <FormInput
                  name="province"
                  label="Provinsi"
                  placeholder="Masukkan nama provinsi"
                />
                <FormInput
                  name="city"
                  label="Kota"
                  placeholder="Masukkan nama kota"
                />
                <FormInput
                  name="zone1"
                  label="Zona 1"
                  placeholder="Masukkan zona 1 (opsional)"
                />
                <FormInput
                  name="zone2"
                  label="Zona 2"
                  placeholder="Masukkan zona 2 (opsional)"
                />
                <FormInput
                  name="postcode"
                  label="Kode Pos"
                  placeholder="Masukkan kode pos"
                />

                <FormInput
                  name="phone"
                  label="Telepon"
                  placeholder="Masukkan nomor telepon cabang"
                />
                <FormInput
                  name="facebook"
                  label="Facebook"
                  placeholder="Masukkan URL halaman Facebook"
                />
                <FormInput
                  name="instagram"
                  label="Instagram"
                  placeholder="Masukkan username Instagram"
                />
                <FormInput
                  name="twitter"
                  label="Twitter"
                  placeholder="Masukkan username Twitter"
                />
                <FormInput
                  name="status"
                  label="Status"
                  placeholder="Contoh: Aktif / Nonaktif"
                />
              </div>

              <button
                type="submit"
                disabled={methods.formState.isSubmitting}
                className="btn mt-3 bg-[#00A65A] text-white hover:bg-[#00914e] transition"
              >
                {methods.formState.isSubmitting
                  ? "Menyimpan..."
                  : "Simpan Perubahan"}
              </button>
            </BaseForm>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
