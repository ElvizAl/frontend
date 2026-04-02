"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getMobilById, updateMobil, addFotoMobil, deleteFotoMobil, setPrimaryFoto,
} from "@/service/admin-mobil-service";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, Trash2, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function EditMobilPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [newFotos, setNewFotos] = useState<File[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);

    const { data, isLoading } = useQuery({
        queryKey: ["admin-mobil-detail", id],
        queryFn: () => getMobilById(id),
        enabled: !!id,
    });

    const item = data?.data || data;

    const [form, setForm] = useState<Record<string, string>>({});
    const [initialized, setInitialized] = useState(false);

    if (item && !initialized) {
        setForm({
            nama: item.nama ?? "",
            merek: item.merek ?? "",
            model: item.model ?? "",
            tahun: item.tahun ? String(item.tahun) : "",
            warna: item.warna ?? "",
            kilometer: item.kilometer ?? "",
            bahan_bakar: item.bahan_bakar ?? "",
            transmisi: item.transmisi ?? "",
            harga: item.harga ? String(item.harga) : "",
            deskripsi: item.deskripsi ?? "",
            status: item.status ?? "TERSEDIA",
        });
        setInitialized(true);
    }

    const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [k]: e.target.value }));

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["admin-mobil-detail", id] });
        queryClient.invalidateQueries({ queryKey: ["admin-mobil"] });
    };

    const updateMutation = useMutation({
        mutationFn: () => updateMobil(id, {
            nama: form.nama, merek: form.merek, model: form.model,
            tahun: form.tahun ? Number(form.tahun) : undefined,
            warna: form.warna, kilometer: form.kilometer,
            bahan_bakar: form.bahan_bakar,
            transmisi: form.transmisi || undefined,
            harga: form.harga ? Number(form.harga) : undefined,
            status: form.status as any,
        }),
        onSuccess: () => { toast.success("Data mobil diperbarui"); invalidate(); router.push("/dashboard/data-mobil"); },
        onError: (e: any) => toast.error(e.message),
    });

    const addFotoMutation = useMutation({
        mutationFn: () => addFotoMobil(id, newFotos),
        onSuccess: () => {
            toast.success("Foto berhasil ditambahkan");
            setNewFotos([]); setNewPreviews([]);
            invalidate();
        },
        onError: (e: any) => toast.error(e.message),
    });

    const deleteFotoMutation = useMutation({
        mutationFn: (fotoId: string) => deleteFotoMobil(fotoId),
        onSuccess: () => { toast.success("Foto dihapus"); invalidate(); },
        onError: (e: any) => toast.error(e.message),
    });

    const setPrimaryMutation = useMutation({
        mutationFn: (fotoId: string) => setPrimaryFoto(fotoId),
        onSuccess: () => { toast.success("Foto utama diubah"); invalidate(); },
        onError: (e: any) => toast.error(e.message),
    });

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        setNewFotos((p) => [...p, ...files]);
        files.forEach((f) => setNewPreviews((p) => [...p, URL.createObjectURL(f)]));
        e.target.value = "";
    };

    const fotos: any[] = item?.foto || [];

    if (isLoading || !initialized) return (
        <div className="flex flex-col min-h-screen">
            <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger className="-ml-2" /><Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-semibold">Edit Mobil</h1>
            </header>
            <main className="flex-1 p-6 text-muted-foreground">Memuat...</main>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen">
            <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger className="-ml-2" />
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" size="sm" asChild className="gap-2">
                    <Link href="/dashboard/data-mobil"><ArrowLeft className="h-4 w-4" /> Kembali</Link>
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-semibold truncate">Edit: {item?.nama}</h1>
                <Badge variant="outline" className="ml-auto shrink-0">
                    {item?.status}
                </Badge>
            </header>

            <main className="flex-1 p-6 max-w-3xl w-full mx-auto flex flex-col gap-6">
                {/* Existing Fotos */}
                <Card>
                    <CardHeader><CardTitle className="text-base">Foto Saat Ini</CardTitle></CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {fotos.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Belum ada foto.</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {fotos.map((f: any) => (
                                    <div key={f.id} className={`relative aspect-video rounded-md overflow-hidden border-2 ${f.isPrimary ? "border-primary" : "border-transparent"}`}>
                                        <Image src={f.url} alt="" fill className="object-cover" sizes="150px" />
                                        <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                                            {!f.isPrimary && (
                                                <button
                                                    onClick={() => setPrimaryMutation.mutate(f.id)}
                                                    className="bg-yellow-500 text-white p-1.5 rounded-full"
                                                    title="Jadikan foto utama"
                                                >
                                                    <Star className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteFotoMutation.mutate(f.id)}
                                                className="bg-red-600 text-white p-1.5 rounded-full"
                                                title="Hapus foto"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                        {f.isPrimary && (
                                            <span className="absolute top-1 left-1 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">Utama</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add more fotos */}
                        <div className="flex flex-col gap-3">
                            {newPreviews.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {newPreviews.map((src, i) => (
                                        <div key={i} className="relative aspect-video rounded-md overflow-hidden border border-dashed border-primary">
                                            <img src={src} alt="" className="h-full w-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-primary hover:underline">
                                    <Upload className="h-4 w-4" /> Pilih foto baru
                                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleFotoChange} />
                                </label>
                                {newFotos.length > 0 && (
                                    <Button size="sm" onClick={() => addFotoMutation.mutate()} disabled={addFotoMutation.isPending}>
                                        {addFotoMutation.isPending ? "Mengupload..." : `Upload ${newFotos.length} Foto`}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Form */}
                <Card>
                    <CardHeader><CardTitle className="text-base">Informasi Mobil</CardTitle></CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(); }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            <div className="sm:col-span-2 grid gap-2">
                                <Label>Nama Mobil *</Label>
                                <Input value={form.nama} onChange={set("nama")} />
                            </div>
                            <div className="grid gap-2"><Label>Merek</Label><Input value={form.merek} onChange={set("merek")} /></div>
                            <div className="grid gap-2"><Label>Model</Label><Input value={form.model} onChange={set("model")} /></div>
                            <div className="grid gap-2"><Label>Tahun</Label><Input type="number" value={form.tahun} onChange={set("tahun")} /></div>
                            <div className="grid gap-2"><Label>Warna</Label><Input value={form.warna} onChange={set("warna")} /></div>
                            <div className="grid gap-2"><Label>Kilometer</Label><Input value={form.kilometer} onChange={set("kilometer")} /></div>
                            <div className="grid gap-2"><Label>Bahan Bakar</Label><Input value={form.bahan_bakar} onChange={set("bahan_bakar")} /></div>
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
                            <div className="grid gap-2"><Label>Harga (Rp) *</Label><Input type="number" value={form.harga} onChange={set("harga")} /></div>
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select
                                    value={form.status}
                                    onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
                                    disabled={item?.status === "TERJUAL"}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TERSEDIA">Tersedia</SelectItem>
                                        <SelectItem value="TERJUAL">Terjual</SelectItem>
                                    </SelectContent>
                                </Select>
                                {item?.status === "TERJUAL" && (
                                    <p className="text-xs text-muted-foreground">Mobil yang sudah terjual tidak dapat diubah menjadi tersedia</p>
                                )}
                            </div>
                            <div className="sm:col-span-2 grid gap-2">
                                <Label>Deskripsi</Label>
                                <Textarea rows={4} value={form.deskripsi} onChange={set("deskripsi")} />
                            </div>

                            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/dashboard/data-mobil">Batal</Link>
                                </Button>
                                <Button type="submit" disabled={updateMutation.isPending}>
                                    {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
