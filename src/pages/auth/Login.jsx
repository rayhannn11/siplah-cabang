import useZodForm from "../../hooks/useZodForms";
import { loginSchema } from "../../lib/schema";
import useResponsive from "../../hooks/useResponsive";
import { useAuthStore } from "../../stores";
import BaseForm from "../../components/form/base-form";
import FormInput from "../../components/form/form-input";
import axios from "../../lib/axios";

import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// import FormCheckbox from "../../components/form/FormCheckbox";

const Login = () => {
  const methods = useZodForm(loginSchema);
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { setToken, setUser } = useAuthStore();

  const isSubmitting = methods?.formState?.isSubmitting || false;

  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      // Cek inputan kosong
      if (!values.email || !values.password) {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Email dan password wajib diisi!",
        });
        return;
      }

      // 1. Request ke API login
      const { data } = await axios.post(`auth/login`, {
        email: values.email,
        password: values.password,
      });

      if (data?.status?.code === 200) {
        const token = data.data.token;
        setToken(token); // simpan token dulu

        try {
          // 2. Fetch profile pakai token
          const profileRes = await axios.get(`auth/profile`);

          if (profileRes.data?.status?.code === 200) {
            setUser(profileRes.data.data.cabang); // ambil dari profile

            // Swal.fire({
            //   toast: true,
            //   position: "top-end",
            //   icon: "success",
            //   title: "Login berhasil",
            //   text: "Selamat datang kembali!",
            //   showConfirmButton: false,
            //   timer: 2000,
            //   timerProgressBar: true,
            //   allowOutsideClick: false, // ⬅️ penting
            //   allowEscapeKey: false, // ⬅️ biar overlay tidak ngeblok
            //   didOpen: (toast) => {
            //     toast.style.zIndex = 99999; // pastiin toast di atas tourGuide
            //   },
            // });

            // 3. Redirect
            navigate("/cabang/dashboard");
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal Ambil Profile",
              text:
                profileRes.data?.status?.message || "Profile tidak ditemukan.",
            });
          }
        } catch (profileErr) {
          Swal.fire({
            icon: "error",
            title: "Error Profile",
            text:
              profileErr.response?.data?.message ||
              "Gagal mengambil data profile dari server.",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Login gagal",
          text: data?.status?.message || "Terjadi kesalahan.",
        });
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Gagal Login",
          text: error.response.data?.message || "Terjadi kesalahan validasi.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Koneksi Error",
          text: "Tidak dapat terhubung ke server. Coba lagi nanti.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-base-200">
      {/* Wrapper */}
      <div className="flex w-full mx-auto shadow-xl rounded-2xl overflow-hidden">
        {/* Left Image (60%) */}
        <div className="hidden md:flex w-[55%] bg-[#0a1f3c] items-center justify-center">
          <img
            src={`${import.meta.env.BASE_URL}/images/login3.jpg`}
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form (40%) */}
        <div className="w-full md:w-[45%] flex flex-col justify-center px-10 py-8 bg-[#ffffff]">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-primary">SIPLah</h2>
            <p className="text-xl font-semibold dark:text-black">
              (Sistem Informasi Pengadaan Sekolah)
            </p>
          </div>

          {/* Form */}
          <h3 className="text-center text-[22px] font-bold my-8 mb-2">
            Login rekananKU
          </h3>
          <BaseForm
            methods={methods}
            onSubmit={methods.handleSubmit(onSubmit)}
            transparant
          >
            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="Email"
              icon={Mail}
              className="mb-2"
            />

            <FormInput
              name="password"
              label="Password"
              type="password"
              placeholder="Password"
              icon={Lock}
              className="mb-4"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full text-base font-semibold tracking-wide mt-4"
            >
              {isSubmitting ? "Memproses..." : "LOGIN"}
            </button>
          </BaseForm>

          {/* Bottom Logo */}
          <div className="mt-8 flex justify-center">
            <img
              src="https://siplah.eurekabookhouse.co.id/internal/assets/image/kemdikbud_anim.gif"
              alt="Kemdikbud Logo"
              className="h-10 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
