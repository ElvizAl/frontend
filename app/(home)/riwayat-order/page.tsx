"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "@/service/order-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBag, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  MENUNGGU_BUKTI_PESANAN: { label: "Menunggu Bukti Pesanan", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  MENUNGGU_DP: { label: "Menunggu DP", color: "bg-blue-100 text-blue-700 border-blue-300" },
  MENUNGGU_PELUNASAN: { label: "Menunggu Pelunasan", color: "bg-purple-100 text-purple-700 border-purple-300" },
  LUNAS_SIAP_SERAH: { label: "Lunas - Siap Diserahkan", color: "bg-green-100 text-green-700 border-green-300" },
  SELESAI: { label: "Selesai ✓", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  DIBATALKAN: { label: "Dibatalkan", color: "bg-red-100 text-red-700 border-red-300" },
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
  const meta = data?.meta || { totalPages: 1, total: 0 };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Riwayat Pesanan</h1>
          <p className="text-sm text-muted-foreground mt-1">Pantau status pembelian mobilmu</p>
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua</SelectItem>
            {Object.entries(STATUS_MAP).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {isError && <p className="text-center text-muted-foreground py-16">Gagal memuat pesanan.</p>}

      {!isLoading && !isError && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
          <ShoppingBag className="h-12 w-12 opacity-30" />
          <p>Belum ada pesanan.</p>
          <Button asChild variant="outline"><Link href="/">Cari Mobil</Link></Button>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {orders.map((order: any) => {
          const foto = order.mobil?.fotomobils?.[0]?.url;
          const status = STATUS_MAP[order.statusOrder] ?? { label: order.statusOrder, color: "" };
          return (
            <Link key={order.id} href={`/riwayat-order/${order.id}`}
              className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-all group">
              <div className="relative h-20 w-28 shrink-0 rounded-lg overflow-hidden bg-muted">
                {foto ? <Image src={foto} alt="" fill className="object-cover" sizes="112px" /> :
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">No foto</div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{order.mobil?.nama}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {order.mobil?.merek} · {order.mobil?.tahun}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className={`text-xs ${status.color}`}>{status.label}</Badge>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <p className="text-sm font-semibold text-primary">
                  Rp {Number(order.mobil?.harga).toLocaleString("id-ID")}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(order.createdAt).toLocaleDateString("id-ID")}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>

      {meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Sebelumnya</Button>
          <span className="text-sm self-center text-muted-foreground">Hal {page} / {meta.totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>Selanjutnya</Button>
        </div>
      )}
    </div>
  );
}
