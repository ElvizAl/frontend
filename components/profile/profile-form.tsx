"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Loader2,
  User,
  Phone,
  Mail,
  Calendar,
  Users,
  Trash2,
  Save,
  PlusCircle,
} from "lucide-react";
import { profileSchema, ProfileInput } from "@/validasi/profile-validasi";
import {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
} from "@/service/profile-service";
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
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";

export default function ProfileForm() {
  const queryClient = useQueryClient();

  const {
    data: profileResponse,
    isLoading: isLoadingGet,
    isError: isProfileMissing,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
  });

  const profileData = profileResponse?.data;
  const isProfileExists = !!profileData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      gender: undefined,
      birthDate: undefined,
    },
  });

  const genderValue = watch("gender");

  useEffect(() => {
    if (profileData) {
      reset({
        fullName: profileData.fullName ?? "",
        phone: profileData.phone ?? "",
        email: profileData.email ?? "",
        gender: profileData.gender ?? undefined,
        birthDate: profileData.birthDate
          ? new Date(profileData.birthDate).toISOString().split("T")[0]
          : undefined,
      });
    }
  }, [profileData, reset]);

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: (data: ProfileInput) =>
      isProfileExists ? updateProfile(data) : createProfile(data),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Terjadi kesalahan saat menyimpan profil");
    },
  });

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: deleteProfile,
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      reset({
        fullName: "",
        phone: "",
        email: "",
        gender: undefined,
        birthDate: undefined,
      });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Gagal menghapus profil");
    },
  });

  const onSubmit = (data: ProfileInput) => save(data);
  const isPending = isSaving || isDeleting;

  if (isLoadingGet) {
    return (
      <div className="flex h-[50vh] items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-muted-foreground text-sm">Memuat profil…</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-10 px-4 space-y-6">
      {/* Header Card */}
      <Card className="border-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg">
        <CardContent className="flex items-center gap-5 pt-6 pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/20 ring-2 ring-primary-foreground/30">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {isProfileExists ? profileData?.fullName : "Profil Pengguna"}
            </h1>
            <p className="text-sm text-primary-foreground/70 mt-0.5">
              {isProfileExists
                ? "Kelola informasi pribadi Anda"
                : "Lengkapi profil Anda untuk memulai"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">
            {isProfileExists ? "Edit Profil" : "Buat Profil"}
          </CardTitle>
          <CardDescription>
            {isProfileExists
              ? "Perbarui informasi di bawah ini lalu simpan."
              : "Isi semua informasi yang diperlukan."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Nama Lengkap */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Nama Lengkap <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                disabled={isPending}
                {...register("fullName")}
                placeholder="Masukkan nama lengkap"
                className={errors.fullName ? "border-destructive" : ""}
              />
              {errors.fullName && (
                <p className="text-xs text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                disabled={isPending}
                {...register("email")}
                placeholder="nama@email.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                No. WhatsApp / Telepon <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                disabled={isPending}
                {...register("phone")}
                placeholder="08123456789"
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <Separator />

            {/* Gender & Birthdate in 2-col grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gender */}
              <div className="space-y-1.5">
                <Label htmlFor="gender" className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  Jenis Kelamin
                </Label>
                <Select
                  disabled={isPending}
                  onValueChange={(val) =>
                    setValue("gender", val, { shouldDirty: true })
                  }
                  value={genderValue}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-xs text-destructive">{errors.gender.message}</p>
                )}
              </div>

              {/* Birth Date */}
              <div className="space-y-1.5">
                <Label htmlFor="birthDate" className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Tanggal Lahir
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  disabled={isPending}
                  {...register("birthDate")}
                  className={errors.birthDate ? "border-destructive" : ""}
                />
                {errors.birthDate && (
                  <p className="text-xs text-destructive">{errors.birthDate.message}</p>
                )}
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending || (isProfileExists && !isDirty)}
              className="w-full"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isProfileExists ? (
                <Save className="mr-2 h-4 w-4" />
              ) : (
                <PlusCircle className="mr-2 h-4 w-4" />
              )}
              {isProfileExists ? "Simpan Perubahan" : "Buat Profil"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      {isProfileExists && (
        <Card className="border-destructive/30 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-destructive">Zona Berbahaya</CardTitle>
            <CardDescription>
              Tindakan ini tidak dapat dibatalkan. Profil Anda akan dihapus secara permanen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isPending} className="w-full sm:w-auto">
                  {isDeleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Hapus Profil
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus profil?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Semua data profil Anda akan dihapus secara permanen dan tidak dapat
                    dikembalikan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => remove()}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    Ya, Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
