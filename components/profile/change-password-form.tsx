"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import { changePasswordSchema, ChangePasswordInput } from "@/validasi/profile-validasi";
import { changePassword } from "@/service/profile-service";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function PasswordField({
  id,
  label,
  disabled,
  error,
  registration,
}: {
  id: string;
  label: string;
  disabled: boolean;
  error?: string;
  registration: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="flex items-center gap-2">
        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          disabled={disabled}
          className={`pr-10 ${error ? "border-destructive" : ""}`}
          placeholder="••••••••"
          {...registration}
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setShow((s) => !s)}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: changePassword,
    onSuccess: (res) => {
      toast.success(res.message);
      reset();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Gagal mengubah password");
    },
  });

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <KeyRound className="h-4 w-4" />
          Ubah Password
        </CardTitle>
        <CardDescription>
          Masukkan password lama Anda, lalu tentukan password baru.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
          <PasswordField
            id="currentPassword"
            label="Password Lama"
            disabled={isPending}
            error={errors.currentPassword?.message}
            registration={register("currentPassword")}
          />

          <PasswordField
            id="newPassword"
            label="Password Baru"
            disabled={isPending}
            error={errors.newPassword?.message}
            registration={register("newPassword")}
          />

          <PasswordField
            id="confirmPassword"
            label="Konfirmasi Password Baru"
            disabled={isPending}
            error={errors.confirmPassword?.message}
            registration={register("confirmPassword")}
          />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Password Baru
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
