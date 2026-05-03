"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getPenjualanById,
    updateStatusPenjualan,
    createPenawaranAdmin,
    konfirmasiPembayaran,
    type PenjualanStatus,
} from "@/service/admin-penjualan-service";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, Car, User, Image as ImageIcon, Gavel, CreditCard, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
    DRAFT: { label: "Draft", className: "bg-zinc-100 text-zinc-600 border-zinc-300" },
    MENUNGGU_EVALUASI: { label: "Menunggu Evaluasi", className: "bg-yellow-100 text-yellow-700 border-yellow-300" },
    SEDANG_DIEVALUASI: { label: "Sedang Dievaluasi", className: "bg-blue-100 text-blue-700 border-blue-300" },
    DITAWARKAN: { label: "Ditawarkan", className: "bg-purple-100 text-purple-700 border-purple-300" },
    DISETUJUI: { label: "Disetujui", className: "bg-green-100 text-green-700 border-green-300" },
    DITOLAK: { label: "Ditolak", className: "bg-red-100 text-red-700 border-red-300" },
    TERSEDIA: { label: "Tersedia", className: "bg-emerald-100 text-emerald-700 border-emerald-300" },
    TERJUAL: { label: "Terjual", className: "bg-zinc-800 text-zinc-100 border-zinc-900" },
};

const ADMIN_STATUS_OPTIONS: { value: PenjualanStatus; label: string }[] = [
    { value: "MENUNGGU_EVALUASI", label: "Menunggu Evaluasi" },
    { value: "SEDANG_DIEVALUASI", label: "Sedang Dievaluasi" },
    { value: "DITAWARKAN", label: "Ditawarkan" },
    { value: "DISETUJUI", label: "Disetujui" },
    { value: "DITOLAK", label: "Ditolak" },
    { value: "TERSEDIA", label: "Tersedia" },
    { value: "TERJUAL", label: "Terjual" },
];

