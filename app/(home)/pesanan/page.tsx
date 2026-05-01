"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyOrders, cancelOrder } from "@/service/order-service";
import { Button } from "@/components/ui/button";
import {
    Clock, CheckCircle, ChevronRight, ShoppingBag,
    Upload, CreditCard, Package, AlertCircle, XCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Status yang dianggap "berlangsung"
const ACTIVE_STATUSES = [
    "MENUNGGU_BUKTI_PESANAN",
    "MENUNGGU_DP",
    "MENUNGGU_PELUNASAN",
    "LUNAS_SIAP_SERAH",
];

const STATUS_INFO: Record<string, {
    label: string;
    desc: string;
    action: string;
    icon: React.ElementType;
    barColor: string;
    step: number;
}> = {
    MENUNGGU_BUKTI_PESANAN: {
        label: "Menunggu Bukti Pesanan",
        desc: "Upload bukti pesanan senilai Rp 500.000 untuk mengamankan unit",
        action: "Upload Sekarang",
        icon: Upload,
        barColor: "bg-yellow-400",
        step: 1,
    },
    MENUNGGU_DP: {
        label: "Menunggu DP 30%",
        desc: "Lakukan pembayaran DP 30% dari harga mobil dalam 7 hari",
        action: "Bayar DP",
        icon: CreditCard,
        barColor: "bg-blue-500",
        step: 2,
    },
    MENUNGGU_PELUNASAN: {
        label: "Menunggu Pelunasan",
        desc: "Selesaikan pembayaran pelunasan untuk mendapatkan unit",
        action: "Lunasi Sekarang",
        icon: CreditCard,
        barColor: "bg-purple-500",
        step: 3,
    },
    LUNAS_SIAP_SERAH: {
        label: "Lunas · Siap Diserahkan",
        desc: "Pembayaran lunas. Koordinasikan pengambilan / pengiriman unit",
        action: "Lihat Detail",
        icon: Package,
        barColor: "bg-green-500",
        step: 4,
    },
};

const STEPS = ["Bukti Pesanan", "DP 30%", "Pelunasan", "Serah Terima"];

const CANCELLABLE_STATUSES = ["MENUNGGU_BUKTI_PESANAN", "MENUNGGU_DP", "MENUNGGU_PELUNASAN"];

export default function PesananPage() {
    const queryClient = useQueryClient();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["my-orders-active"],
        queryFn: () => getMyOrders({ limit: 50 }),
        refetchInterval: 30_000,
    });

    const cancelMutation = useMutation({
        mutationFn: (orderId: string) => cancelOrder(orderId),
        onSuccess: () => {
            toast.success("Pesanan berhasil dibatalkan.");
            queryClient.invalidateQueries({ queryKey: ["my-orders-active"] });
            queryClient.invalidateQueries({ queryKey: ["my-orders"] });
        },
        onError: (e: any) => toast.error(e.message),
    });

    const allOrders: any[] = data?.data || [];
    const activeOrders = allOrders.filter(o => ACTIVE_STATUSES.includes(o.statusOrder));
    const doneOrders = allOrders.filter(o => o.statusOrder === "SELESAI");

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            <div className="max-w-2xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Pesanan Aktif</h1>
                        <p className="text-sm text-gray-500 mt-1">Pesanan yang perlu ditindaklanjuti</p>
                    </div>
                    <Link href="/riwayat-order" className="text-sm text-[#3D3DE8] hover:underline font-medium">
                        Lihat semua riwayat →
                    </Link>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="h-48 rounded-2xl bg-white animate-pulse border border-gray-100" />
                        ))}
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <div className="flex flex-col items-center py-20 gap-3 text-gray-400">
                        <AlertCircle className="h-10 w-10" />
                        <p>Gagal memuat pesanan.</p>
                    </div>
                )}

                {/* Empty active orders */}
                {!isLoading && !isError && activeOrders.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center">
                            <CheckCircle className="h-10 w-10 text-green-500" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-gray-800 text-lg">Tidak ada pesanan aktif</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {doneOrders.length > 0
                                    ? `${doneOrders.length} pesanan sudah selesai`
                                    : "Mulai beli mobilmu sekarang"}
                            </p>
                        </div>
                        <Button asChild className="bg-[#3D3DE8] hover:bg-[#3D3DE8]/90 mt-2">
                            <Link href="/beli-mobil">Cari Mobil</Link>
                        </Button>
                    </div>
                )}

                {/* Active order cards */}
                <div className="flex flex-col gap-5">
                    {activeOrders.map((order: any) => {
                        const foto = order.mobil?.fotomobils?.[0]?.url;
                        const info = STATUS_INFO[order.statusOrder];
                        if (!info) return null;
                        const ActionIcon = info.icon;

                        // Sisa waktu (7 hari deadline DP)
                        const deadline = order.tanggalPesan
                            ? new Date(new Date(order.tanggalPesan).getTime() + 7 * 24 * 60 * 60 * 1000)
                            : null;
                        const sisaHari = deadline
                            ? Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                            : null;
                        const isUrgent = sisaHari !== null && sisaHari <= 2 && order.statusOrder !== "LUNAS_SIAP_SERAH";

                        return (
                            <div key={order.id} className={`bg-white rounded-2xl border overflow-hidden shadow-sm ${isUrgent ? "border-red-200" : "border-gray-100"}`}>
                                {/* Urgency banner */}
                                {isUrgent && (
                                    <div className="bg-red-50 border-b border-red-100 px-5 py-2 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                                        <p className="text-xs text-red-600 font-medium">
                                            {sisaHari <= 0 ? "Deadline DP sudah lewat!" : `Sisa ${sisaHari} hari untuk bayar DP`}
                                        </p>
                                    </div>
                                )}

                                <div className="p-5">
                                    {/* Car info */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-14 w-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                            <img
                                                src={foto ?? "https://images.unsplash.com/photo-1549317661-bc02c32e2a96?q=80&w=200&auto=format&fit=crop"}
                                                alt={order.mobil?.nama}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 truncate">{order.mobil?.nama}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {[order.mobil?.merek, order.mobil?.tahun].filter(Boolean).join(" · ")}
                                            </p>
                                            <p className="text-sm font-semibold text-[#3D3DE8] mt-0.5">
                                                Rp {Number(order.mobil?.harga).toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress steps */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            {STEPS.map((step, i) => {
                                                const isDone = info.step > i + 1;
                                                const isCurrent = info.step === i + 1;
                                                return (
                                                    <div key={step} className="flex flex-col items-center gap-1 flex-1">
                                                        <div className={`h-2 w-full rounded-full transition-colors ${isDone ? "bg-green-400" : isCurrent ? info.barColor : "bg-gray-100"}`} />
                                                        <span className={`text-[10px] font-medium ${isCurrent ? "text-gray-800" : isDone ? "text-green-600" : "text-gray-300"}`}>
                                                            {step}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Current action */}
                                    <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-3 mb-4">
                                        <ActionIcon className="h-4 w-4 text-gray-600 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-xs font-semibold text-gray-700">{info.label}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{info.desc}</p>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                                <Clock className="h-3 w-3" />
                                                {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                            </div>
                                            {CANCELLABLE_STATUSES.includes(order.statusOrder) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                    className="text-[11px] h-6 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 gap-1"
                                                >
                                                    <Link href={`/riwayat-order/${order.id}`}>
                                                        <XCircle className="h-3 w-3" />
                                                        Batalkan
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                        <Button asChild size="sm"
                                            className="bg-[#3D3DE8] hover:bg-[#3D3DE8]/90 text-xs h-8 gap-1.5">
                                            <Link href={`/riwayat-order/${order.id}`}>
                                                {info.action} <ChevronRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Selesai mini section */}
                {!isLoading && doneOrders.length > 0 && (
                    <div className="mt-8">
                        <p className="text-sm font-semibold text-gray-500 mb-3">Pesanan Selesai ({doneOrders.length})</p>
                        <div className="flex flex-col gap-2">
                            {doneOrders.slice(0, 3).map((order: any) => (
                                <Link key={order.id} href={`/riwayat-order/${order.id}`}
                                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all group">
                                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate text-gray-800">{order.mobil?.nama}</p>
                                        <p className="text-xs text-gray-400">{new Date(order.updatedAt).toLocaleDateString("id-ID")}</p>
                                    </div>
                                    <span className="text-xs text-[#3D3DE8] group-hover:underline">Kwitansi</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
