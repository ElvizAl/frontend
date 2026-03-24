"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMobilById, deleteFotoMobil, setPrimaryFoto, addFotoMobil } from "@/service/admin-mobil-service";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
    ArrowLeft, Pencil, Star, Trash2, Upload, Car,
    Gauge, Palette, Fuel, Settings2,
} from "lucide-react";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
    TERSEDIA: "bg-green-100 text-green-700 border-green-300",
    TERJUAL: "bg-zinc-100 text-zinc-500 border-zinc-300",
    DRAFT: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

export default function AdminDataMobilDetailPage() {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const [uploading, setUploading] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["admin-mobil-detail", id],
        queryFn: () => getMobilById(id),
        enabled: !!id,
    });

    const mobil = data?.data || data;
    const fotos: any[] = mobil?.fotomobils || [];

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-mobil-detail", id] });

    const setPrimaryMutation = useMutation({
        mutationFn: (fotoId: string) => setPrimaryFoto(fotoId),
        onSuccess: () => { toast.success("Foto utama diubah"); invalidate(); },
        onError: (e: any) => toast.error(e.message),
    });

    const deleteFotoMutation = useMutation({
        mutationFn: (fotoId: string) => deleteFotoMobil(fotoId),
        onSuccess: () => { toast.success("Foto dihapus"); invalidate(); },
        onError: (e: any) => toast.error(e.message),
    });

    const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploading(true);
        try {
            await addFotoMobil(id, Array.from(files));
            toast.success("Foto berhasil diupload");
            invalidate();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    if (isLoading || !mobil) return (
        <div className="flex flex-col min-h-screen">
            <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger className="-ml-2" /><Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-semibold">Detail Mobil</h1>
            </header>
            <main className="flex-1 p-6 text-muted-foreground">Memuat...</main>
        </div>
    );

    const primaryFoto = fotos.find(f => f.isPrimary) ?? fotos[0];

    return (
        <div className="flex flex-col min-h-screen">
            <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger className="-ml-2" />
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" size="sm" asChild className="gap-2">
                    <Link href="/dashboard/data-mobil"><ArrowLeft className="h-4 w-4" /> Kembali</Link>
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-semibold truncate">{mobil.nama}</h1>
                <div className="ml-auto flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${STATUS_COLORS[mobil.status] ?? ""}`}>{mobil.status}</Badge>
                    <Button asChild size="sm" variant="outline" className="gap-2">
                        <Link href={`/dashboard/data-mobil/${id}/edit`}><Pencil className="h-4 w-4" /> Edit</Link>
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-6 max-w-5xl mx-auto w-full flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Foto Utama */}
                    <div>
                        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                            <img
                                src={primaryFoto?.url ?? "https://images.unsplash.com/photo-1549317661-bc02c32e2a96?q=80&w=800&auto=format&fit=crop"}
                                alt={mobil.nama}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Galeri thumbnails */}
                        {fotos.length > 1 && (
                            <div className="grid grid-cols-5 gap-2 mt-2">
                                {fotos.map((f: any) => (
                                    <div key={f.id} className={`relative aspect-square rounded-md overflow-hidden group border-2 ${f.isPrimary ? "border-primary" : "border-transparent"}`}>
                                        <img src={f.url} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                            {!f.isPrimary && (
                                                <button
                                                    onClick={() => setPrimaryMutation.mutate(f.id)}
                                                    className="p-1 rounded bg-yellow-400 hover:bg-yellow-500 text-white"
                                                    title="Jadikan utama"
                                                >
                                                    <Star className="h-3 w-3" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteFotoMutation.mutate(f.id)}
                                                className="p-1 rounded bg-red-500 hover:bg-red-600 text-white"
                                                title="Hapus foto"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                        {f.isPrimary && (
                                            <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[9px] px-1 rounded font-bold">UTAMA</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Upload foto */}
                        <label className="mt-3 flex items-center gap-2 cursor-pointer text-sm text-primary hover:underline w-fit">
                            <Upload className="h-4 w-4" />
                            {uploading ? "Mengupload..." : "Upload Foto Baru"}
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleUploadFoto} disabled={uploading} />
                        </label>
                    </div>

                    {/* Info & Spesifikasi */}
                    <div className="flex flex-col gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm text-muted-foreground">Informasi Umum</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-y-4 text-sm">
                                {[
                                    { label: "Merek", value: mobil.merek ?? "-" },
                                    { label: "Model", value: mobil.model ?? "-" },
                                    { label: "Tahun", value: mobil.tahun ?? "-" },
                                    { label: "Warna", value: mobil.warna ?? "-" },
                                    { label: "Bahan Bakar", value: mobil.bahan_bakar ?? "-" },
                                    { label: "Transmisi", value: mobil.transmisi === "OTOMATIS" ? "Matic" : mobil.transmisi === "MANUAL" ? "Manual" : "-" },
                                    { label: "Kilometer", value: mobil.kilometer ? `${Number(mobil.kilometer).toLocaleString("id-ID")} km` : "-" },
                                    { label: "Harga", value: `Rp ${Number(mobil.harga).toLocaleString("id-ID")}` },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <p className="text-muted-foreground text-xs">{label}</p>
                                        <p className="font-semibold">{value}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {mobil.deskripsi && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm text-muted-foreground">Deskripsi</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{mobil.deskripsi}</p>
                                </CardContent>
                            </Card>
                        )}

                        {mobil.seller && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm text-muted-foreground">Seller</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm">
                                    <p className="font-semibold">{mobil.seller.name}</p>
                                    <p className="text-muted-foreground">{mobil.seller.email}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