export default function AdminMobilDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();

    // Penawaran form state
    const [tawarOpen, setTawarOpen] = useState(false);
    const [hargaTawar, setHargaTawar] = useState("");
    const [catatanAdmin, setCatatanAdmin] = useState("");

    // Status form state
    const [statusOpen, setStatusOpen] = useState(false);
    const [newStatus, setNewStatus] = useState<PenjualanStatus>("SEDANG_DIEVALUASI");

    // Bayar form state
    const [bayarOpen, setBayarOpen] = useState(false);
    const [metode, setMetode] = useState<"TUNAI" | "TRANSFER">("TUNAI");
    const [buktiFile, setBuktiFile] = useState<File | null>(null);
    const [kwitansiFile, setKwitansiFile] = useState<File | null>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin-penjualan-detail", id],
        queryFn: () => getPenjualanById(id),
        enabled: !!id,
    });

    const item = data?.data || data;

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["admin-penjualan-detail", id] });
        queryClient.invalidateQueries({ queryKey: ["admin-penjualan"] });
    };

    const statusMutation = useMutation({
        mutationFn: () => updateStatusPenjualan(id, newStatus),
        onSuccess: () => { toast.success("Status berhasil diubah"); invalidate(); setStatusOpen(false); },
        onError: (e: any) => toast.error(e.message),
    });

    const tawarMutation = useMutation({
        mutationFn: () => createPenawaranAdmin(id, {
            hargaTawar: Number(hargaTawar.replace(/\D/g, "")),
            catatanAdmin: catatanAdmin || undefined,
        }),
        onSuccess: () => { toast.success("Penawaran terkirim ke seller"); invalidate(); setTawarOpen(false); setHargaTawar(""); setCatatanAdmin(""); },
        onError: (e: any) => toast.error(e.message),
    });

    const bayarMutation = useMutation({
        mutationFn: () => konfirmasiPembayaran(id, {
            metode,
            buktiTransfer: buktiFile || undefined,
            kwitansi: kwitansiFile || undefined,
        }),
        onSuccess: () => { toast.success("Pembayaran dikonfirmasi, mobil kini TERSEDIA"); invalidate(); setBayarOpen(false); },
        onError: (e: any) => toast.error(e.message),
    });

    if (isLoading) return (
        <div className="flex flex-col min-h-screen">
            <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger className="-ml-2" />
                <Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-semibold">Detail Pengajuan</h1>
            </header>
            <main className="flex-1 p-6 flex items-center justify-center text-muted-foreground">Memuat data...</main>
        </div>
    );

    if (isError || !item) return (
        <div className="flex flex-col min-h-screen">
            <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger className="-ml-2" />
                <Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-semibold">Detail Pengajuan</h1>
            </header>
            <main className="flex-1 p-6 flex items-center justify-center text-destructive">Data tidak ditemukan.</main>
        </div>
    );

    const badge = STATUS_BADGE[item.status] || { label: item.status, className: "" };
    const fotos: any[] = item.fotomobils || [];
    const penawaran = item.penawaran ?? null;

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger className="-ml-2" />
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" size="sm" asChild className="gap-2">
                    <Link href="/dashboard/mobil"><ArrowLeft className="h-4 w-4" /> Kembali</Link>
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-semibold truncate">{item.nama}</h1>
                <Badge variant="outline" className={`ml-auto shrink-0 ${badge.className}`}>{badge.label}</Badge>
            </header>

            <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT — Detail Info */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Foto */}
                    {fotos.length > 0 && (
                        <Card>
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
                            <CardTitle className="text-base">Spesifikasi Mobil</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                {[
                                    ["Nama", item.nama],
                                    ["Merek", item.merek],
                                    ["Model", item.model],
                                    ["Tahun", item.tahun],
                                    ["Warna", item.warna],
                                    ["Kilometer", item.kilometer],
                                    ["Bahan Bakar", item.bahan_bakar],
                                    ["Transmisi", item.transmisi],
                                    ["Harga Seller", item.harga ? `Rp ${Number(item.harga).toLocaleString("id-ID")}` : "-"],
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

                    {/* Penawaran */}
                    {penawaran && (
                        <Card>
                            <CardHeader className="flex-row items-center gap-2 pb-3">
                                <Gavel className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-base">Penawaran Harga</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-base">
                                        Rp {Number(penawaran.hargaTawar).toLocaleString("id-ID")}
                                    </span>
                                    <Badge variant="outline" className={`text-xs ${
                                        penawaran.respon === "DISETUJUI" ? "bg-green-100 text-green-700 border-green-300" :
                                        penawaran.respon === "DITOLAK" ? "bg-red-100 text-red-700 border-red-300" :
                                        "bg-yellow-100 text-yellow-700 border-yellow-300"
                                    }`}>
                                        {penawaran.respon === "MENUNGGU" ? "Menunggu Respon Seller" :
                                         penawaran.respon === "DISETUJUI" ? "✓ Disetujui Seller" :
                                         "✗ Ditolak Seller"}
                                    </Badge>
                                </div>
                                {penawaran.catatanAdmin && (
                                    <p className="text-muted-foreground">Catatan admin: {penawaran.catatanAdmin}</p>
                                )}
                                {penawaran.catatanSeller && (
                                    <p className="text-muted-foreground">Balasan seller: {penawaran.catatanSeller}</p>
                                )}
                                {penawaran.metode && (
                                    <p className="text-muted-foreground">Metode bayar seller: {penawaran.metode}</p>
                                )}
                                {penawaran.metode === "TRANSFER" && penawaran.bankSeller && (
                                    <div className="mt-2 text-xs bg-blue-50 border border-blue-100 rounded-md p-3">
                                        <p className="font-semibold text-blue-900 mb-1.5 flex items-center gap-1.5">
                                            <CreditCard className="h-3.5 w-3.5" /> Rekening Pencairan Seller
                                        </p>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div><span className="text-blue-700/80 block">Bank</span><span className="font-bold text-blue-900">{penawaran.bankSeller}</span></div>
                                            <div><span className="text-blue-700/80 block">No. Rekening</span><span className="font-mono font-medium text-blue-900">{penawaran.noRekeningSeller}</span></div>
                                            <div><span className="text-blue-700/80 block">Atas Nama</span><span className="font-medium text-blue-900">{penawaran.namaRekeningSeller}</span></div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* RIGHT — Aksi Admin + Seller Info */}
                <div className="flex flex-col gap-6">
                    {/* Info Seller */}
                    <Card>
                        <CardHeader className="flex-row items-center gap-2 pb-3">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <CardTitle className="text-base">Info Seller</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm flex flex-col gap-1">
                            <p className="font-medium">{item.seller?.name || "-"}</p>
                            <p className="text-muted-foreground">{item.seller?.email}</p>
                            <p className="text-muted-foreground">{item.seller?.phone || ""}</p>
                        </CardContent>
                    </Card>

                    {/* Aksi Admin */}
                    <Card>
                        <CardHeader className="flex-row items-center gap-2 pb-3">
                            <RefreshCw className="h-4 w-4 text-muted-foreground" />
                            <CardTitle className="text-base">Aksi Admin</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {/* Ubah Status */}
                            <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full">Ubah Status</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Ubah Status Pengajuan</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-3 py-4">
                                        <Label>Status Baru</Label>
                                        <Select value={newStatus} onValueChange={(v) => setNewStatus(v as PenjualanStatus)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {ADMIN_STATUS_OPTIONS.map((o) => (
                                                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setStatusOpen(false)}>Batal</Button>
                                        <Button onClick={() => statusMutation.mutate()} disabled={statusMutation.isPending}>
                                            {statusMutation.isPending ? "Menyimpan..." : "Simpan"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* Tawar Harga */}
                            {!["DISETUJUI", "TERSEDIA", "TERJUAL", "DITOLAK"].includes(item.status) && (
                                <Dialog open={tawarOpen} onOpenChange={setTawarOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full gap-2">
                                        <Gavel className="h-4 w-4" /> Beri Penawaran Harga
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Penawaran Harga ke Seller</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label>Harga Tawar (Rp)</Label>
                                            <Input
                                                placeholder="Contoh: 150000000"
                                                value={hargaTawar}
                                                onChange={(e) => setHargaTawar(e.target.value)}
                                                type="number"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Catatan Admin (opsional)</Label>
                                            <Textarea
                                                placeholder="Tuliskan catatan untuk seller..."
                                                value={catatanAdmin}
                                                onChange={(e) => setCatatanAdmin(e.target.value)}
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setTawarOpen(false)}>Batal</Button>
                                        <Button onClick={() => tawarMutation.mutate()} disabled={tawarMutation.isPending || !hargaTawar}>
                                            {tawarMutation.isPending ? "Mengirim..." : "Kirim Penawaran"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            )}

                            {/* Konfirmasi Pembayaran */}
                            {item.status === "DISETUJUI" && (
                                <Dialog open={bayarOpen} onOpenChange={setBayarOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" className="w-full gap-2">
                                        <CreditCard className="h-4 w-4" /> Konfirmasi Pembayaran
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Konfirmasi Pembayaran ke Seller</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label>Metode Pembayaran</Label>
                                            <Select value={metode} onValueChange={(v) => setMetode(v as "TUNAI" | "TRANSFER")}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="TUNAI">Tunai</SelectItem>
                                                    <SelectItem value="TRANSFER">Transfer Bank</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {metode === "TRANSFER" && (
                                            <div className="grid gap-2">
                                                <Label>Foto Bukti Transfer (opsional)</Label>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setBuktiFile(e.target.files?.[0] || null)}
                                                />
                                            </div>
                                        )}
                                        <div className="grid gap-2">
                                            <Label>Foto Kwitansi (opsional)</Label>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setKwitansiFile(e.target.files?.[0] || null)}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setBayarOpen(false)}>Batal</Button>
                                        <Button onClick={() => bayarMutation.mutate()} disabled={bayarMutation.isPending}>
                                            {bayarMutation.isPending ? "Memproses..." : "Konfirmasi"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
