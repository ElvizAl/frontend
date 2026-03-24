"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPenjualan, type PenjualanStatus } from "@/service/admin-penjualan-service";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Search, Eye } from "lucide-react";
import Link from "next/link";

function relativeTime(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} menit lalu`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} jam lalu`;
    const days = Math.floor(hrs / 24);
    return `${days} hari lalu`;
}


const STATUS_OPTIONS: { value: string; label: string }[] = [
    { value: "ALL", label: "Semua Status" },
    { value: "DRAFT", label: "Draft" },
    { value: "MENUNGGU_EVALUASI", label: "Menunggu Evaluasi" },
    { value: "SEDANG_DIEVALUASI", label: "Sedang Dievaluasi" },
    { value: "DITAWARKAN", label: "Ditawarkan" },
    { value: "DISETUJUI", label: "Disetujui" },
    { value: "DITOLAK", label: "Ditolak" },
    { value: "TERSEDIA", label: "Tersedia" },
];

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
    DRAFT: { label: "Draft", className: "bg-zinc-100 text-zinc-600 border-zinc-300" },
    MENUNGGU_EVALUASI: { label: "Menunggu Evaluasi", className: "bg-yellow-100 text-yellow-700 border-yellow-300" },
    SEDANG_DIEVALUASI: { label: "Sedang Dievaluasi", className: "bg-blue-100 text-blue-700 border-blue-300" },
    DITAWARKAN: { label: "Ditawarkan", className: "bg-purple-100 text-purple-700 border-purple-300" },
    DISETUJUI: { label: "Disetujui", className: "bg-green-100 text-green-700 border-green-300" },
    DITOLAK: { label: "Ditolak", className: "bg-red-100 text-red-700 border-red-300" },
    TERSEDIA: { label: "Tersedia", className: "bg-emerald-100 text-emerald-700 border-emerald-300" },
};

export default function AdminMobilPage() {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(t);
    }, [search]);

    const { data: qData, isLoading } = useQuery({
        queryKey: ["admin-penjualan", page, limit, statusFilter, debouncedSearch],
        queryFn: () =>
            getAllPenjualan({
                page,
                limit,
                status: statusFilter !== "ALL" ? statusFilter : undefined,
            }),
    });

    const items = qData?.data || [];
    const meta = qData?.meta || { total: 0, page: 1, totalPages: 1 };

    // client-side search filter (by nama / seller name)
    const filtered = debouncedSearch
        ? items.filter((m: any) =>
            m.nama?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            m.seller?.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
        : items;

    return (
        <div className="flex flex-col min-h-screen">
            <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger className="-ml-2" />
                <Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-semibold">Data Mobil Seller</h1>
            </header>

            <main className="flex-1 p-6 flex flex-col gap-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama mobil / seller..."
                            className="pl-9 w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter status" />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Mobil</TableHead>
                                <TableHead>Seller</TableHead>
                                <TableHead>Harga</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Diajukan</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        Memuat data...
                                    </TableCell>
                                </TableRow>
                            ) : filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        Tidak ada data pengajuan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((item: any) => {
                                    const badge = STATUS_BADGE[item.status] || { label: item.status, className: "" };
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                <div>{item.nama}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {item.merek} {item.model} {item.tahun}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">{item.seller?.name || "-"}</div>
                                                <div className="text-xs text-muted-foreground">{item.seller?.email}</div>
                                            </TableCell>
                                            <TableCell>
                                                {item.harga
                                                    ? `Rp ${Number(item.harga).toLocaleString("id-ID")}`
                                                    : <span className="text-muted-foreground text-sm">-</span>}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${badge.className}`}
                                                >
                                                    {badge.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {item.createdAt ? relativeTime(item.createdAt) : "-"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/dashboard/mobil/${item.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Halaman {meta.page} dari {meta.totalPages} ({meta.total} total pengajuan)
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline" size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1 || isLoading}
                        >
                            Sebelumnya
                        </Button>
                        <Button
                            variant="outline" size="sm"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page >= meta.totalPages || isLoading}
                        >
                            Selanjutnya
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
