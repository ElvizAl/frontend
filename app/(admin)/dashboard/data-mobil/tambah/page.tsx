"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createMobil } from "@/service/admin-mobil-service";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function TambahMobilPage() {
    const router = useRouter();
    const [fotos, setFotos] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [form, setForm] = useState({
        nama: "", merek: "", model: "", tahun: "",
        warna: "", kilometer: "", bahan_bakar: "", transmisi: "",
        harga: "", deskripsi: "", status: "TERSEDIA",
    });

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [k]: e.target.value }));

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        setFotos((prev) => [...prev, ...files]);
        files.forEach((f) => {
            const url = URL.createObjectURL(f);
            setPreviews((prev) => [...prev, url]);
        });
        e.target.value = "";
    };

    const removeFoto = (idx: number) => {
        URL.revokeObjectURL(previews[idx]);
        setFotos((prev) => prev.filter((_, i) => i !== idx));
        setPreviews((prev) => prev.filter((_, i) => i !== idx));
    };

    const mutation = useMutation({
        mutationFn: () => createMobil(
            {
                nama: form.nama, merek: form.merek, model: form.model,
                tahun: form.tahun, warna: form.warna, kilometer: form.kilometer,
                bahan_bakar: form.bahan_bakar, transmisi: form.transmisi || undefined,
                harga: form.harga, status: form.status,
            },
            fotos
        ),
        onSuccess: () => {
            toast.success("Mobil berhasil ditambahkan");
            router.push("/dashboard/data-mobil");
        },
        onError: (e: any) => toast.error(e.message),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.nama || !form.harga) return toast.error("Nama dan harga wajib diisi");
        mutation.mutate();
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger className="-ml-2" />
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" size="sm" asChild className="gap-2">
                    <Link href="/dashboard/data-mobil"><ArrowLeft className="h-4 w-4" /> Kembali</Link>
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-semibold">Tambah Mobil</h1>
            </header>

            <main className="flex-1 p-6 max-w-3xl w-full mx-auto">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Foto Upload */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Foto Mobil</CardTitle></CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {previews.map((src, i) => (
                                    <div key={i} className="relative aspect-video rounded-md overflow-hidden border">
                                        <img src={src} alt="" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeFoto(i)}
                                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                        {i === 0 && (
                                            <span className="absolute top-1 left-1 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                                                Utama
                                            </span>
                                        )}
                                    </div>
                                ))}
                                <label className="aspect-video rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/40 transition-colors">
                                    <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                                    <span className="text-xs text-muted-foreground">Tambah Foto</span>
                                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleFotoChange} />
                                </label>
                            </div>
                            <p className="text-xs text-muted-foreground">Foto pertama akan dijadikan foto utama.</p>
                        </CardContent>
                    </Card>

                    {/* Data Mobil */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Informasi Mobil</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2 grid gap-2">
                                <Label>Nama Mobil <span className="text-destructive">*</span></Label>
                                <Input placeholder="Contoh: Toyota Avanza 2020" value={form.nama} onChange={set("nama")} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Merek</Label>
                                <Input placeholder="Toyota" value={form.merek} onChange={set("merek")} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Model</Label>
                                <Input placeholder="Avanza" value={form.model} onChange={set("model")} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Tahun</Label>
                                <Input type="number" placeholder="2020" value={form.tahun} onChange={set("tahun")} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Warna</Label>
                                <Input placeholder="Putih" value={form.warna} onChange={set("warna")} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Kilometer</Label>
                                <Input placeholder="50000" value={form.kilometer} onChange={set("kilometer")} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Bahan Bakar</Label>
                                <Input placeholder="Bensin / Solar / Hybrid" value={form.bahan_bakar} onChange={set("bahan_bakar")} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Transmisi</Label>
                                <Select value={form.transmisi} onValueChange={(v) => setForm((f) => ({ ...f, transmisi: v }))}>
                                    <SelectTrigger><SelectValue placeholder="Pilih transmisi" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MANUAL">Manual</SelectItem>
                                        <SelectItem value="OTOMATIS">Otomatis</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Harga (Rp) <span className="text-destructive">*</span></Label>
                                <Input type="number" placeholder="150000000" value={form.harga} onChange={set("harga")} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TERSEDIA">Tersedia</SelectItem>
                                        <SelectItem value="TERJUAL">Terjual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="sm:col-span-2 grid gap-2">
                                <Label>Deskripsi</Label>
                                <Textarea
                                    placeholder="Kondisi mobil, kelengkapan dokumen, dll..."
                                    rows={4}
                                    value={form.deskripsi}
                                    onChange={set("deskripsi")}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/dashboard/data-mobil">Batal</Link>
                        </Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? "Menyimpan..." : "Simpan Mobil"}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
