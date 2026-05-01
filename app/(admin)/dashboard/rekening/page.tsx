"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRekeningAdmin, addRekeningAdmin, deleteRekeningAdmin } from "@/service/order-service";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Landmark, Plus, Trash2, Building2, AlertTriangle } from "lucide-react";

const BANK_OPTIONS = [
    "BCA", "BNI", "BRI", "Mandiri", "BSI", "CIMB Niaga", "Danamon", "Permata", "Bank DKI", "BTPN", "OCBC", "Lainnya"
];

export default function RekeningAdminPage() {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [bank, setBank] = useState("");
    const [noRekening, setNoRekening] = useState("");
    const [atasNama, setAtasNama] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["rekening-admin"],
        queryFn: getRekeningAdmin,
    });

    const rekeningList: any[] = data?.data || [];

    const addMutation = useMutation({
        mutationFn: () => addRekeningAdmin({ bank, noRekening, atasNama }),
        onSuccess: () => {
            toast.success("Rekening berhasil ditambahkan!");
            queryClient.invalidateQueries({ queryKey: ["rekening-admin"] });
            resetForm();
            setOpen(false);
        },
        onError: (e: any) => toast.error(e.message),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteRekeningAdmin(id),
        onSuccess: () => {
            toast.success("Rekening berhasil dihapus");
            queryClient.invalidateQueries({ queryKey: ["rekening-admin"] });
            setDeleteId(null);
        },
        onError: (e: any) => toast.error(e.message),
    });

    const resetForm = () => {
        setBank("");
        setNoRekening("");
        setAtasNama("");
    };

    const handleAdd = () => {
        if (!bank || !noRekening || !atasNama) {
            toast.error("Semua field wajib diisi");
            return;
        }
        addMutation.mutate();
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger className="-ml-2" />
                <Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-semibold">Rekening Bank Perusahaan</h1>
            </header>

            <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Kelola rekening bank yang akan ditampilkan kepada buyer saat memilih metode Transfer Bank.
                        </p>
                    </div>
                    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 shrink-0">
                                <Plus className="h-4 w-4" /> Tambah Rekening
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Landmark className="h-5 w-5" /> Tambah Rekening Baru
                                </DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Bank</Label>
                                    <Select value={bank} onValueChange={setBank}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Bank" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {BANK_OPTIONS.map((b) => (
                                                <SelectItem key={b} value={b}>{b}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Nomor Rekening</Label>
                                    <Input
                                        placeholder="Contoh: 1234567890"
                                        value={noRekening}
                                        onChange={(e) => setNoRekening(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Atas Nama</Label>
                                    <Input
                                        placeholder="Contoh: PT Glotomotif Indonesia"
                                        value={atasNama}
                                        onChange={(e) => setAtasNama(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Batal</Button>
                                </DialogClose>
                                <Button onClick={handleAdd} disabled={addMutation.isPending}>
                                    {addMutation.isPending ? "Menyimpan..." : "Simpan Rekening"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* List */}
                {isLoading ? (
                    <div className="grid gap-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
                        ))}
                    </div>
                ) : rekeningList.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="bg-muted rounded-full p-4 mb-4">
                                <Landmark className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="font-semibold text-lg mb-1">Belum Ada Rekening</p>
                            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                                Tambahkan rekening bank perusahaan agar buyer bisa transfer saat memilih metode pembayaran Transfer Bank.
                            </p>
                            <Button variant="outline" className="gap-2" onClick={() => setOpen(true)}>
                                <Plus className="h-4 w-4" /> Tambah Rekening Pertama
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {rekeningList.map((rek: any) => (
                            <Card key={rek.id} className="overflow-hidden">
                                <div className="flex items-stretch">
                                    {/* Bank Icon Side */}
                                    <div className="w-20 sm:w-24 bg-primary/5 flex flex-col items-center justify-center border-r p-3">
                                        <Building2 className="h-6 w-6 text-primary mb-1" />
                                        <span className="text-xs font-bold text-primary text-center uppercase leading-tight">
                                            {rek.bank}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <CardContent className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                                    {rek.bank}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    Ditambahkan {new Date(rek.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-1">
                                                <div>
                                                    <span className="text-xs text-muted-foreground">Nomor Rekening</span>
                                                    <p className="font-mono font-semibold text-base tracking-wide">{rek.noRekening}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-muted-foreground">Atas Nama</span>
                                                    <p className="font-medium text-base">{rek.atasNama}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delete Button */}
                                        <Dialog open={deleteId === rek.id} onOpenChange={(v) => !v && setDeleteId(null)}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="shrink-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => setDeleteId(rek.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle className="flex items-center gap-2 text-red-700">
                                                        <AlertTriangle className="h-5 w-5" /> Hapus Rekening?
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <p className="text-sm text-muted-foreground">
                                                    Rekening <strong>{rek.bank} - {rek.noRekening}</strong> a.n <strong>{rek.atasNama}</strong> akan dihapus permanen. Buyer tidak akan lagi melihat rekening ini saat memilih Transfer Bank.
                                                </p>
                                                <DialogFooter className="mt-4">
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Batal</Button>
                                                    </DialogClose>
                                                    <Button
                                                        variant="destructive"
                                                        onClick={() => deleteMutation.mutate(rek.id)}
                                                        disabled={deleteMutation.isPending}
                                                    >
                                                        {deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus"}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </CardContent>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Info */}
                {rekeningList.length > 0 && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg border text-sm text-muted-foreground">
                        <p className="font-medium text-foreground mb-1">💡 Tips</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>Rekening yang ditambahkan akan otomatis aktif dan ditampilkan ke buyer</li>
                            <li>Pastikan nomor rekening dan atas nama sudah benar sebelum menyimpan</li>
                            <li>Hapus rekening yang sudah tidak digunakan agar tidak membingungkan buyer</li>
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
}