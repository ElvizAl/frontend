"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyMobilSeller } from "@/service/penjualan-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Car, Eye, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
    DRAFT: { label: "Draft", className: "bg-zinc-100 text-zinc-600 border-zinc-300" },
    MENUNGGU_EVALUASI: { label: "Menunggu Evaluasi", className: "bg-yellow-100 text-yellow-700 border-yellow-300" },
    SEDANG_DIEVALUASI: { label: "Sedang Dievaluasi", className: "bg-blue-100 text-blue-700 border-blue-300" },
    DITAWARKAN: { label: "Ada Penawaran 🎉", className: "bg-purple-100 text-purple-700 border-purple-300" },
    DISETUJUI: { label: "Disetujui ✓", className: "bg-green-100 text-green-700 border-green-300" },
    DITOLAK: { label: "Ditolak", className: "bg-red-100 text-red-700 border-red-300" },
    TERSEDIA: { label: "Tersedia di Marketplace", className: "bg-emerald-100 text-emerald-700 border-emerald-300" },
    TERJUAL: { label: "Sudah Terjual 🎉", className: "bg-zinc-800 text-zinc-100 border-zinc-900" },
};

const STATUS_OPTIONS = [
    { value: "ALL", label: "Semua Status" },
    { value: "DRAFT", label: "Draft" },
    { value: "MENUNGGU_EVALUASI", label: "Menunggu Evaluasi" },
    { value: "SEDANG_DIEVALUASI", label: "Sedang Dievaluasi" },
    { value: "DITAWARKAN", label: "Ada Penawaran" },
    { value: "DISETUJUI", label: "Disetujui" },
    { value: "DITOLAK", label: "Ditolak" },
    { value: "TERSEDIA", label: "Tersedia" },
    { value: "TERJUAL", label: "Terjual" },
];

export default function MobilSayaPage() {
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const limit = 9;

    const { data: qData, isLoading } = useQuery({
        queryKey: ["my-mobil", page, limit, statusFilter],
        queryFn: () =>
            getMyMobilSeller({
                page,
                limit,
                status: statusFilter !== "ALL" ? statusFilter : undefined,
            }),
    });

    const items: any[] = qData?.data || [];
    const meta = qData?.meta || { total: 0, page: 1, totalPages: 1 };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Mobil Saya</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Pantau status pengajuan mobil yang kamu jual
                    </p>
                </div>
                <Button asChild className="gap-2 shrink-0">
                    <Link href="/seller/jual-mobil">
                        <Plus className="h-4 w-4" /> Jual Mobil Baru
                    </Link>
                </Button>
            </div>

            {/* Filter */}
            <div className="mb-6">
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUS_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                    <Car className="h-12 w-12 text-muted-foreground/40" />
                    <p className="text-muted-foreground">Belum ada pengajuan mobil.</p>
                    <Button asChild variant="outline">
                        <Link href="/seller/jual-mobil">Mulai Jual Mobil</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {items.map((item: any) => {
                        const badge = STATUS_BADGE[item.status] || { label: item.status, className: "" };
                        const primaryFoto = item.fotomobils?.find((f: any) => f.isPrimary) ?? item.fotomobils?.[0];
                        return (
                            <Link
                                key={item.id}
                                href={`/seller/mobil-saya/${item.id}`}
                                className="group rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow"
                            >
                                {/* Foto */}
                                <div className="relative aspect-video bg-muted">
                                    {primaryFoto ? (
                                        <Image
                                            src={primaryFoto.url}
                                            alt={item.nama}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width:768px)100vw,33vw"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Car className="h-10 w-10 text-muted-foreground/30" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2">
                                        <Badge variant="outline" className={`text-xs backdrop-blur-sm bg-white/80 ${badge.className}`}>
                                            {badge.label}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <p className="font-semibold truncate group-hover:text-primary transition-colors">
                                        {item.nama}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                        {[item.merek, item.model, item.tahun].filter(Boolean).join(" · ")}
                                    </p>
                                    {item.harga ? (
                                        <p className="text-sm font-medium text-primary mt-2">
                                            Rp {Number(item.harga).toLocaleString("id-ID")}
                                        </p>
                                    ) : null}
                                    <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                                        <Eye className="h-3.5 w-3.5" /> Lihat Detail
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {meta.totalPages > 1 && (
                <div className="flex items-center justify-between mt-8">
                    <p className="text-sm text-muted-foreground">
                        Halaman {meta.page} dari {meta.totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}>
                            Sebelumnya
                        </Button>
                        <Button variant="outline" size="sm"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page >= meta.totalPages}>
                            Selanjutnya
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
