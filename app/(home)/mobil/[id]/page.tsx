"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { createOrder } from "@/service/order-service";
import {
    Gauge, Settings2, Fuel, Palette, Hash, Car,
    ChevronLeft, ChevronRight, CheckCircle, MapPin, Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchMobilDetail(id: string) {
    const res = await fetch(`${BASE_URL}/mobil/${id}`);
    if (!res.ok) throw new Error("Gagal memuat data mobil");
    return res.json();
}

export default function MobilDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { isLoggedIn, user } = useAuth();

    const [activePhoto, setActivePhoto] = useState(0);
    const [orderOpen, setOrderOpen] = useState(false);
    const [metodePengambilan, setMetodePengambilan] = useState<"AMBIL_SENDIRI" | "DIANTAR">("AMBIL_SENDIRI");
    const [alamatKirim, setAlamatKirim] = useState("");
    const [agreed, setAgreed] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["mobil-detail", id],
        queryFn: () => fetchMobilDetail(id),
        enabled: !!id,
    });

    const mobil = data?.data || data;
    const fotos: any[] = mobil?.fotomobils || [];
    const sortedFotos = [
        ...fotos.filter((f: any) => f.isPrimary),
        ...fotos.filter((f: any) => !f.isPrimary),
    ];

    const displayFoto = sortedFotos[activePhoto]?.url
        ?? "https://images.unsplash.com/photo-1549317661-bc02c32e2a96?q=80&w=1200&auto=format&fit=crop";

    const prevPhoto = () => setActivePhoto((i) => (i - 1 + sortedFotos.length) % sortedFotos.length);
    const nextPhoto = () => setActivePhoto((i) => (i + 1) % sortedFotos.length);

    const harga = Number(mobil?.harga ?? 0);
    const dp = Math.round(harga * 0.3);
    const buktiPesanan = 500_000;

    const orderMutation = useMutation({
        mutationFn: () => createOrder({
            mobilId: id,
            metodePengambilan,
            alamatKirim: metodePengambilan === "DIANTAR" ? alamatKirim : undefined,
        }),
        onSuccess: (result) => {
            toast.success("Pesanan berhasil dibuat!");
            setOrderOpen(false);
            router.push(`/riwayat-order/${result.data.id}`);
        },
        onError: (e: any) => toast.error(e.message),
    });

    const handleCekSekarang = () => {
        if (!isLoggedIn) {
            router.push("/login?redirect=" + encodeURIComponent(`/mobil/${id}`));
            return;
        }
        if (user?.role !== "BUYER") {
            toast.error("Hanya Buyer yang bisa memesan mobil.");
            return;
        }
        setOrderOpen(true);
    };

    if (isLoading) return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="aspect-[4/3] rounded-2xl bg-gray-100 animate-pulse" />
                    <div className="grid grid-cols-4 gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="aspect-video rounded-xl bg-gray-100 animate-pulse" />
                        ))}
                    </div>
                </div>
                <div className="h-72 rounded-2xl bg-gray-100 animate-pulse" />
            </div>
        </div>
    );

    if (isError || !mobil) return (
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
            <Car className="h-12 w-12 mb-4 opacity-30" />
            <p>Mobil tidak ditemukan.</p>
            <Button asChild variant="outline" className="mt-4">
                <Link href="/">Kembali ke Beranda</Link>
            </Button>
        </div>
    );

    return (
        <div className="bg-[#F5F5F5] min-h-screen">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                    <Link href="/" className="hover:text-gray-800 transition-colors">Beranda</Link>
                    <span>/</span>
                    <span className="text-gray-800 font-medium truncate">{mobil.nama}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* ───── LEFT : Gallery + Spesifikasi ───── */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Main Photo */}
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 shadow-sm">
                            <img src={displayFoto} alt={mobil.nama} className="w-full h-full object-cover" />
                            {sortedFotos.length > 1 && (
                                <>
                                    <button onClick={prevPhoto} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-all">
                                        <ChevronLeft className="h-5 w-5 text-gray-700" />
                                    </button>
                                    <button onClick={nextPhoto} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-all">
                                        <ChevronRight className="h-5 w-5 text-gray-700" />
                                    </button>
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                        {sortedFotos.map((_, i) => (
                                            <button key={i} onClick={() => setActivePhoto(i)}
                                                className={`h-1.5 rounded-full transition-all ${i === activePhoto ? "w-5 bg-white" : "w-1.5 bg-white/60"}`} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {sortedFotos.length > 1 && (
                            <div className="grid grid-cols-4 gap-3">
                                {sortedFotos.slice(0, 4).map((f: any, i: number) => (
                                    <button key={f.id ?? i} onClick={() => setActivePhoto(i)}
                                        className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${i === activePhoto ? "border-[#3D3DE8] ring-2 ring-[#3D3DE8]/30" : "border-transparent hover:border-gray-300"}`}>
                                        <img src={f.url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Spesifikasi */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-5">Spesifikasi</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-5">
                                {[
                                    { icon: Gauge, label: "Kilometer", value: mobil.kilometer ? `${Number(mobil.kilometer).toLocaleString("id-ID")} km` : "-" },
                                    { icon: Palette, label: "Warna", value: mobil.warna ?? "-" },
                                    { icon: Fuel, label: "Bahan Bakar", value: mobil.bahan_bakar ?? "-" },
                                    { icon: Hash, label: "No Polisi", value: "Ganjil" },
                                    { icon: Settings2, label: "Transmisi", value: mobil.transmisi === "OTOMATIS" ? "Matic" : "Manual" },
                                    { icon: Car, label: "Tipe", value: mobil.model ?? "-" },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="flex flex-col gap-0.5">
                                        <span className="text-sm text-gray-500">{label}</span>
                                        <span className="font-semibold text-gray-900">{value}</span>
                                    </div>
                                ))}
                            </div>
                            {mobil.deskripsi && (
                                <div className="mt-6 pt-5 border-t border-gray-100">
                                    <h3 className="font-semibold text-gray-900 mb-2">Deskripsi</h3>
                                    <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{mobil.deskripsi}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ───── RIGHT : Sticky Info Card ───── */}
                    <div className="lg:sticky lg:top-24">
                        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 leading-tight">{mobil.merek} {mobil.model}</h1>
                                <p className="text-sm text-gray-500 mt-1">Tahun {mobil.tahun ?? "-"}</p>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                <span>{mobil.kilometer ? `${Number(mobil.kilometer).toLocaleString("id-ID")} KM` : "-"}</span>
                                <span className="text-gray-300">|</span>
                                <span>{mobil.transmisi === "OTOMATIS" ? "Matic" : "Manual"}</span>
                                <span className="text-gray-300">|</span>
                                <span>Ganjil</span>
                            </div>

                            <div>
                                <p className="text-2xl font-extrabold text-[#3D3DE8]">
                                    Rp {harga.toLocaleString("id-ID")}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    DP: Rp {dp.toLocaleString("id-ID")} · Bukti Pesanan: Rp 500.000
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-[#E31818] font-medium mb-2">*Syarat dan ketentuan :</p>
                                <ul className="flex flex-col gap-2">
                                    {[
                                        "Pembayaran DP 30% dari harga mobil dalam waktu 1 minggu setelah pemesanan",
                                        "Pembayaran Bukti Pesanan sebesar Rp500.000 pada saat proses pemesanan",
                                        "Data diri berupa upload Foto Copy KTP asli",
                                    ].map((s, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                            <span className="mt-0.5 shrink-0 h-4 w-4 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold">
                                                {i + 1}
                                            </span>
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Button
                                size="lg"
                                onClick={handleCekSekarang}
                                disabled={mobil.status !== "TERSEDIA"}
                                className="w-full bg-[#3D3DE8] hover:bg-[#3D3DE8]/90 text-white font-bold rounded-xl py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {mobil.status !== "TERSEDIA" ? "Mobil Sudah Terjual" : "Cek Sekarang"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ───── ORDER DIALOG ───── */}
            <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Pesanan</DialogTitle>
                        <DialogDescription>
                            {mobil.nama} — Rp {harga.toLocaleString("id-ID")}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-5 py-2">
                        {/* Ringkasan harga */}
                        <div className="rounded-xl bg-muted/60 p-4 flex flex-col gap-2 text-sm">
                            {[
                                ["Harga Mobil", `Rp ${harga.toLocaleString("id-ID")}`],
                                ["Bukti Pesanan (dibayar sekarang)", `Rp ${buktiPesanan.toLocaleString("id-ID")}`],
                                ["DP 30% (maks. 7 hari)", `Rp ${dp.toLocaleString("id-ID")}`],
                                ["Pelunasan", `Rp ${(harga - dp).toLocaleString("id-ID")}`],
                            ].map(([label, val]) => (
                                <div key={label} className="flex justify-between">
                                    <span className="text-muted-foreground">{label}</span>
                                    <span className="font-medium">{val}</span>
                                </div>
                            ))}
                        </div>

                        <Separator />

                        {/* Metode pengambilan */}
                        <div className="grid gap-2">
                            <Label>Metode Pengambilan</Label>
                            <Select value={metodePengambilan} onValueChange={(v) => setMetodePengambilan(v as any)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AMBIL_SENDIRI">
                                        <div className="flex items-center gap-2">
                                            <Home className="h-4 w-4" /> Ambil Sendiri
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="DIANTAR">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" /> Diantar
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {metodePengambilan === "DIANTAR" && (
                            <div className="grid gap-2">
                                <Label>Alamat Pengiriman</Label>
                                <textarea
                                    rows={3}
                                    placeholder="Tulis alamat lengkap pengiriman..."
                                    value={alamatKirim}
                                    onChange={(e) => setAlamatKirim(e.target.value)}
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                                />
                            </div>
                        )}

                        {/* Checkbox setuju S&K */}
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className={`mt-0.5 h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors ${agreed ? "bg-[#3D3DE8] border-[#3D3DE8]" : "border-gray-300 group-hover:border-[#3D3DE8]/50"}`}
                                onClick={() => setAgreed(!agreed)}>
                                {agreed && <CheckCircle className="h-3 w-3 text-white" />}
                            </div>
                            <span className="text-xs text-gray-600 leading-relaxed">
                                Saya menyetujui syarat dan ketentuan, termasuk kewajiban membayar Bukti Pesanan Rp 500.000 dan DP 30% dalam 7 hari.
                            </span>
                        </label>

                        <Button
                            onClick={() => orderMutation.mutate()}
                            disabled={orderMutation.isPending || !agreed || (metodePengambilan === "DIANTAR" && !alamatKirim.trim())}
                            className="w-full bg-[#3D3DE8] hover:bg-[#3D3DE8]/90 font-bold py-5"
                        >
                            {orderMutation.isPending ? "Memproses..." : "✓ Buat Pesanan Sekarang"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
