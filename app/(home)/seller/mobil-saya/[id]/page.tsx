"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Car, Image as ImageIcon, Gavel, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

import Cookies from "js-cookie";

const getAuthHeaders = (): Record<string, string> => {
    const token = Cookies.get("auth_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

async function getMyMobilById(id: string) {
    const res = await fetch(`${BASE_URL}/penjualan/my/${id}`, {
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Gagal mengambil data");
    return result;
}

async function responPenawaran(id: string, data: { 
    respon: "DISETUJUI" | "DITOLAK"; 
    catatanSeller?: string; 
    metode?: "TUNAI" | "TRANSFER";
    noRekeningSeller?: string;
    namaRekeningSeller?: string;
    bankSeller?: string;
}) {
    const res = await fetch(`${BASE_URL}/penjualan/${id}/respon`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Gagal merespons penawaran");
    return result;
}

const STATUS_BADGE: Record<string, { label: string; className: string; desc: string }> = {
    DRAFT: { label: "Draft", className: "bg-zinc-100 text-zinc-600 border-zinc-300", desc: "Pengajuan belum disubmit. Klik submit untuk mengirim ke admin." },
    MENUNGGU_EVALUASI: { label: "Menunggu Evaluasi", className: "bg-yellow-100 text-yellow-700 border-yellow-300", desc: "Pengajuan sedang menunggu giliran ditinjau oleh admin." },
    SEDANG_DIEVALUASI: { label: "Sedang Dievaluasi", className: "bg-blue-100 text-blue-700 border-blue-300", desc: "Admin sedang mengevaluasi kondisi dan harga mobilmu." },
    DITAWARKAN: { label: "Ada Penawaran Harga 🎉", className: "bg-purple-100 text-purple-700 border-purple-300", desc: "Admin telah memberikan penawaran harga. Segera respons di bawah." },
    DISETUJUI: { label: "Disetujui ✓", className: "bg-green-100 text-green-700 border-green-300", desc: "Penawaran disetujui. Tunggu konfirmasi pembayaran dari admin." },
    DITOLAK: { label: "Ditolak", className: "bg-red-100 text-red-700 border-red-300", desc: "Pengajuan tidak memenuhi syarat. Kamu bisa menghapus dan membuat pengajuan baru." },
    TERSEDIA: { label: "Tersedia di Marketplace ✓", className: "bg-emerald-100 text-emerald-700 border-emerald-300", desc: "Mobilmu sudah tersedia di marketplace dan pembayaran telah dikonfirmasi." },
};

export default function MobilSayaDetailPage() {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    const [respon, setRespon] = useState<"DISETUJUI" | "DITOLAK">("DISETUJUI");
    const [catatanSeller, setCatatanSeller] = useState("");
    const [metode, setMetode] = useState<"TUNAI" | "TRANSFER">("TUNAI");
    const [noRekeningSeller, setNoRekeningSeller] = useState("");
    const [namaRekeningSeller, setNamaRekeningSeller] = useState("");
    const [bankSeller, setBankSeller] = useState("");
    const [showResponForm, setShowResponForm] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["my-mobil-detail", id],
        queryFn: () => getMyMobilById(id),
        enabled: !!id,
    });

    const item = data?.data || data;

    const responMutation = useMutation({
        mutationFn: () => responPenawaran(id, {
            respon,
            catatanSeller: catatanSeller || undefined,
            metode: respon === "DISETUJUI" ? metode : undefined,
            noRekeningSeller: respon === "DISETUJUI" && metode === "TRANSFER" ? noRekeningSeller : undefined,
            namaRekeningSeller: respon === "DISETUJUI" && metode === "TRANSFER" ? namaRekeningSeller : undefined,
            bankSeller: respon === "DISETUJUI" && metode === "TRANSFER" ? bankSeller : undefined,
        }),
        onSuccess: () => {
            toast.success(respon === "DISETUJUI" ? "Penawaran disetujui!" : "Penawaran ditolak.");
            queryClient.invalidateQueries({ queryKey: ["my-mobil-detail", id] });
            queryClient.invalidateQueries({ queryKey: ["my-mobil"] });
            setShowResponForm(false);
        },
        onError: (e: any) => toast.error(e.message),
    });

    if (isLoading) return (
        <div className="max-w-4xl mx-auto px-4 py-10 text-muted-foreground">Memuat data...</div>
    );

    if (isError || !item) return (
        <div className="max-w-4xl mx-auto px-4 py-10 text-destructive">Data tidak ditemukan.</div>
    );

    const badge = STATUS_BADGE[item.status] || { label: item.status, className: "", desc: "" };
    const fotos: any[] = item.fotomobils || [];
    const penawaran = item.penawaran ?? null; // object tunggal, bukan array

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            {/* Back */}
            <div className="mb-6">
                <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2">
                    <Link href="/seller/mobil-saya"><ArrowLeft className="h-4 w-4" /> Kembali</Link>
                </Button>
            </div>

            {/* Title + Status */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-8">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">{item.nama}</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {[item.merek, item.model, item.tahun].filter(Boolean).join(" · ")}
                    </p>
                </div>
                <Badge variant="outline" className={`text-sm px-3 py-1 shrink-0 ${badge.className}`}>
                    {badge.label}
                </Badge>
            </div>

            {/* Status Info */}
            {badge.desc && (
                <div className="flex gap-3 p-4 rounded-lg bg-muted/60 border mb-6 text-sm">
                    <Info className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <p className="text-muted-foreground">{badge.desc}</p>
                </div>
            )}

            {/* Penawaran Aktif — tombol respons */}
            {item.status === "DITAWARKAN" && penawaran && (
                <Card className="mb-6 border-purple-200 bg-purple-50/50">
                    <CardHeader className="flex-row items-center gap-2 pb-3">
                        <Gavel className="h-4 w-4 text-purple-600" />
                        <CardTitle className="text-base text-purple-700">Penawaran dari Admin</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div>
                            <p className="text-2xl font-bold text-purple-700">
                                Rp {Number(penawaran.hargaTawar).toLocaleString("id-ID")}
                            </p>
                            {penawaran.catatanAdmin && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    Catatan admin: {penawaran.catatanAdmin}
                                </p>
                            )}
                        </div>

                        {!showResponForm ? (
                            <Button onClick={() => setShowResponForm(true)} className="w-full sm:w-auto">
                                Respons Penawaran
                            </Button>
                        ) : (
                            <div className="flex flex-col gap-4 border rounded-lg p-4 bg-background">
                                <div className="grid gap-2">
                                    <Label>Respon Penawaran</Label>
                                    <Select value={respon} onValueChange={(v) => setRespon(v as any)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DISETUJUI">✓ Setuju dengan penawaran ini</SelectItem>
                                            <SelectItem value="DITOLAK">✗ Tolak penawaran ini</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {respon === "DISETUJUI" && (
                                    <div className="grid gap-2">
                                        <Label>Metode Pencairan</Label>
                                        <Select value={metode} onValueChange={(v) => setMetode(v as any)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="TUNAI">Tunai</SelectItem>
                                                <SelectItem value="TRANSFER">Transfer Bank</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        {metode === "TRANSFER" && (
                                            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-md mt-2 flex flex-col gap-3">
                                                <p className="text-sm font-medium text-blue-900 mb-1">Informasi Rekening Pencairan</p>
                                                <div className="grid gap-1.5">
                                                    <Label className="text-xs">Bank</Label>
                                                    <Select value={bankSeller} onValueChange={setBankSeller}>
                                                      <SelectTrigger className="h-9"><SelectValue placeholder="Pilih Bank" /></SelectTrigger>
                                                      <SelectContent>
                                                        <SelectItem value="BCA">BCA</SelectItem>
                                                        <SelectItem value="BNI">BNI</SelectItem>
                                                        <SelectItem value="BRI">BRI</SelectItem>
                                                        <SelectItem value="Mandiri">Mandiri</SelectItem>
                                                        <SelectItem value="BSI">BSI</SelectItem>
                                                        <SelectItem value="CIMB">CIMB Niaga</SelectItem>
                                                        <SelectItem value="Lainnya">Lainnya</SelectItem>
                                                      </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid gap-1.5">
                                                    <Label className="text-xs">Nomor Rekening</Label>
                                                    <input
                                                        type="text"
                                                        value={noRekeningSeller}
                                                        onChange={(e) => setNoRekeningSeller(e.target.value)}
                                                        placeholder="Contoh: 1234567890"
                                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                    />
                                                </div>
                                                <div className="grid gap-1.5">
                                                    <Label className="text-xs">Nama Atas Rekening</Label>
                                                    <input
                                                        type="text"
                                                        value={namaRekeningSeller}
                                                        onChange={(e) => setNamaRekeningSeller(e.target.value)}
                                                        placeholder="Sesuai buku tabungan"
                                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label>Catatan (opsional)</Label>
                                    <Textarea
                                        placeholder="Tulis catatan jika ada..."
                                        value={catatanSeller}
                                        onChange={(e) => setCatatanSeller(e.target.value)}
                                        rows={3}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => setShowResponForm(false)}>Batal</Button>
                                    <Button
                                        onClick={() => responMutation.mutate()}
                                        disabled={responMutation.isPending || (respon === "DISETUJUI" && metode === "TRANSFER" && (!bankSeller || !noRekeningSeller || !namaRekeningSeller))}
                                        className={respon === "DITOLAK" ? "bg-red-600 hover:bg-red-700" : ""}
                                    >
                                        {responMutation.isPending ? "Mengirim..." : respon === "DISETUJUI" ? "Setuju & Kirim" : "Tolak Penawaran"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Foto */}
                {fotos.length > 0 && (
                    <Card className="md:col-span-2">
                        <CardHeader className="flex-row items-center gap-2 pb-3">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            <CardTitle className="text-base">Foto Mobil</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {fotos.map((f: any) => (
                                    <div key={f.id} className={`relative aspect-video rounded-md overflow-hidden border-2 ${f.isPrimary ? "border-primary" : "border-transparent"}`}>
                                        <Image src={f.url} alt="foto" fill className="object-cover" sizes="(max-width:768px)50vw,33vw" />
                                        {f.isPrimary && (
                                            <span className="absolute top-1 left-1 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">Utama</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Spesifikasi */}
                <Card>
                    <CardHeader className="flex-row items-center gap-2 pb-3">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-base">Spesifikasi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                            {[
                                ["Merek", item.merek],
                                ["Model", item.model],
                                ["Tahun", item.tahun],
                                ["Warna", item.warna],
                                ["Kilometer", item.kilometer ? `${Number(item.kilometer).toLocaleString("id-ID")} km` : null],
                                ["Bahan Bakar", item.bahan_bakar],
                                ["Transmisi", item.transmisi],
                                ["Harga Diajukan", item.harga ? `Rp ${Number(item.harga).toLocaleString("id-ID")}` : "-"],
                            ].map(([label, val]) => (
                                <div key={label as string}>
                                    <dt className="text-muted-foreground">{label}</dt>
                                    <dd className="font-medium mt-0.5">{val ?? "-"}</dd>
                                </div>
                            ))}
                        </dl>
                        {item.deskripsi && (
                            <div className="mt-4 text-sm">
                                <p className="text-muted-foreground mb-1">Deskripsi</p>
                                <p className="whitespace-pre-wrap">{item.deskripsi}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Detail Penawaran */}
                {penawaran && (
                    <Card>
                        <CardHeader className="flex-row items-center gap-2 pb-3">
                            <Gavel className="h-4 w-4 text-muted-foreground" />
                            <CardTitle className="text-base">Detail Penawaran</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <div className="text-sm border rounded-md p-3 flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">
                                        Rp {Number(penawaran.hargaTawar).toLocaleString("id-ID")}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                        {penawaran.respon || "MENUNGGU"}
                                    </Badge>
                                </div>
                                {penawaran.catatanAdmin && (
                                    <p className="text-muted-foreground">Admin: {penawaran.catatanAdmin}</p>
                                )}
                                {penawaran.catatanSeller && (
                                    <p className="text-muted-foreground">Kamu: {penawaran.catatanSeller}</p>
                                )}
                            </div>
                            
                            {(penawaran.buktiTransferUrl || penawaran.kwitansiUrl) && (
                                <div className="mt-2 flex flex-col gap-3">
                                    <h4 className="font-semibold text-sm">Bukti Pembayaran Admin:</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {penawaran.buktiTransferUrl && (
                                            <div className="flex flex-col gap-1 border rounded p-2">
                                                <p className="text-xs text-muted-foreground">Bukti Transfer</p>
                                                <Link href={penawaran.buktiTransferUrl} target="_blank" className="relative aspect-video rounded overflow-hidden">
                                                    <Image src={penawaran.buktiTransferUrl} alt="Bukti Transfer" fill className="object-cover" sizes="50vw" />
                                                </Link>
                                            </div>
                                        )}
                                        {penawaran.kwitansiUrl && (
                                            <div className="flex flex-col gap-1 border rounded p-2">
                                                <p className="text-xs text-muted-foreground">Kwitansi</p>
                                                <Link href={penawaran.kwitansiUrl} target="_blank" className="relative aspect-video rounded overflow-hidden">
                                                    <Image src={penawaran.kwitansiUrl} alt="Kwitansi" fill className="object-cover" sizes="50vw" />
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
