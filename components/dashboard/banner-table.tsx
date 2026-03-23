"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Images,
  Hash,
  AlignLeft,
} from "lucide-react";
import { bannerSchema, BannerInput } from "@/validasi/banner-validasi";
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  BannerData,
} from "@/service/banner-service";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BannerTable() {
  const queryClient = useQueryClient();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<BannerData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const isEditMode = !!selectedBanner;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<BannerInput>({
    resolver: zodResolver(bannerSchema),
    defaultValues: { judul: "", urutan: "0", isActive: "true" },
  });

  const isActiveValue = watch("isActive");

  const { data: res, isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: getAllBanners,
  });

  const banners = res?.data ?? [];

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: (data: BannerInput) =>
      isEditMode
        ? updateBanner(selectedBanner.id, data, selectedFile ?? undefined)
        : createBanner(data, selectedFile!),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      closeSheet();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Terjadi kesalahan");
    },
  });

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: deleteBanner,
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Gagal menghapus banner");
    },
  });

  const openAddSheet = () => {
    setSelectedBanner(null);
    setSelectedFile(null);
    setFileError("");
    reset({ judul: "", urutan: "0", isActive: "true" });
    setIsSheetOpen(true);
  };

  const openEditSheet = (banner: BannerData) => {
    setSelectedBanner(banner);
    setSelectedFile(null);
    setFileError("");
    reset({
      judul: banner.judul,
      urutan: banner.urutan.toString(),
      isActive: banner.isActive ? "true" : "false",
    });
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setSelectedBanner(null);
    setSelectedFile(null);
    setFileError("");
    reset();
  };

  const onSubmit = (data: BannerInput) => {
    if (!isEditMode && !selectedFile) {
      setFileError("Gambar banner wajib diunggah");
      return;
    }
    setFileError("");
    save(data);
  };

  const isPending = isSaving || isDeleting;

  return (
    <>
      {/* Banner List Card */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-lg">Daftar Banner</CardTitle>
            <CardDescription>
              Kelola gambar promosi yang tampil di halaman utama.
            </CardDescription>
          </div>
          <Button onClick={openAddSheet} className="gap-2">
            <Plus className="h-4 w-4" /> Tambah Banner
          </Button>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[90px]">Gambar</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Urutan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : banners.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Belum ada banner. Klik "Tambah Banner" untuk mulai.
                    </TableCell>
                  </TableRow>
                ) : (
                  banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <div className="w-16 h-9 rounded overflow-hidden bg-muted flex items-center justify-center shrink-0">
                          {banner.imageUrl ? (
                            <img
                              src={banner.imageUrl}
                              alt={banner.judul}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{banner.judul}</TableCell>
                      <TableCell>{banner.urutan}</TableCell>
                      <TableCell>
                        <Badge
                          variant={banner.isActive ? "default" : "secondary"}
                        >
                          {banner.isActive ? "Aktif" : "Non-Aktif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditSheet(banner)}
                            disabled={isPending}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={isPending}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus banner ini?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Banner <b>{banner.judul}</b> akan dihapus
                                  secara permanen beserta file gambarnya. Tindakan
                                  ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => remove(banner.id)}
                                  className="bg-destructive text-white hover:bg-destructive/90"
                                >
                                  {isDeleting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : null}
                                  Ya, Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Form Sheet (Add/Edit) */}
      <Sheet open={isSheetOpen} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Images className="h-5 w-5" />
              {isEditMode ? "Edit Banner" : "Tambah Banner Baru"}
            </SheetTitle>
            <SheetDescription>
              {isEditMode
                ? "Perbarui informasi banner. Biarkan field gambar kosong jika tidak ingin menggantinya."
                : "Isi semua informasi dan unggah gambar banner baru."}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
            {/* Judul */}
            <div className="space-y-1.5">
              <Label htmlFor="judul" className="flex items-center gap-2">
                <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" />
                Judul Banner <span className="text-destructive">*</span>
              </Label>
              <Input
                id="judul"
                placeholder="Cth: Promo Tukar Tambah"
                disabled={isPending}
                {...register("judul")}
                className={errors.judul ? "border-destructive" : ""}
              />
              {errors.judul && (
                <p className="text-xs text-destructive">{errors.judul.message}</p>
              )}
            </div>

            {/* File Gambar */}
            <div className="space-y-1.5">
              <Label htmlFor="image" className="flex items-center gap-2">
                <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                Gambar Banner{" "}
                {!isEditMode ? (
                  <span className="text-destructive">*</span>
                ) : (
                  <span className="text-muted-foreground text-xs">(opsional)</span>
                )}
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                disabled={isPending}
                onChange={(e) => {
                  setSelectedFile(e.target.files?.[0] || null);
                  if (e.target.files?.[0]) setFileError("");
                }}
                className={fileError ? "border-destructive" : ""}
              />
              {fileError && (
                <p className="text-xs text-destructive">{fileError}</p>
              )}
              {selectedFile && (
                <p className="text-xs text-muted-foreground">
                  Terpilih:{" "}
                  <span className="text-green-600">{selectedFile.name}</span>
                </p>
              )}
            </div>

            <Separator />

            {/* Urutan */}
            <div className="space-y-1.5">
              <Label htmlFor="urutan" className="flex items-center gap-2">
                <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                Urutan Tampil
              </Label>
              <Input
                id="urutan"
                type="number"
                min="0"
                disabled={isPending}
                {...register("urutan")}
                className={errors.urutan ? "border-destructive" : ""}
              />
              {errors.urutan && (
                <p className="text-xs text-destructive">{errors.urutan.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-2">
                Status Tayang <span className="text-destructive">*</span>
              </Label>
              <Select
                disabled={isPending}
                value={isActiveValue}
                onValueChange={(val) =>
                  setValue("isActive", val as "true" | "false", {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger className={errors.isActive ? "border-destructive" : ""}>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Aktif (Tampil)</SelectItem>
                  <SelectItem value="false">Non-Aktif (Sembunyikan)</SelectItem>
                </SelectContent>
              </Select>
              {errors.isActive && (
                <p className="text-xs text-destructive">{errors.isActive.message}</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeSheet}
                className="flex-1"
                disabled={isPending}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isPending || (isEditMode && !isDirty && !selectedFile)}
                className="flex-1"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isEditMode ? "Simpan Perubahan" : "Tambahkan"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
