"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyOrderById, uploadBuktiPembayaran, uploadKtp, cancelOrder, getRekeningAdmin } from "@/service/order-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowLeft, Upload, FileText, CheckCircle, Clock, Car, Receipt, Timer, XCircle, AlertTriangle, RotateCcw, Landmark } from "lucide-react";
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

const CANCELLABLE_STATUSES = ["MENUNGGU_BUKTI_PESANAN", "MENUNGGU_DP", "MENUNGGU_PELUNASAN"];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [metode, setMetode] = useState<"TUNAI" | "TRANSFER">("TRANSFER");
  const [buktiFile, setBuktiFile] = useState<File | null>(null);
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [refundBank, setRefundBank] = useState("");
  const [refundNoRek, setRefundNoRek] = useState("");
  const [refundNamaRek, setRefundNamaRek] = useState("");
  const buktiRef = useRef<HTMLInputElement>(null);
  const ktpRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["my-order", id],
    queryFn: () => getMyOrderById(id),
    enabled: !!id,
  });

  const { data: rekeningData } = useQuery({
    queryKey: ["rekening-admin"],
    queryFn: () => getRekeningAdmin(),
  });

  const order = data?.data;

  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    if (!order?.batasWaktuDp) return;
    if (!["MENUNGGU_BUKTI_PESANAN", "MENUNGGU_DP"].includes(order.statusOrder)) return;

    const target = new Date(order.batasWaktuDp).getTime();

    // Initial calculation to avoid 1s delay
    const now = new Date().getTime();
    const distance = target - now;
    if (distance > 0) {
      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000)
      });
    } else {
      setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
    }

    const interval = setInterval(() => {
      const newNow = new Date().getTime();
      const newDistance = target - newNow;

      if (newDistance < 0) {
        clearInterval(interval);
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }

      setTimeLeft({
        d: Math.floor(newDistance / (1000 * 60 * 60 * 24)),
        h: Math.floor((newDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((newDistance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((newDistance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [order?.batasWaktuDp, order?.statusOrder]);

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

  const hasVerifiedPayment = order?.pembayarans?.some((p: any) => p.sudahDiverifikasi) ?? false;

  const cancelMutation = useMutation({
    mutationFn: () => {
      const refundInfo = hasVerifiedPayment && refundBank && refundNoRek && refundNamaRek
        ? { noRekening: refundNoRek, namaRekening: refundNamaRek, bank: refundBank }
        : undefined;
      return cancelOrder(id, refundInfo);
    },
    onSuccess: () => {
      toast.success("Pesanan berhasil dibatalkan. Uang pesanan akan dikembalikan.");
      setShowCancelConfirm(false);
      setRefundBank("");
      setRefundNoRek("");
      setRefundNamaRek("");
      invalidate();
    },
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

      {/* Countdown Timer */}
      {timeLeft && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-red-100 p-2 rounded-lg shrink-0">
            <Timer className="h-5 w-5 text-red-600 shrink-0" />
          </div>
          <div className="text-sm text-red-800 flex-1">
            <p className="font-bold mb-1 text-base text-red-900">Segera Selesaikan Pembayaran</p>
            <p className="mb-2 text-red-700">
              Batas waktu pembayaran pesanan Anda akan berakhir dalam:
            </p>
            <div className="flex items-center gap-2 font-mono font-bold text-lg text-red-900 bg-red-100/50 p-2 rounded-md border border-red-200/50 w-fit">
              <span>{timeLeft.d} hari</span>
              <span>:</span>
              <span>{timeLeft.h.toString().padStart(2, '0')} jam</span>
              <span>:</span>
              <span>{timeLeft.m.toString().padStart(2, '0')} menit</span>
              <span>:</span>
              <span>{timeLeft.s.toString().padStart(2, '0')} detik</span>
            </div>
            <p className="mt-2 text-xs text-red-600/80 font-medium">
              *Pesanan akan otomatis dibatalkan jika melewati batas waktu ini.
            </p>
          </div>
        </div>
      )}

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
              { label: "STNK", val: order.statusStnk, estimasi: order.estimasiStnkSelesai },
              { label: "BPKB", val: order.statusBpkb, estimasi: order.estimasiBpkbSelesai },
            ].map(({ label, val, estimasi }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">{label}</span>
                  <Badge variant="outline" className={`text-xs ${val === "SELESAI" ? "bg-green-100 text-green-700 border-green-300" : val === "SEDANG_DIPROSES" ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-zinc-100 text-zinc-500 border-zinc-300"}`}>
                    {val?.replace(/_/g, " ")}
                  </Badge>
                 </div>
                 {val === "SEDANG_DIPROSES" && estimasi && (
                   <div className="text-[11px] text-right text-blue-600/80 italic w-full">
                     Estimasi Selesai: {new Date(estimasi).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                   </div>
                 )}
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
              <>
                {/* Info Rekening Admin */}
                {rekeningData?.data?.length > 0 && (
                  <div className="bg-white border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Landmark className="h-4 w-4 text-blue-600" />
                      <p className="text-sm font-semibold text-blue-800">Transfer ke Rekening Berikut</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {rekeningData.data.map((rek: any) => (
                        <div key={rek.id} className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold uppercase tracking-wide text-blue-600 bg-blue-100 px-2 py-0.5 rounded">{rek.bank}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 text-sm">
                            <div>
                              <span className="text-xs text-muted-foreground">No. Rekening</span>
                              <p className="font-mono font-semibold text-blue-900 tracking-wide">{rek.noRekening}</p>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground">Atas Nama</span>
                              <p className="font-medium text-blue-900">{rek.atasNama}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">*Silakan transfer sesuai nominal yang tertera, lalu upload bukti transfer di bawah.</p>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Button type="button" variant="outline" size="sm" onClick={() => buktiRef.current?.click()} className="gap-2">
                    <Upload className="h-3.5 w-3.5" /> {buktiFile ? buktiFile.name : "Pilih Bukti Transfer"}
                  </Button>
                  <input ref={buktiRef} type="file" accept="image/*" className="hidden" onChange={(e) => setBuktiFile(e.target.files?.[0] ?? null)} />
                </div>
              </>
            )}
            <Button onClick={() => bayarMutation.mutate()} disabled={bayarMutation.isPending || (metode === "TRANSFER" && !buktiFile)} className="w-full sm:w-auto">
              {bayarMutation.isPending ? "Mengirim..." : "Kirim Bukti Pembayaran"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Batalkan Pesanan */}
      {CANCELLABLE_STATUSES.includes(order.statusOrder) && !showCancelConfirm && (
        <Card className="mb-4 border-red-200 bg-red-50/30">
          <CardContent className="pt-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-700">Ingin membatalkan pesanan?</p>
                <p className="text-xs text-red-500 mt-0.5">Uang pesanan yang sudah dibayarkan akan dikembalikan oleh admin.</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700 shrink-0"
              onClick={() => setShowCancelConfirm(true)}
            >
              Batalkan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Konfirmasi Pembatalan */}
      {showCancelConfirm && (
        <Card className="mb-4 border-red-300 bg-red-50">
          <CardContent className="pt-5">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">Konfirmasi Pembatalan</p>
                <p className="text-sm text-red-600 mt-1">
                  Apakah Anda yakin ingin membatalkan pesanan untuk <strong>{order.mobil?.nama}</strong>?
                  Pesanan ini tidak dapat dikembalikan setelah dibatalkan.
                </p>
                {order.pembayarans?.length > 0 && (
                  <p className="text-sm text-red-600 mt-2">
                    <RotateCcw className="h-3.5 w-3.5 inline -mt-0.5 mr-1" />
                    Uang pesanan sebesar <strong>Rp {Number(order.pembayarans.find((p: any) => p.tipe === "BUKTI_PESANAN")?.nominal ?? 500000).toLocaleString("id-ID")}</strong> akan diproses pengembalian oleh admin.
                  </p>
                )}
              </div>
            </div>

            {/* Form Rekening Refund */}
            {hasVerifiedPayment && (
              <div className="bg-white border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Landmark className="h-4 w-4 text-red-600" />
                  <p className="text-sm font-semibold text-red-800">Masukkan Rekening untuk Pengembalian Dana</p>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Karena sudah ada pembayaran terverifikasi, mohon isi rekening tujuan refund.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Bank</Label>
                    <Select value={refundBank} onValueChange={setRefundBank}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Pilih Bank" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BCA">BCA</SelectItem>
                        <SelectItem value="BNI">BNI</SelectItem>
                        <SelectItem value="BRI">BRI</SelectItem>
                        <SelectItem value="Mandiri">Mandiri</SelectItem>
                        <SelectItem value="BSI">BSI</SelectItem>
                        <SelectItem value="CIMB">CIMB Niaga</SelectItem>
                        <SelectItem value="Danamon">Danamon</SelectItem>
                        <SelectItem value="Permata">Permata</SelectItem>
                        <SelectItem value="Lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Nomor Rekening</Label>
                    <Input placeholder="1234567890" className="h-9 text-sm" value={refundNoRek} onChange={(e) => setRefundNoRek(e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs">Nama Pemilik Rekening</Label>
                    <Input placeholder="John Doe" className="h-9 text-sm" value={refundNamaRek} onChange={(e) => setRefundNamaRek(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowCancelConfirm(false)} disabled={cancelMutation.isPending}>
                Tidak, Kembali
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending || (hasVerifiedPayment && (!refundBank || !refundNoRek || !refundNamaRek))}
              >
                {cancelMutation.isPending ? "Membatalkan..." : "Ya, Batalkan Pesanan"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Refund untuk pesanan yang sudah dibatalkan */}
      {order.statusOrder === "DIBATALKAN" && (
        <Card className="mb-4 border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-3 flex-row items-center gap-2">
            <RotateCcw className="h-4 w-4 text-orange-600" />
            <CardTitle className="text-sm text-orange-700">Status Pengembalian Dana</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* Info Rekening Refund */}
            {order.noRekeningRefund && (
              <div className="bg-white border border-orange-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Landmark className="h-4 w-4 text-orange-600" />
                  <p className="text-sm font-medium text-orange-800">Rekening Tujuan Refund</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div><span className="text-xs text-muted-foreground">Bank</span><p className="font-medium">{order.bankRefund}</p></div>
                  <div><span className="text-xs text-muted-foreground">No. Rekening</span><p className="font-medium">{order.noRekeningRefund}</p></div>
                  <div><span className="text-xs text-muted-foreground">Atas Nama</span><p className="font-medium">{order.namaRekeningRefund}</p></div>
                </div>
              </div>
            )}
            {order.pembayarans?.filter((p: any) => p.tipe === "BUKTI_PESANAN" && p.sudahDiverifikasi).length > 0 ? (
              order.pembayarans.filter((p: any) => p.tipe === "BUKTI_PESANAN" && p.sudahDiverifikasi).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">Uang Pesanan (Rp {Number(p.nominal).toLocaleString("id-ID")})</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Dibayar pada {new Date(p.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <Badge variant="outline" className={p.isRefunded
                    ? "bg-green-100 text-green-700 border-green-300"
                    : "bg-yellow-100 text-yellow-700 border-yellow-300"
                  }>
                    {p.isRefunded
                      ? (<span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Sudah Dikembalikan</span>)
                      : (<span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Menunggu Refund</span>)
                    }
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Tidak ada pembayaran yang perlu dikembalikan (belum ada bukti pesanan yang terverifikasi).
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Riwayat Pembayaran */}
      {order.pembayarans?.length > 0 && (
        <Card className="mb-4">
          <CardHeader className="pb-3 flex-row items-center gap-2">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm">Riwayat Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {order.pembayarans.map((p: any) => (
              <div key={p.id} className="flex flex-col text-sm border rounded-lg p-3">
                <div className="flex items-center justify-between">
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
                {p.isRefunded && (
                  <div className="mt-2 pt-2 border-t border-dashed flex items-center gap-1.5 text-xs text-green-700">
                    <RotateCcw className="h-3 w-3" />
                    <span>Dana dikembalikan{p.refundedAt ? ` pada ${new Date(p.refundedAt).toLocaleDateString("id-ID")}` : ""}</span>
                    {p.buktiRefundUrl && (
                      <a href={p.buktiRefundUrl} target="_blank" rel="noopener noreferrer" className="text-[#3D3DE8] underline ml-1">
                        Lihat bukti
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
