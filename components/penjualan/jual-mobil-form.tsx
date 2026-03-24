"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Car,
  Loader2,
  Upload,
  X,
  ChevronRight,
  Fuel,
  Gauge,
  Palette,
  CalendarDays,
  AlignLeft,
  Tag,
  CheckCircle2,
  Camera,
  Info,
} from "lucide-react";
import { jualMobilSchema, JualMobilInput } from "@/validasi/penjualan-validasi";
import { createMobilSeller } from "@/service/penjualan-service";

/* ─── helpers ─── */
const fieldCls = (err?: boolean) =>
  `w-full rounded-lg border px-4 py-2.5 text-sm bg-white outline-none
   transition focus:ring-2 focus:ring-[#4B3BFB]/30 focus:border-[#4B3BFB]
   disabled:bg-gray-50 disabled:opacity-60
   ${err ? "border-red-400 bg-red-50" : "border-gray-200"}`;

const SectionCard = ({
  step,
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  step: number;
  title: string;
  subtitle?: string;
  icon: any;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4B3BFB] text-white text-xs font-bold shrink-0">
        {step}
      </div>
      <Icon size={16} className="text-[#4B3BFB] shrink-0" />
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

export default function JualMobilForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [primaryIdx, setPrimaryIdx] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JualMobilInput>({
    resolver: zodResolver(jualMobilSchema),
    defaultValues: {
      nama: "",
      merek: "",
      model: "",
      warna: "",
      kilometer: "",
      bahan_bakar: "",
      deskripsi: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ data, files }: { data: JualMobilInput; files: File[] }) => {
      // put primary first
      const ordered = [...files];
      if (primaryIdx > 0 && ordered.length > 1) {
        const [p] = ordered.splice(primaryIdx, 1);
        ordered.unshift(p);
      }
      const stringData: Record<string, string | undefined> = {
        nama: data.nama,
        merek: data.merek,
        model: data.model,
        tahun: data.tahun,
        warna: data.warna,
        kilometer: data.kilometer,
        bahan_bakar: data.bahan_bakar,
        transmisi: data.transmisi,
        deskripsi: data.deskripsi,
      };
      return createMobilSeller(stringData, ordered);
    },
    onSuccess: () => {
      toast.success("Mobil berhasil diajukan! Menunggu evaluasi admin.");
      router.push("/seller/daftar-mobil");
    },
    onError: (err: any) => toast.error(err.message || "Gagal mengajukan mobil"),
  });

  const onSubmit = (data: JualMobilInput) =>
    mutate({ data, files: previews.map((p) => p.file) });

  const addFiles = (files: File[]) => {
    const imgs = files.filter((f) => f.type.startsWith("image/"));
    const newItems = imgs.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setPreviews((prev) => [...prev, ...newItems].slice(0, 10));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImg = (idx: number) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      const next = prev.filter((_, i) => i !== idx);
      if (primaryIdx >= next.length) setPrimaryIdx(Math.max(0, next.length - 1));
      return next;
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ─── LEFT: FORM ─── */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 min-w-0 space-y-5"
          >

            {/* FOTO */}
            <SectionCard step={1} title="Foto Kendaraan" subtitle="Tambah hingga 10 foto" icon={Camera}>
              {/* Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => previews.length < 10 && fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-10 cursor-pointer transition-all select-none
                  ${dragOver ? "border-[#4B3BFB] bg-[#4B3BFB]/8" : "border-gray-200 hover:border-[#4B3BFB]/60 hover:bg-[#4B3BFB]/5"}
                  ${previews.length >= 10 ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4B3BFB]/10">
                  <Upload size={22} className="text-[#4B3BFB]" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {dragOver ? "Lepaskan untuk upload" : "Klik atau seret foto ke sini"}
                </p>
                <p className="text-xs text-gray-400">JPG, PNG, WEBP • Maks. 10 foto • {previews.length}/10 ditambahkan</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => addFiles(Array.from(e.target.files || []))}
              />

              {/* Grid Preview */}
              {previews.length > 0 && (
                <div className="mt-4 grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {previews.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setPrimaryIdx(idx)}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ring-2 transition-all
                        ${idx === primaryIdx ? "ring-[#4B3BFB] scale-[1.03]" : "ring-transparent hover:ring-[#4B3BFB]/40"}`}
                    >
                      <img src={img.url} alt="" className="h-full w-full object-cover" />
                      {idx === primaryIdx && (
                        <div className="absolute inset-0 bg-[#4B3BFB]/20 flex items-center justify-center">
                          <CheckCircle2 size={20} className="text-white drop-shadow" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeImg(idx); }}
                        className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/55 text-white opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                      {idx === primaryIdx && (
                        <span className="absolute bottom-0 inset-x-0 bg-[#4B3BFB] text-white text-[9px] text-center py-0.5 font-bold tracking-wide">
                          UTAMA
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {previews.length > 0 && (
                <p className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                  <Info size={11} /> Klik foto untuk menetapkan sebagai foto utama
                </p>
              )}
            </SectionCard>

            {/* INFO KENDARAAN */}
            <SectionCard step={2} title="Informasi Kendaraan" subtitle="Isi detail kendaraan Anda" icon={Car}>
              <div className="space-y-4">

                {/* Judul */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Judul Iklan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Toyota Avanza 2022 — Terawat, KM Rendah"
                    disabled={isPending}
                    {...register("nama")}
                    className={fieldCls(!!errors.nama)}
                  />
                  {errors.nama && <p className="mt-1 text-xs text-red-500">{errors.nama.message}</p>}
                  <p className="mt-1 text-xs text-gray-400">Judul yang menarik meningkatkan peluang terjual</p>
                </div>

                {/* Merek & Model */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Merek</label>
                    <select disabled={isPending} {...register("merek")} className={fieldCls()}>
                      <option value="">Pilih merek</option>
                      {["Toyota", "Honda", "Suzuki", "Daihatsu", "Mitsubishi", "Nissan", "Hyundai", "Wuling", "BMW", "Mercedes-Benz", "Mazda", "Kia", "Isuzu", "Ford", "Chevrolet"].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Model</label>
                    <input type="text" placeholder="Avanza, Civic, Jazz..." disabled={isPending} {...register("model")} className={fieldCls()} />
                  </div>
                </div>

                {/* Tahun & Warna */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      <CalendarDays size={11} className="inline mr-1" />Tahun
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="2022"
                      disabled={isPending}
                      {...register("tahun")}
                      className={fieldCls(!!errors.tahun)}
                    />
                    {errors.tahun && <p className="mt-1 text-xs text-red-500">{errors.tahun.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      <Palette size={11} className="inline mr-1" />Warna
                    </label>
                    <input type="text" placeholder="Putih, Hitam, Silver..." disabled={isPending} {...register("warna")} className={fieldCls()} />
                  </div>
                </div>

                {/* Kilometer & Bahan Bakar */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      <Gauge size={11} className="inline mr-1" />Odometer (km)
                    </label>
                    <div className="relative">
                      <input type="text" inputMode="numeric" placeholder="45000" disabled={isPending} {...register("kilometer")} className={fieldCls() + " pr-10"} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">km</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      <Fuel size={11} className="inline mr-1" />Bahan Bakar
                    </label>
                    <select disabled={isPending} {...register("bahan_bakar")} className={fieldCls()}>
                      <option value="">Pilih</option>
                      <option value="Bensin">Bensin</option>
                      <option value="Solar">Solar</option>
                      <option value="Listrik">Listrik</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Gas">Gas (LPG/CNG)</option>
                    </select>
                  </div>
                </div>

                {/* Transmisi */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Transmisi</label>
                  <div className="flex gap-3">
                    {(["MANUAL", "OTOMATIS"] as const).map((val) => (
                      <label
                        key={val}
                        className="flex flex-1 cursor-pointer items-center gap-3 rounded-xl border bg-gray-50/80 px-4 py-3 transition-all has-[:checked]:border-[#4B3BFB] has-[:checked]:bg-[#4B3BFB]/5 has-[:checked]:shadow-sm border-gray-200"
                      >
                        <input type="radio" value={val} disabled={isPending} {...register("transmisi")} className="accent-[#4B3BFB]" />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{val === "MANUAL" ? "Manual" : "Otomatis"}</p>
                          <p className="text-[10px] text-gray-400">{val === "MANUAL" ? "Kopling manual" : "CVT / Automatic"}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* DESKRIPSI */}
            <SectionCard step={3} title="Deskripsi" subtitle="Ceritakan kondisi kendaraan" icon={AlignLeft}>
              <textarea
                rows={6}
                disabled={isPending}
                {...register("deskripsi")}
                placeholder={`Contoh:\n• Kondisi mesin prima, servis rutin di bengkel resmi\n• Surat-surat lengkap (STNK, BPKB asli)\n• Ban baru ganti 2024\n• AC dingin, audio original`}
                className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#4B3BFB]/30 focus:border-[#4B3BFB] disabled:bg-gray-50"
              />
              <p className="mt-1.5 text-xs text-gray-400">Deskripsi detail meningkatkan kepercayaan pembeli</p>
            </SectionCard>

            {/* SUBMIT (mobile only) */}
            <div className="flex gap-3 lg:hidden">
              <button type="button" onClick={() => router.back()} disabled={isPending}
                className="flex-1 h-12 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60">
                Batal
              </button>
              <button type="submit" disabled={isPending}
                className="flex-[2] flex items-center justify-center gap-2 h-12 rounded-xl bg-[#4B3BFB] text-sm font-semibold text-white shadow-md transition hover:bg-[#3B29E3] disabled:opacity-70">
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {isPending ? "Mengajukan..." : "Ajukan Mobil"}
              </button>
            </div>

          </form>

          {/* ─── RIGHT: STICKY SIDEBAR ─── */}
          <aside className="hidden lg:flex flex-col gap-4 w-72 shrink-0 sticky top-20">

            {/* Harga info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={15} className="text-[#4B3BFB]" />
                <p className="text-sm font-semibold text-gray-900">Penetapan Harga</p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Harga akhir akan ditentukan oleh tim admin setelah evaluasi kondisi kendaraan Anda.
              </p>
              <div className="mt-3 rounded-xl bg-[#4B3BFB]/5 border border-[#4B3BFB]/15 px-4 py-3">
                <p className="text-xs font-semibold text-[#4B3BFB] mb-1">Alur Penjualan</p>
                {["Ajukan data kendaraan", "Evaluasi oleh tim admin", "Penawaran harga dikirim", "Konfirmasi & pembayaran"].map((s, i) => (
                  <div key={i} className="flex items-start gap-2 mt-1.5">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#4B3BFB] text-white text-[9px] font-bold">{i + 1}</span>
                    <p className="text-xs text-gray-600">{s}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-800 mb-2">💡 Tips Cepat Terjual</p>
              <ul className="space-y-1.5 text-xs text-amber-700">
                <li className="flex gap-1.5"><CheckCircle2 size={12} className="mt-0.5 shrink-0 text-amber-500" />Unggah minimal 5 foto dari berbagai sudut</li>
                <li className="flex gap-1.5"><CheckCircle2 size={12} className="mt-0.5 shrink-0 text-amber-500" />Foto di area terang dan latar bersih</li>
                <li className="flex gap-1.5"><CheckCircle2 size={12} className="mt-0.5 shrink-0 text-amber-500" />Isi semua detail secara lengkap</li>
                <li className="flex gap-1.5"><CheckCircle2 size={12} className="mt-0.5 shrink-0 text-amber-500" />Tuliskan kondisi mesin &amp; surat‑surat</li>
              </ul>
            </div>

            {/* CTA */}
            <button
              form="jual-form"
              type="submit"
              disabled={isPending}
              onClick={handleSubmit(onSubmit)}
              className="flex w-full items-center justify-center gap-2 h-12 rounded-xl bg-[#4B3BFB] text-sm font-semibold text-white shadow-md transition hover:bg-[#3B29E3] disabled:opacity-70"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? "Mengajukan..." : "Ajukan Kendaraan"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isPending}
              className="w-full h-10 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Batal
            </button>
          </aside>

        </div>
      </div>
    </div>
  );
}
