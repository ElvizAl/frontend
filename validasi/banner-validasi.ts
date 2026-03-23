import { z } from "zod";

export const bannerSchema = z.object({
  judul: z
    .string()
    .min(3, "Judul banner minimal 3 karakter")
    .max(100, "Judul terlalu panjang (maks. 100 karakter)"),
  // Disimpan sebagai string dari <input type="number">, dikonversi di service layer
  // (konsisten dengan pola project: lihat birthDate di profile-validasi.ts)
  urutan: z
    .string()
    .regex(/^\d+$/, "Urutan harus berupa angka"),
  isActive: z.enum(["true", "false"] as const),
});

export type BannerInput = z.infer<typeof bannerSchema>;
