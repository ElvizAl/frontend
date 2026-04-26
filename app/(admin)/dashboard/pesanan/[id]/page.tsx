"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrderById, verifikasiPembayaran, updateStatusSurat, updatePengambilan, prosesRefund } from "@/service/order-service";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Upload, CheckCircle, FileText, Car, Package, RefreshCcw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const STATUS_MAP: Record<string, string> = {
    MENUNGGU_BUKTI_PESANAN: "bg-yellow-100 text-yellow-700 border-yellow-300",
    MENUNGGU_DP: "bg-blue-100 text-blue-700 border-blue-300",
    MENUNGGU_PELUNASAN: "bg-purple-100 text-purple-700 border-purple-300",
    LUNAS_SIAP_SERAH: "bg-green-100 text-green-700 border-green-300",
    SELESAI: "bg-emerald-100 text-emerald-700 border-emerald-300",
    DIBATALKAN: "bg-red-100 text-red-700 border-red-300",
};

export default function AdminPesananDetailPage() {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const kwitansiRef = useRef<HTMLInputElement>(null);
    const suratRef = useRef<HTMLInputElement>(null);
    const [kwitansiFile, setKwitansiFile] = useState<File | null>(null);
    const [suratFile, setSuratFile] = useState<File | null>(null);
    const [statusStnk, setStatusStnk] = useState("");
    const [statusBpkb, setStatusBpkb] = useState("");
    const [metodePengambilan, setMetodePengambilan] = useState("");
    const [alamatKirim, setAlamatKirim] = useState("");
    const [buktiRefundFile, setBuktiRefundFile] = useState<File | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["admin-order", id],
        queryFn: () => getOrderById(id),
        enabled: !!id,
    });

    const order = data?.data;
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-order", id] });

    const verifikasiMutation = useMutation({
        mutationFn: (pembayaranId: string) =>
            verifikasiPembayaran(pembayaranId, { sudahDiverifikasi: true }, kwitansiFile ?? undefined),
        onSuccess: () => { toast.success("Pembayaran terverifikasi!"); invalidate(); setKwitansiFile(null); },
        onError: (e: any) => toast.error(e.message),
    });

    const suratMutation = useMutation({
        mutationFn: () => updateStatusSurat(id, {
            statusStnk: statusStnk || undefined,
            statusBpkb: statusBpkb || undefined,
        }),
        onSuccess: () => { toast.success("Status surat diperbarui"); invalidate(); },
        onError: (e: any) => toast.error(e.message),
    });

    const pengambilanMutation = useMutation({
        mutationFn: () => updatePengambilan(id,
            { metodePengambilan, alamatKirim: alamatKirim || undefined },
            suratFile ?? undefined
        ),
        onSuccess: () => { toast.success("Info pengambilan diperbarui"); invalidate(); setSuratFile(null); },
        onError: (e: any) => toast.error(e.message),
    });

    const refundMutation = useMutation({
        mutationFn: (pembayaranId: string) => prosesRefund(pembayaranId, buktiRefundFile ?? undefined),
        onSuccess: () => { toast.success("Refund berhasil diproses"); invalidate(); setBuktiRefundFile(null); },
        onError: (e: any) => toast.error(e.message),
    });

    if (isLoading || !order) return (
        <div className="flex flex-col min-h-screen">
            <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger className="-ml-2" /><Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-semibold">Detail Pesanan</h1>
            </header>
            <main className="flex-1 p-6 text-muted-foreground">Memuat...</main>
        </div>
    );

    const foto = order.mobil?.fotomobils?.[0]?.url;
    const unverifiedPembayarans = order.pembayarans?.filter((p: any) => !p.sudahDiverifikasi) ?? [];

    return (
        <div className="flex flex-col min-h-screen">
            <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger className="-ml-2" />
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" size="sm" asChild className="gap-2">
                    <Link href="/dashboard/pesanan"><ArrowLeft className="h-4 w-4" /> Kembali</Link>
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-semibold truncate">Pesanan #{order.id.slice(-8).toUpperCase()}</h1>
                <Badge variant="outline" className={`ml-auto shrink-0 ${STATUS_MAP[order.statusOrder] ?? ""}`}>
                    {order.statusOrder.replace(/_/g, " ")}
                </Badge>
            </header>

            <main className="flex-1 p-6 max-w-4xl mx-auto w-full flex flex-col gap-6">
                {/* Header Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="pb-3 flex-row items-center gap-2">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <CardTitle className="text-sm">Kendaraan</CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-3">
                            {foto && (
                                <div className="relative h-16 w-24 rounded-lg overflow-hidden shrink-0 bg-muted">
                                    <Image src={foto} alt="" fill className="object-cover" sizes="96px" />
                                </div>
                            )}
                            <div>
                                <p className="font-semibold">{order.mobil?.nama}</p>
                                <p className="text-sm text-muted-foreground">{[order.mobil?.merek, order.mobil?.model, order.mobil?.tahun].filter(Boolean).join(" · ")}</p>
                                <p className="text-sm font-bold mt-1 text-primary">Rp {Number(order.mobil?.harga).toLocaleString("id-ID")}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3 flex-row items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <CardTitle className="text-sm">Pembeli</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm flex flex-col gap-1">
                            <p className="font-semibold">{order.buyer?.name}</p>
                            <p className="text-muted-foreground">{order.buyer?.email}</p>
                            {order.buyer?.profile?.phone && <p className="text-muted-foreground">{order.buyer.profile.phone}</p>}
                            {order.ktpUrl && (
                                <a href={order.ktpUrl} target="_blank" className="text-primary hover:underline text-xs mt-1 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" /> KTP sudah diupload
                                </a>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Verifikasi Pembayaran */}
                {unverifiedPembayarans.length > 0 && (
                    <Card className="border-amber-200 bg-amber-50/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-amber-700">Pembayaran Menunggu Verifikasi</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {unverifiedPembayarans.map((p: any) => (
                                <div key={p.id} className="flex flex-col gap-3 border rounded-lg p-3 bg-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-sm">{p.tipe.replace(/_/g, " ")}</p>
                                            <p className="text-xs text-muted-foreground">{p.metode} · Rp {Number(p.nominal).toLocaleString("id-ID")}</p>
                                        </div>
                                        {p.buktiTransferUrl && (
                                            <a href={p.buktiTransferUrl} target="_blank" className="text-primary text-xs hover:underline">Lihat bukti</a>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center gap-2 text-sm cursor-pointer text-primary hover:underline">
                                            <Upload className="h-3.5 w-3.5" /> {kwitansiFile ? kwitansiFile.name : "Upload kwitansi (opsional)"}
                                            <input ref={kwitansiRef} type="file" accept="image/*,.pdf" className="hidden"
                                                onChange={(e) => setKwitansiFile(e.target.files?.[0] ?? null)} />
                                        </label>
                                        <Button size="sm" onClick={() => verifikasiMutation.mutate(p.id)} disabled={verifikasiMutation.isPending}>
                                            {verifikasiMutation.isPending ? "Memverifikasi..." : "✓ Verifikasi Pembayaran"}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Proses Refund (Jika Dibatalkan & Ada Bukti Pesanan) */}
                {order.statusOrder === "DIBATALKAN" && order.pembayarans?.some((p: any) => p.tipe === "BUKTI_PESANAN") && (
                    <Card className="border-red-200 bg-red-50/50">
                        <CardHeader className="pb-3 flex-row items-center gap-2">
                            <RefreshCcw className="h-4 w-4 text-red-600" />
                            <CardTitle className="text-sm text-red-800">Refund Uang Muka (Bukti Pesanan)</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {order.pembayarans.filter((p: any) => p.tipe === "BUKTI_PESANAN").map((p: any) => (
                                <div key={p.id} className="flex flex-col gap-3 border border-red-100 rounded-lg p-3 bg-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-sm">Uang Muka BUKTI PESANAN</p>
                                            <p className="text-xs text-muted-foreground">{p.metode} · Rp {Number(p.nominal).toLocaleString("id-ID")}</p>
                                        </div>
                                        <Badge variant="outline" className={p.isRefunded ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}>
                                            {p.isRefunded ? "Sudah Di-refund" : "Belum Refund"}
                                        </Badge>
                                    </div>
                                    
                                    {!p.isRefunded ? (
                                        <div className="flex items-center gap-3 mt-2">
                                            <label className="flex items-center gap-2 text-sm cursor-pointer text-primary hover:underline">
                                                <Upload className="h-3.5 w-3.5" /> {buktiRefundFile ? buktiRefundFile.name : "Upload Bukti Refund"}
                                                <input type="file" accept="image/*,.pdf" className="hidden"
                                                    onChange={(e) => setBuktiRefundFile(e.target.files?.[0] ?? null)} />
                                            </label>
                                            <Button size="sm" variant="destructive" onClick={() => refundMutation.mutate(p.id)} disabled={refundMutation.isPending}>
                                                {refundMutation.isPending ? "Memproses..." : "Proses Refund"}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="mt-2 text-xs bg-green-50 p-2 rounded-md border border-green-100">
                                            <p className="font-medium text-green-800">Refund telah dikembalikan</p>
                                            <p className="text-green-700/80 mb-1">Pada {new Date(p.refundedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                                            {p.buktiRefundUrl && (
                                                <a href={p.buktiRefundUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1 mt-1">
                                                    <CheckCircle className="h-3 w-3" /> Lihat Bukti Refund
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Riwayat Semua Pembayaran */}
                {order.pembayarans?.length > 0 && (
                    <Card>
                        <CardHeader className="pb-3"><CardTitle className="text-sm">Riwayat Pembayaran</CardTitle></CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            {order.pembayarans.map((p: any) => (
                                <div key={p.id} className="flex justify-between items-center text-sm border rounded-lg p-3">
                                    <div>
                                        <p className="font-medium">{p.tipe.replace(/_/g, " ")}</p>
                                        <p className="text-xs text-muted-foreground">{p.metode}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>Rp {Number(p.nominal).toLocaleString("id-ID")}</span>
                                        <Badge variant="outline" className={p.sudahDiverifikasi ? "bg-green-100 text-green-700 border-green-300 text-xs" : "bg-yellow-100 text-yellow-700 border-yellow-300 text-xs"}>
                                            {p.sudahDiverifikasi ? "✓ Verified" : "Pending"}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Status Surat */}
                <Card>
                    <CardHeader className="pb-3 flex-row items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm">Update Status Surat</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>STNK (saat ini: {order.statusStnk?.replace(/_/g, " ")})</Label>
                                <Select value={statusStnk} onValueChange={setStatusStnk}>
                                    <SelectTrigger><SelectValue placeholder="Pilih status" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BELUM_DIPROSES">Belum Diproses</SelectItem>
                                        <SelectItem value="SEDANG_DIPROSES">Sedang Diproses</SelectItem>
                                        <SelectItem value="SELESAI">Selesai</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>BPKB (saat ini: {order.statusBpkb?.replace(/_/g, " ")})</Label>
                                <Select value={statusBpkb} onValueChange={setStatusBpkb}>
                                    <SelectTrigger><SelectValue placeholder="Pilih status" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BELUM_DIPROSES">Belum Diproses</SelectItem>
                                        <SelectItem value="SEDANG_DIPROSES">Sedang Diproses</SelectItem>
                                        <SelectItem value="SELESAI">Selesai</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button onClick={() => suratMutation.mutate()} disabled={suratMutation.isPending || (!statusStnk && !statusBpkb)} className="w-full sm:w-auto">
                            {suratMutation.isPending ? "Menyimpan..." : "Simpan Status Surat"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Pengambilan */}
                <Card>
                    <CardHeader className="pb-3 flex-row items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm">Metode Pengambilan</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Metode</Label>
                                <Select value={metodePengambilan || order.metodePengambilan || ""} onValueChange={setMetodePengambilan}>
                                    <SelectTrigger><SelectValue placeholder="Pilih metode" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AMBIL_SENDIRI">Ambil Sendiri</SelectItem>
                                        <SelectItem value="DIANTAR">Diantar</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {(metodePengambilan || order.metodePengambilan) === "DIANTAR" && (
                                <div className="grid gap-2">
                                    <Label>Alamat Kirim</Label>
                                    <input
                                        value={alamatKirim || order.alamatKirim || ""}
                                        onChange={(e) => setAlamatKirim(e.target.value)}
                                        placeholder="Masukkan alamat pengiriman"
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                </div>
                            )}
                        </div>
                        {(metodePengambilan || order.metodePengambilan) === "DIANTAR" && (
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 text-sm cursor-pointer text-primary hover:underline">
                                    <Upload className="h-3.5 w-3.5" /> {suratFile ? suratFile.name : "Upload Surat Jalan (opsional)"}
                                    <input ref={suratRef} type="file" accept="image/*,.pdf" className="hidden"
                                        onChange={(e) => setSuratFile(e.target.files?.[0] ?? null)} />
                                </label>
                            </div>
                        )}
                        <Button onClick={() => pengambilanMutation.mutate()} disabled={pengambilanMutation.isPending || !metodePengambilan} className="w-full sm:w-auto">
                            {pengambilanMutation.isPending ? "Menyimpan..." : "Simpan Info Pengambilan"}
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
