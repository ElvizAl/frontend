"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLaporan } from "@/service/order-service";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer, TrendingUp, ShoppingBag, FileText } from "lucide-react";

const BULAN = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const now = new Date();
const THIS_YEAR = now.getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => THIS_YEAR - i);

export default function LaporanPage() {
    const [bulan, setBulan] = useState<string>(String(now.getMonth() + 1));
    const [tahun, setTahun] = useState<string>(String(THIS_YEAR));

    const { data, isLoading } = useQuery({
        queryKey: ["laporan", bulan, tahun],
        queryFn: () => getLaporan({ bulan: Number(bulan), tahun: Number(tahun) }),
    });

    const laporan = data?.data;
    const orders: any[] = laporan?.orders ?? [];
    const summary = laporan?.summary ?? { totalMobilTerjual: 0, totalPendapatan: 0 };

    const periodeLabel = `${BULAN[Number(bulan) - 1]} ${tahun}`;

    return (
        <div className="flex flex-col min-h-screen">
            <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6 print:hidden">
                <SidebarTrigger className="-ml-2" />
                <Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-semibold">Laporan Penjualan</h1>
                <div className="ml-auto flex items-center gap-3">
                    <Select value={bulan} onValueChange={setBulan}>
                        <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {BULAN.map((b, i) => <SelectItem key={i} value={String(i + 1)}>{b}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={tahun} onValueChange={setTahun}>
                        <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {YEARS.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button onClick={() => window.print()} className="gap-2">
                        <Printer className="h-4 w-4" /> Cetak
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-6" id="laporan-print">
                {/* Kop laporan */}
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <div className="h-9 w-9 rounded-full bg-[#E31818] flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M4 16C4 17.1046 4.89543 18 6 18H18C19.1046 18 20 17.1046 20 16V12L18.5 7H5.5L4 12V16Z" fill="white"/>
                                <circle cx="7.5" cy="14.5" r="1.5" fill="#E31818"/>
                                <circle cx="16.5" cy="14.5" r="1.5" fill="#E31818"/>
                                <path d="M6 10H18" stroke="#E31818" strokeWidth="2"/>
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-[#E31818]">Glotomotif</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mt-2">Laporan Penjualan</h2>
                    <p className="text-gray-500 text-sm">Periode: {periodeLabel}</p>
                    <p className="text-gray-400 text-xs mt-1">Dicetak: {now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
                        <div className="bg-blue-50 p-3 rounded-xl">
                            <ShoppingBag className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Pesanan Aktif</p>
                            <p className="text-3xl font-bold">{summary.totalMobilTerjual}</p>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
                        <div className="bg-emerald-50 p-3 rounded-xl">
                            <FileText className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Transaksi Selesai</p>
                            <p className="text-3xl font-bold text-emerald-700">{summary.totalSelesai ?? 0}</p>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
                        <div className="bg-green-50 p-3 rounded-xl">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Diterima</p>
                            <p className="text-xl font-bold text-green-700">
                                Rp {summary.totalPendapatan.toLocaleString("id-ID")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabel detail */}
                <div className="rounded-xl border bg-card mb-6">
                    <div className="flex items-center gap-2 p-4 border-b">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold text-sm">Detail Transaksi</h3>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Tanggal Pesan</TableHead>
                                <TableHead>Pembeli</TableHead>
                                <TableHead>Kendaraan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Dibayar / Harga</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">Memuat laporan...</TableCell>
                                </TableRow>
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        Tidak ada transaksi selesai pada periode {periodeLabel}.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((o: any, idx: number) => {
                                    const statusLabel: Record<string, string> = {
                                        MENUNGGU_BUKTI_PESANAN: "Bukti Pesanan",
                                        MENUNGGU_DP: "Menunggu DP",
                                        MENUNGGU_PELUNASAN: "Menunggu Pelunasan",
                                        LUNAS_SIAP_SERAH: "Lunas",
                                        SELESAI: "Selesai",
                                    };
                                    const statusColor: Record<string, string> = {
                                        MENUNGGU_BUKTI_PESANAN: "text-yellow-600",
                                        MENUNGGU_DP: "text-blue-600",
                                        MENUNGGU_PELUNASAN: "text-purple-600",
                                        LUNAS_SIAP_SERAH: "text-green-600",
                                        SELESAI: "text-emerald-700 font-bold",
                                    };
                                    return (
                                    <TableRow key={o.id}>
                                        <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                                        <TableCell className="text-sm">
                                            {new Date(o.tanggalPesan).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium text-sm">{o.buyer?.name}</p>
                                            <p className="text-xs text-muted-foreground">{o.buyer?.email}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium text-sm">{o.mobil?.nama}</p>
                                            <p className="text-xs text-muted-foreground">{[o.mobil?.merek, o.mobil?.tahun].filter(Boolean).join(" · ")}</p>
                                        </TableCell>
                                        <TableCell className={`text-sm ${statusColor[o.statusOrder] ?? ""}`}>
                                            {statusLabel[o.statusOrder] ?? o.statusOrder}
                                        </TableCell>
                                        <TableCell className="text-right text-sm">
                                            <p className="font-semibold">Rp {Number(o.totalDibayar).toLocaleString("id-ID")}</p>
                                            <p className="text-xs text-muted-foreground">/ Rp {Number(o.hargaMobil).toLocaleString("id-ID")}</p>
                                        </TableCell>
                                    </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                    {orders.length > 0 && (
                        <div className="flex justify-end p-4 border-t">
                            <div className="text-sm font-bold">
                                Total: Rp {summary.totalPendapatan.toLocaleString("id-ID")}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer print */}
                <div className="hidden print:flex justify-between text-xs text-gray-400 mt-8 pt-4 border-t">
                    <span>Glotomotif — Platform Jual Beli Mobil Terpercaya</span>
                    <span>Laporan {periodeLabel}</span>
                </div>
            </main>

            <style>{`
                @media print {
                    .print\\:hidden { display: none !important; }
                    .print\\:flex { display: flex !important; }
                    body { background: white; }
                }
            `}</style>
        </div>
    );
}
