import Swal from "sweetalert2";

/**
 * SweetAlert - Sukses
 * @param {string} message
 */
export const alertSuccess = (message = "Berhasil diproses") => {
  Swal.fire({
    icon: "success",
    title: "Berhasil",
    text: message,
    confirmButtonColor: "#3085d6",
    timer: 2000,
    showConfirmButton: false,
  });
};

/**
 * SweetAlert - Gagal
 * @param {string} message
 */
export const alertError = (message = "Terjadi kesalahan") => {
  Swal.fire({
    icon: "error",
    title: "Oops!",
    text: message,
    confirmButtonColor: "#d33",
  });
};

/**
 * SweetAlert - Konfirmasi
 * @param {string} message
 * @returns {Promise<boolean>}
 */
export const confirmDelete = async (nama = "item") => {
  const result = await Swal.fire({
    title: "Yakin ingin menghapus?",
    text: `Produk "${nama}" akan dihapus secara permanen.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus",
    cancelButtonText: "Batal",
  });

  return result.isConfirmed;
};
