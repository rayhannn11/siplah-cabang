import { z } from "zod";
import { validEmail, requiredString } from "../lib/zod";

export const loginSchema = z.object({
  email: validEmail,
  password: requiredString("Password"),
});

export const profileSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  company: z.string().min(1, "Nama perusahaan wajib diisi"),
  owner: z.string().optional(),

  email: z.string().email("Email tidak valid"),
  picPosition: z.string().optional(),

  address: z.string().min(1, "Alamat wajib diisi"),
  province: z.string().min(1, "Provinsi wajib diisi"),
  city: z.string().min(1, "Kota wajib diisi"),
  zone1: z.string().optional(),
  zone2: z.string().optional(),
  postcode: z.string().regex(/^\d{5}$/, "Kode pos harus 5 digit"),

  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  status: z.string().min(1, "Status wajib diisi"),
});
