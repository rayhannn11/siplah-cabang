// utils/zodHelpers.js
import { z } from "zod";

// ✅ Hanya huruf (huruf besar, kecil, dan spasi)
export const onlyLetters = z
  .string()
  .regex(/^[A-Za-z\s]+$/, {
    message: "Hanya huruf yang diperbolehkan",
  })
  .min(1, "Field ini wajib diisi");

// ✅ Hanya angka (tanpa koma/titik)
export const onlyNumbers = z
  .string()
  .regex(/^\d+$/, {
    message: "Hanya angka yang diperbolehkan",
  })
  .min(1, "Field ini wajib diisi");

// ✅ Nomor telepon Indonesia (format dasar)
export const phoneNumber = z.string().regex(/^08\d{8,11}$/, {
  message: "Nomor telepon tidak valid (contoh: 08xxxxxxxxxx)",
});

// ✅ Email valid
export const validEmail = z.string().email("Email tidak valid");

// ✅ URL valid
export const validURL = z.string().url("URL tidak valid");

// ✅ Field required (dengan label custom)
export const requiredString = (label = "Field ini") =>
  z.string().min(1, `${label} wajib diisi`).trim();

// ✅ Harga / Angka desimal
export const validCurrency = (label = "Harga") =>
  z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, `${label} harus berupa angka yang valid`);

// ✅ Validasi Select (wajib dipilih, tidak boleh kosong atau null)
export const requiredSelect = (label = "Opsi") =>
  z.string().min(1, `${label} wajib dipilih`);

// ✅ Validasi angka minimum (misal qty)
export const requiredPositiveNumber = (label = "Jumlah") =>
  z
    .number({ invalid_type_error: `${label} harus berupa angka` })
    .min(1, `${label} minimal 1`);

// ✅ Validasi checkbox wajib dicentang (boolean true)
export const requiredCheckbox = (label = "Setuju") =>
  z.literal(true, {
    errorMap: () => ({ message: `Anda harus menyetujui ${label}` }),
  });

// ✅ Validasi radio button (string dari pilihan)
export const requiredRadio = (label = "Pilihan") =>
  z.string().min(1, `${label} wajib dipilih`);
