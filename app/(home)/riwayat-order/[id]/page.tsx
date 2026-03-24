"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyOrderById, uploadBuktiPembayaran, uploadKtp } from "@/service/order-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowLeft, Upload, FileText, CheckCircle, Clock, Car, Receipt } from "lucide-react";
import Link from "next/link";

const STATUS_MAP: Record<string, { label: string; color: string; pct: number }> = {
  MENUNGGU_BUKTI_PESANAN: { label: "Menunggu Bukti Pesanan", color: "bg-yellow-100 text-yellow-700 border-yellow-300", pct: 10 },
  MENUNGGU_DP: { label: "Menunggu DP (30%)", color: "bg-blue-100 text-blue-700 border-blue-300", pct: 35 },
  MENUNGGU_PELUNASAN: { label: "Menunggu Pelunasan", color: "bg-purple-100 text-purple-700 border-purple-300", pct: 65 },
  LUNAS_SIAP_SERAH: { label: "Lunas - Siap Diserahkan", color: "bg-green-100 text-green-700 border-green-300", pct: 90 },
  SELESAI: { label: "Selesai ✓", color: "bg-emerald-100 text-emerald-700 border-emerald-300", pct: 100 },
  DIBATALKAN: { label: "Dibatalkan", color: "bg-red-100 text-red-700 border-red-300", pct: 0 },
};

