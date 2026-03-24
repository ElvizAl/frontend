"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "@/service/order-service";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    MENUNGGU_BUKTI_PESANAN: { label: "Menunggu Bukti Pesanan", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
    MENUNGGU_DP: { label: "Menunggu DP", color: "bg-blue-100 text-blue-700 border-blue-300" },
    MENUNGGU_PELUNASAN: { label: "Menunggu Pelunasan", color: "bg-purple-100 text-purple-700 border-purple-300" },
    LUNAS_SIAP_SERAH: { label: "Lunas - Siap Serah", color: "bg-green-100 text-green-700 border-green-300" },
    SELESAI: { label: "Selesai", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
    DIBATALKAN: { label: "Dibatalkan", color: "bg-red-100 text-red-700 border-red-300" },
};

export default function AdminPesananPage() {
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading } = useQuery({
        queryKey: ["admin-orders", statusFilter, page],
        queryFn: () => getAllOrders({ status: statusFilter !== "ALL" ? statusFilter : undefined, page, limit }),
    });

    const orders: any[] = data?.data || [];
    const meta = data?.meta || { totalPages: 1, total: 0, page: 1 };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger className="-ml-2" />
                <Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-semibold">Manajemen Pesanan</h1>
            </header>

            <main className="flex-1 p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">{meta.total} total pesanan</p>
                    <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                        <SelectTrigger className="w-[220px]"><SelectValue placeholder="Filter status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Semua Status</SelectItem>
                            {Object.entries(STATUS_MAP).map(([k, v]) => (
                                <SelectItem key={k} value={k}>{v.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mobil</TableHead>
                                <TableHead>Pembeli</TableHead>
                                <TableHead>Harga</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={6} className="text-center h-24 text-muted-foreground">Memuat...</TableCell></TableRow>
                            ) : orders.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-center h-24 text-muted-foreground">Belum ada pesanan.</TableCell></TableRow>
                            ) : (
                                orders.map((order: any) => {
                                    const foto = order.mobil?.fotomobils?.[0]?.url;
                                    const status = STATUS_MAP[order.statusOrder] ?? { label: order.statusOrder, color: "" };
                                    return (
                                        <TableRow key={order.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative h-10 w-16 rounded overflow-hidden bg-muted shrink-0">
                                                        {foto && <Image src={foto} alt="" fill className="object-cover" sizes="64px" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm truncate max-w-[160px]">{order.mobil?.nama}</p>
                                                        <p className="text-xs text-muted-foreground">{order.mobil?.tahun}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm font-medium">{order.buyer?.name}</p>
                                                <p className="text-xs text-muted-foreground">{order.buyer?.email}</p>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium">
                                                Rp {Number(order.mobil?.harga).toLocaleString("id-ID")}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`text-xs ${status.color}`}>{status.label}</Badge>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {new Date(order.createdAt).toLocaleDateString("id-ID")}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/dashboard/pesanan/${order.id}`}><Eye className="h-4 w-4" /></Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Halaman {meta.page} dari {meta.totalPages}</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Sebelumnya</Button>
                        <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>Selanjutnya</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
