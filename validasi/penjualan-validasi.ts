import { z } from "zod";

export const jualMobilSchema = z.object({
  nama: z.string().min(1, "Nama mobil wajib diisi"),
  merek: z.string().optional(),
  model: z.string().optional(),
  tahun: z
    .string()
    .optional()
    .refine(
      (val) => !val || (/^\d{4}$/.test(val) && +val >= 1900 && +val <= 2100),
      { message: "Tahun tidak valid (1900–2100)" }
    ),
  warna: z.string().optional(),
  kilometer: z.string().optional(),
  bahan_bakar: z.string().optional(),
  transmisi: z.enum(["MANUAL", "OTOMATIS"]).optional(),
  deskripsi: z.string().optional(),
});

export type JualMobilInput = z.infer<typeof jualMobilSchema>;
// tahun is kept as string to avoid zodResolver coerce/unknown type issues