const TIPE_BAYAR_MAP: Record<string, { tipe: string; label: string }> = {
  MENUNGGU_BUKTI_PESANAN: { tipe: "BUKTI_PESANAN", label: "Bukti Pesanan (Rp 500.000)" },
  MENUNGGU_DP: { tipe: "DP", label: "DP 30%" },
  MENUNGGU_PELUNASAN: { tipe: "PELUNASAN", label: "Pelunasan" },
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [metode, setMetode] = useState<"TUNAI" | "TRANSFER">("TRANSFER");
  const [buktiFile, setBuktiFile] = useState<File | null>(null);
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const buktiRef = useRef<HTMLInputElement>(null);
  const ktpRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["my-order", id],
    queryFn: () => getMyOrderById(id),
    enabled: !!id,
  });

  const order = data?.data;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["my-order", id] });
    queryClient.invalidateQueries({ queryKey: ["my-orders"] });
  };

  const bayarMutation = useMutation({
    mutationFn: () => {
      const tipeInfo = TIPE_BAYAR_MAP[order.statusOrder];
      return uploadBuktiPembayaran(id, { tipe: tipeInfo.tipe, metode }, buktiFile ?? undefined);
    },
    onSuccess: () => { toast.success("Bukti pembayaran berhasil dikirim!"); invalidate(); setBuktiFile(null); },
    onError: (e: any) => toast.error(e.message),
  });

  const ktpMutation = useMutation({
    mutationFn: () => uploadKtp(id, ktpFile!),
    onSuccess: () => { toast.success("KTP berhasil diupload!"); invalidate(); setKtpFile(null); },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading || !order) return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-muted-foreground">Memuat...</div>
  );

  const status = STATUS_MAP[order.statusOrder] ?? { label: order.statusOrder, color: "", pct: 0 };
  const tipeBayar = TIPE_BAYAR_MAP[order.statusOrder];
  const foto = order.mobil?.fotomobils?.[0]?.url;
  const lastPembayaran = order.pembayarans?.[0];
  const kwitansiUrl = order.pembayarans?.find((p: any) => p.kwitansiUrl)?.kwitansiUrl;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2">
          <Link href="/riwayat-order"><ArrowLeft className="h-4 w-4" /> Kembali</Link>
        </Button>
        {order.statusOrder === "SELESAI" && (
          <Button asChild variant="outline" className="gap-2">
            <Link href={`/riwayat-order/${id}/kwitansi`}><Receipt className="h-4 w-4" /> Lihat Kwitansi</Link>
          </Button>
        )}
      </div>

      {/* Header */}
      <div className="flex gap-4 items-start mb-6">
      <div className="relative h-20 w-28 shrink-0 rounded-xl overflow-hidden bg-muted">
          <img
            src={foto ?? "https://images.unsplash.com/photo-1549317661-bc02c32e2a96?q=80&w=400&auto=format&fit=crop"}
            alt={order.mobil?.nama ?? "Mobil"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{order.mobil?.nama}</h1>
          <p className="text-muted-foreground text-sm">{[order.mobil?.merek, order.mobil?.model, order.mobil?.tahun].filter(Boolean).join(" · ")}</p>
          <Badge variant="outline" className={`mt-2 text-xs ${status.color}`}>{status.label}</Badge>
        </div>
      </div>

      {/* Progress */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <Progress value={status.pct} className="h-2 mb-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Pesanan dibuat</span><span>DP dibayar</span><span>Lunas</span><span>Selesai</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Info Pembayaran */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Rincian Pembayaran</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Harga Mobil</span><span className="font-medium">Rp {Number(order.mobil?.harga).toLocaleString("id-ID")}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Bukti Pesanan</span><span>Rp 500.000</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">DP (30%)</span><span>Rp {Number(order.nominalDp).toLocaleString("id-ID")}</span></div>
            <Separator />
            <div className="flex justify-between font-semibold"><span>Sisa Pelunasan</span><span>Rp {Number(order.sisaPelunasan).toLocaleString("id-ID")}</span></div>
          </CardContent>
        </Card>

        {/* Status Surat */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Status Dokumen</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            {[
              { label: "STNK", val: order.statusStnk },
              { label: "BPKB", val: order.statusBpkb },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-muted-foreground">{label}</span>
                <Badge variant="outline" className={`text-xs ${val === "SELESAI" ? "bg-green-100 text-green-700 border-green-300" : val === "SEDANG_DIPROSES" ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-zinc-100 text-zinc-500 border-zinc-300"}`}>
                  {val?.replace(/_/g, " ")}
                </Badge>
              </div>
            ))}
            {order.metodePengambilan && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pengambilan</span>
                <span className="font-medium">{order.metodePengambilan === "DIANTAR" ? "Diantar" : "Ambil Sendiri"}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upload KTP (jika belum) */}
      {!order.ktpUrl && ["MENUNGGU_BUKTI_PESANAN", "MENUNGGU_DP"].includes(order.statusOrder) && (
        <Card className="mb-4 border-amber-200 bg-amber-50/50">
          <CardHeader className="pb-3 flex-row items-center gap-2">
            <FileText className="h-4 w-4 text-amber-600" />
            <CardTitle className="text-sm text-amber-700">Upload KTP</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">Upload foto copy KTP asli untuk kelengkapan dokumen.</p>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => ktpRef.current?.click()} className="gap-2">
                <Upload className="h-3.5 w-3.5" /> {ktpFile ? ktpFile.name : "Pilih File KTP"}
              </Button>
              <input ref={ktpRef} type="file" accept="image/*" className="hidden" onChange={(e) => setKtpFile(e.target.files?.[0] ?? null)} />
              {ktpFile && (
                <Button size="sm" onClick={() => ktpMutation.mutate()} disabled={ktpMutation.isPending}>
                  {ktpMutation.isPending ? "Mengupload..." : "Upload KTP"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {order.ktpUrl && (
        <div className="flex items-center gap-2 text-sm text-green-700 mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
          <CheckCircle className="h-4 w-4" /> KTP sudah diupload
        </div>
      )}

      {/* Upload Pembayaran */}
      {tipeBayar && (
        <Card className="mb-4 border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3 flex-row items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm text-blue-700">Upload Bukti Pembayaran: {tipeBayar.label}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label>Metode Pembayaran</Label>
              <Select value={metode} onValueChange={(v) => setMetode(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="TUNAI">Tunai</SelectItem>
                  <SelectItem value="TRANSFER">Transfer Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {metode === "TRANSFER" && (
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" size="sm" onClick={() => buktiRef.current?.click()} className="gap-2">
                  <Upload className="h-3.5 w-3.5" /> {buktiFile ? buktiFile.name : "Pilih Bukti Transfer"}
                </Button>
                <input ref={buktiRef} type="file" accept="image/*" className="hidden" onChange={(e) => setBuktiFile(e.target.files?.[0] ?? null)} />
              </div>
            )}
            <Button onClick={() => bayarMutation.mutate()} disabled={bayarMutation.isPending || (metode === "TRANSFER" && !buktiFile)} className="w-full sm:w-auto">
              {bayarMutation.isPending ? "Mengirim..." : "Kirim Bukti Pembayaran"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Riwayat Pembayaran */}
      {order.pembayarans?.length > 0 && (
        <Card>
          <CardHeader className="pb-3 flex-row items-center gap-2">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm">Riwayat Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {order.pembayarans.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between text-sm border rounded-lg p-3">
                <div>
                  <p className="font-medium">{p.tipe.replace(/_/g, " ")}</p>
                  <p className="text-xs text-muted-foreground">{p.metode} · {new Date(p.createdAt).toLocaleDateString("id-ID")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Rp {Number(p.nominal).toLocaleString("id-ID")}</span>
                  <Badge variant="outline" className={p.sudahDiverifikasi ? "bg-green-100 text-green-700 border-green-300 text-xs" : "bg-yellow-100 text-yellow-700 border-yellow-300 text-xs"}>
                    {p.sudahDiverifikasi ? "✓ Terverifikasi" : "Menunggu"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
