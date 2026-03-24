"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMyOrderById } from "@/service/order-service";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function KwitansiPage() {
    const { id } = useParams<{ id: string }>();

    const { data, isLoading } = useQuery({
        queryKey: ["my-order", id],
        queryFn: () => getMyOrderById(id),
        enabled: !!id,
    });

    const order = data?.data;
    const kwitansiPembayaran = order?.pembayarans?.find((p: any) => p.kwitansiUrl);

    if (isLoading || !order) return (
        <div className="max-w-2xl mx-auto px-4 py-10 text-muted-foreground">Memuat kwitansi...</div>
    );

    const totalDibayar = order.pembayarans
        ?.filter((p: any) => p.sudahDiverifikasi)
        .reduce((sum: number, p: any) => sum + Number(p.nominal), 0) ?? 0;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Actions (tidak ikut print) */}
            <div className="flex items-center justify-between mb-6 print:hidden">
                <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2">
                    <Link href={`/riwayat-order/${id}`}>
                        <ArrowLeft className="h-4 w-4" /> Kembali
                    </Link>
                </Button>
                <Button onClick={() => window.print()} className="gap-2">
                    <Printer className="h-4 w-4" /> Cetak Kwitansi
                </Button>
            </div>

            {/* Kwitansi Card */}
            <div id="kwitansi" className="bg-white border rounded-2xl shadow-sm p-8 font-sans print:shadow-none print:border-none print:rounded-none">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-9 w-9 rounded-full bg-[#E31818] flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 16C4 17.1046 4.89543 18 6 18H18C19.1046 18 20 17.1046 20 16V12L18.5 7H5.5L4 12V16Z" fill="white"/>
                                    <circle cx="7.5" cy="14.5" r="1.5" fill="#E31818"/>
                                    <circle cx="16.5" cy="14.5" r="1.5" fill="#E31818"/>
                                    <path d="M6 10H18" stroke="#E31818" strokeWidth="2"/>
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-[#E31818]">Glotomotif</span>
                        </div>
                        <p className="text-xs text-gray-500">Platform Jual Beli Mobil Terpercaya</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">KWITANSI</p>
                        <p className="text-xs text-gray-500 mt-1">No: {order.id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-gray-500">
                            {new Date(order.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                    </div>
                </div>

                <Separator className="mb-6" />

                {/* Pembeli */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Diterima dari</p>
                        <p className="font-semibold text-gray-900">{order.buyer?.name}</p>
                        <p className="text-sm text-gray-600">{order.buyer?.email}</p>
                        {order.buyer?.profile?.phone && (
                            <p className="text-sm text-gray-600">{order.buyer.profile.phone}</p>
                        )}
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Status Pesanan</p>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            ✓ Pesanan Selesai
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                            Tanggal Pesan: {new Date(order.tanggalPesan).toLocaleDateString("id-ID")}
                        </p>
                    </div>
                </div>

                <Separator className="mb-6" />

                {/* Detail Mobil */}
                <div className="mb-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Detail Kendaraan</p>
                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="font-bold text-gray-900 text-lg">{order.mobil?.nama}</p>
                        <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
                            {[
                                ["Merek", order.mobil?.merek],
                                ["Model", order.mobil?.model],
                                ["Tahun", order.mobil?.tahun],
                                ["Warna", order.mobil?.warna],
                                ["Transmisi", order.mobil?.transmisi === "OTOMATIS" ? "Matic" : "Manual"],
                                ["Kilometer", order.mobil?.kilometer ? `${Number(order.mobil.kilometer).toLocaleString("id-ID")} km` : "-"],
                            ].map(([label, val]) => (
                                <div key={label as string}>
                                    <p className="text-gray-500">{label}</p>
                                    <p className="font-medium text-gray-900">{val ?? "-"}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Rincian Pembayaran */}
                <div className="mb-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Rincian Pembayaran</p>
                    <div className="flex flex-col gap-2">
                        {[
                            { label: "Harga Mobil", val: Number(order.mobil?.harga) },
                            { label: "Bukti Pesanan", val: 500000 },
                            { label: "DP (30%)", val: Number(order.nominalDp) },
                            { label: "Pelunasan", val: Number(order.sisaPelunasan) },
                        ].map(({ label, val }) => (
                            <div key={label} className="flex justify-between text-sm">
                                <span className="text-gray-600">{label}</span>
                                <span className="font-medium">Rp {val.toLocaleString("id-ID")}</span>
                            </div>
                        ))}
                        <Separator className="my-2" />
                        <div className="flex justify-between font-bold text-base">
                            <span>Total Dibayar</span>
                            <span className="text-[#E31818]">Rp {totalDibayar.toLocaleString("id-ID")}</span>
                        </div>
                    </div>
                </div>

                {/* Metode Pengambilan */}
                {order.metodePengambilan && (
                    <>
                        <Separator className="mb-6" />
                        <div className="mb-6">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Pengambilan</p>
                            <p className="font-medium text-gray-900">
                                {order.metodePengambilan === "DIANTAR" ? "Diantar ke alamat" : "Ambil Sendiri"}
                            </p>
                            {order.alamatKirim && (
                                <p className="text-sm text-gray-600 mt-0.5">{order.alamatKirim}</p>
                            )}
                        </div>
                    </>
                )}

                <Separator className="mb-6" />

                {/* Footer */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs text-gray-400">Terima kasih telah berbelanja di Glotomotif.</p>
                        <p className="text-xs text-gray-400">Dokumen ini sebagai bukti transaksi yang sah.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 mb-8">Hormat kami,</p>
                        <p className="text-sm font-bold text-gray-800">Glotomotif</p>
                        <p className="text-xs text-gray-500">Tim Operasional</p>
                    </div>
                </div>
            </div>

            {/* Print styles */}
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #kwitansi, #kwitansi * { visibility: visible; }
                    #kwitansi { position: fixed; left: 0; top: 0; width: 100%; }
                }
            `}</style>
        </div>
    );
}
