"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, updateUser, deleteUser, banUser } from "@/service/user-service";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Edit, Lock, Unlock, Trash2, ShieldAlert } from "lucide-react";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
    Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function PenggunaPage() {
    const queryClient = useQueryClient();
    
    // States
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    // Modals internal state
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // Edit Form State
    const [editForm, setEditForm] = useState({ name: "", role: "" });

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset page on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Query Data
    const { data: qData, isLoading } = useQuery({
        queryKey: ["users", page, limit, debouncedSearch],
        queryFn: () => getAllUsers({ page, limit, search: debouncedSearch }),
    });

    const users = qData?.data || [];
    const meta = qData?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

    // Mutations
    const editMutation = useMutation({
        mutationFn: (args: { id: string; data: any }) => updateUser(args.id, args.data),
        onSuccess: () => {
            toast.success("Pengguna berhasil diperbarui");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setIsEditSheetOpen(false);
        },
        onError: (err: any) => {
            toast.error(err.message || "Gagal memperbarui pengguna");
        }
    });

    const banMutation = useMutation({
        mutationFn: (args: { id: string; status: boolean }) => banUser(args.id, { status: args.status }),
        onSuccess: () => {
            toast.success("Status pengguna berhasil diubah");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setIsBanDialogOpen(false);
        },
        onError: (err: any) => {
            toast.error(err.message || "Gagal mengubah status pengguna");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteUser(id),
        onSuccess: () => {
            toast.success("Pengguna berhasil dihapus");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setIsDeleteDialogOpen(false);
        },
        onError: (err: any) => {
            toast.error(err.message || "Gagal menghapus pengguna");
        }
    });

    // Action Handlers
    const handleEditClick = (user: any) => {
        setSelectedUser(user);
        setEditForm({ name: user.name, role: user.role });
        setIsEditSheetOpen(true);
    };

    const handleBanClick = (user: any) => {
        setSelectedUser(user);
        setIsBanDialogOpen(true);
    };

    const handleDeleteClick = (user: any) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    const onSaveEdit = () => {
        if (!selectedUser) return;
        editMutation.mutate({ id: selectedUser.id, data: editForm });
    };

    const onConfirmBan = () => {
        if (!selectedUser) return;
        banMutation.mutate({ id: selectedUser.id, status: !selectedUser.onBanned });
    };

    const onConfirmDelete = () => {
        if (!selectedUser) return;
        deleteMutation.mutate(selectedUser.id);
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger className="-ml-2" />
                <Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-semibold">Manajemen Pengguna</h1>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 flex flex-col gap-6">
                {/* Search Bar */}
                <div className="flex items-center gap-2 max-w-sm">
                    <div className="relative w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama atau email..."
                            className="pl-9 w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">Memuat data...</TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">Tidak ada pengguna ditemukan.</TableCell>
                                </TableRow>
                            ) : (
                                users.map((user: any) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name || "-"}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {user.isVerified ? (
                                                    <Badge variant="outline" className="text-green-600 border-green-600">Terverifikasi</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-zinc-500 border-zinc-500">Belum Verifikasi</Badge>
                                                )}

                                                {user.onBanned && (
                                                    <Badge variant="destructive" className="flex items-center gap-1">
                                                        <ShieldAlert className="w-3 h-3" /> Banned
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEditClick(user)} title="Edit">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleBanClick(user)} title={user.onBanned ? "Unban User" : "Ban User"}>
                                                    {user.onBanned ? <Unlock className="h-4 w-4 text-green-600" /> : <Lock className="h-4 w-4 text-orange-600" />}
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(user)} title="Hapus" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Halaman {meta.page} dari {meta.totalPages} ({meta.total} total)
                    </p>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || isLoading}
                        >
                            Sebelumnya
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= meta.totalPages || isLoading}
                        >
                            Selanjutnya
                        </Button>
                    </div>
                </div>
            </main>

            {/* Edit User Sheet */}
            <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Edit Pengguna</SheetTitle>
                        <SheetDescription>
                            Ubah data profil pengguna di bawah ini. Pastikan Anda punya otoritas.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input 
                                id="name" 
                                value={editForm.name} 
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role / Peran</Label>
                            <Select 
                                value={editForm.role} 
                                onValueChange={(val) => setEditForm({ ...editForm, role: val })}
                            >
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Pilih role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BUYER">Pembeli (BUYER)</SelectItem>
                                    <SelectItem value="SELLER">Penjual (SELLER)</SelectItem>
                                    <SelectItem value="ADMIN">Admin (ADMIN)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <SheetFooter>
                        <Button variant="outline" onClick={() => setIsEditSheetOpen(false)}>Batal</Button>
                        <Button onClick={onSaveEdit} disabled={editMutation.isPending}>
                            {editMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Ban Confirmation Dialog */}
            <AlertDialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {selectedUser?.onBanned ? "Buka Blokir Pengguna?" : "Blokir Pengguna?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedUser?.onBanned 
                                ? `Apakah Anda yakin ingin memulihkan akses pengguna ${selectedUser?.name || selectedUser?.email}? Mereka akan bisa login kembali.`
                                : `Apakah Anda yakin ingin memblokir akses pengguna ${selectedUser?.name || selectedUser?.email}? Mereka tidak akan bisa login.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={(e) => {
                                e.preventDefault();
                                onConfirmBan();
                            }}
                            className={selectedUser?.onBanned ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}
                            disabled={banMutation.isPending}
                        >
                            {banMutation.isPending ? "Memproses..." : selectedUser?.onBanned ? "Ya, Pulihkan" : "Ya, Blokir"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Permanen Pengguna?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Menghapus <b>{selectedUser?.name || selectedUser?.email}</b> akan memusnahkan akun beserta seluruh datanya secara permanen dari server.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={(e) => {
                                e.preventDefault();
                                onConfirmDelete();
                            }}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? "Menghapus..." : "Hapus Permanen"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
