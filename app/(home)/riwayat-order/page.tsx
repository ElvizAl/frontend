"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "@/service/order-service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ChevronRight, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

const STATUS_MAP: Record<string, { label: string; color: string; dot: string }> = {
    MENUNGGU_BUKTI_PESANAN: { label: "Menunggu Bukti Pesanan", color: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "bg-yellow-400" },
    MENUNGGU_DP: { label: "Menunggu DP", color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-400" },
    MENUNGGU_PELUNASAN: { label: "Menunggu Pelunasan", color: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-400" },
    LUNAS_SIAP_SERAH: { label: "Lunas · Siap Diserahkan", color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-400" },
    SELESAI: { label: "Selesai", color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
    DIBATALKAN: { label: "Dibatalkan", color: "bg-red-50 text-red-600 border-red-200", dot: "bg-red-400" },
};

export default function RiwayatOrderPage() {
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const limit = 8;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["my-orders", statusFilter, page],
        queryFn: () => getMyOrders({ status: statusFilter !== "ALL" ? statusFilter : undefined, page, limit }),
    });

    const orders: any[] = data?.data || [];
    const meta = data?.meta || { totalPages: 1, total: 0, page: 1 };

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            <div className="max-w-3xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Riwayat Pesanan</h1>
                    <p className="text-sm text-gray-500 mt-1">Pantau status pembelian mobilmu</p>
                </div>

                {/* Filter */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-gray-500">{meta.total ?? orders.length} pesanan</p>
                    <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                        <SelectTrigger className="w-[200px] bg-white text-sm">
                            <SelectValue placeholder="Filter status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Semua Status</SelectItem>
                            {Object.entries(STATUS_MAP).map(([k, v]) => (
                                <SelectItem key={k} value={k}>{v.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-[100px] rounded-2xl bg-white animate-pulse border border-gray-100" />
                        ))}
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <div className="flex flex-col items-center py-20 text-gray-400 gap-3">
                        <AlertCircle className="h-10 w-10" />
                        <p>Gagal memuat pesanan.</p>
                        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Coba Lagi</Button>
                    </div>
                )}

                {/* Empty */}
                {!isLoading && !isError && orders.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
                        <ShoppingBag className="h-14 w-14 opacity-30" />
                        <div className="text-center">
                            <p className="font-medium text-gray-600">Belum ada pesanan</p>
                            <p className="text-sm mt-1">Cari mobil impianmu dan lakukan pemesanan</p>
                        </div>
                        <Button asChild className="bg-[#3D3DE8] hover:bg-[#3D3DE8]/90 mt-2">
                            <Link href="/">Cari Mobil Sekarang</Link>
                        </Button>
                    </div>
                )}

                {/* Order list */}
                {!isLoading && !isError && orders.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {orders.map((order: any) => {
                            const foto = order.mobil?.fotomobils?.[0]?.url;
                            const status = STATUS_MAP[order.statusOrder] ?? { label: order.statusOrder, color: "bg-gray-50 text-gray-600 border-gray-200", dot: "bg-gray-400" };
                            const isSelesai = order.statusOrder === "SELESAI";
                            return (
                                <Link
                                    key={order.id}
                                    href={`/riwayat-order/${order.id}`}
                                    className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all group"
                                >
                                    {/* Thumbnail */}
                                    <div className="h-[72px] w-[104px] shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                        <img
                                            src={foto ?? "https://images.unsplash.com/photo-1549317661-bc02c32e2a96?q=80&w=300&auto=format&fit=crop"}
                                            alt={order.mobil?.nama ?? "Mobil"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{order.mobil?.nama}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {[order.mobil?.merek, order.mobil?.tahun].filter(Boolean).join(" · ")}
                                        </p>
                                        {/* Status badge */}
                                        <div className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${status.color}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                                            {status.label}
                                        </div>
                                    </div>

                                    {/* Right side */}
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <p className="text-sm font-bold text-[#3D3DE8]">
                                            Rp {Number(order.mobil?.harga).toLocaleString("id-ID")}
                                        </p>
                                        <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                            <Clock className="h-3 w-3" />
                                            {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                        </div>
                                        <div className="flex items-center gap-1 text-[11px] font-medium text-[#3D3DE8] group-hover:gap-2 transition-all">
                                            {isSelesai ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <ChevronRight className="h-3.5 w-3.5" />}
                                            {isSelesai ? "Lihat Kwitansi" : "Lihat Detail"}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {meta.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-8">
                        <Button variant="outline" size="sm" className="bg-white" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                            Sebelumnya
                        </Button>
                        <span className="text-sm text-gray-500">Hal {page} / {meta.totalPages}</span>
                        <Button variant="outline" size="sm" className="bg-white" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>
                            Selanjutnya
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
