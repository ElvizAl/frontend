"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllMobil, deleteMobil } from "@/service/admin-mobil-service";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const STATUS_MAP: Record<string, string> = {
    TERSEDIA: "bg-green-100 text-green-700 border-green-300",
    TERJUAL: "bg-zinc-100 text-zinc-500 border-zinc-300",
};

export default function AdminDataMobilPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [deleteTarget, setDeleteTarget] = useState<any>(null);

    const { data: qData, isLoading } = useQuery({
        queryKey: ["admin-mobil", page, limit, statusFilter],
        queryFn: () =>
            getAllMobil({
                page, limit,
                status: statusFilter !== "ALL" ? statusFilter : undefined,
            }),
    });

    const items: any[] = qData?.data || [];
    const meta = qData?.meta || { total: 0, page: 1, totalPages: 1 };

    const filtered = search
        ? items.filter((m: any) =>
            m.nama?.toLowerCase().includes(search.toLowerCase()) ||
            m.merek?.toLowerCase().includes(search.toLowerCase())
        )
        : items;

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteMobil(id),
        onSuccess: () => {
            toast.success("Mobil berhasil dihapus");
            queryClient.invalidateQueries({ queryKey: ["admin-mobil"] });
            setDeleteTarget(null);
        },
        onError: (e: any) => toast.error(e.message),
    });

    return (
        <div className="flex flex-col min-h-screen">
            <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger className="-ml-2" />
                <Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-semibold">Data Mobil (Katalog)</h1>
                <Button asChild className="ml-auto gap-2" size="sm">
                    <Link href="/dashboard/data-mobil/tambah">
                        <Plus className="h-4 w-4" /> Tambah Mobil
                    </Link>
                </Button>
            </header>

            <main className="flex-1 p-6 flex flex-col gap-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama / merek..."
                            className="pl-9 w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Semua Status</SelectItem>
                            <SelectItem value="TERSEDIA">Tersedia</SelectItem>
                            <SelectItem value="TERJUAL">Terjual</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Foto</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Merek / Model</TableHead>
                                <TableHead>Harga</TableHead>
                                <TableHead>Status</TableHead>
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
                                        Belum ada data mobil.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((item: any) => {
                                    const primaryFoto = item.fotomobils?.find((f: any) => f.isPrimary) ?? item.fotomobils?.[0];
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="relative h-12 w-20 rounded-md overflow-hidden bg-muted">
                                                    <img
                                                        src={primaryFoto?.url ?? "https://images.unsplash.com/photo-1549317661-bc02c32e2a96?q=80&w=200&auto=format&fit=crop"}
                                                        alt={item.nama}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{item.nama}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {[item.merek, item.model, item.tahun].filter(Boolean).join(" · ")}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                Rp {Number(item.harga).toLocaleString("id-ID")}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`text-xs ${STATUS_MAP[item.status] ?? ""}`}>
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" asChild title="Detail & Foto">
                                                        <Link href={`/dashboard/data-mobil/${item.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild title="Edit">
                                                        <Link href={`/dashboard/data-mobil/${item.id}/edit`}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost" size="icon"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => setDeleteTarget(item)}
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
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
                        Halaman {meta.page} dari {meta.totalPages} ({meta.total} total)
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1 || isLoading}>
                            Sebelumnya
                        </Button>
                        <Button variant="outline" size="sm"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page >= meta.totalPages || isLoading}>
                            Selanjutnya
                        </Button>
                    </div>
                </div>
            </main>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Mobil?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hapus <b>{deleteTarget?.nama}</b> secara permanen? Semua foto terkait juga akan dihapus.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleteMutation.isPending}
                            onClick={(e) => { e.preventDefault(); deleteMutation.mutate(deleteTarget.id); }}
                        >
                            {deleteMutation.isPending ? "Menghapus..." : "Hapus Permanen"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
