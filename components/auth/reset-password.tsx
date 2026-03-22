"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { resetPasswordSchema, ResetPasswordInput } from "@/validasi/auth-validasi";
import { resetPassword } from "@/service/auth-service";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from "@/components/ui/input-otp";

export default function ResetPassword() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailDariUrl = searchParams.get("email") || "";

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: emailDariUrl,
            code: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            toast.success("Password berhasil diubah! Silakan Sign In.");
            router.push("/login");
        },
        onError: (err: Error) => {
            toast.error(err.message || "Gagal mereset password");
        },
    });

    const onSubmit = (data: ResetPasswordInput) => {
        mutate(data);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#D8D8D8] p-4 font-sans">
            <div className="flex w-full max-w-[900px] overflow-hidden rounded-[2rem] bg-white shadow-2xl">

                {/* Left decorative panel */}
                <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-sky-200 md:flex">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: 'url("/sky.jpg")' }}
                    ></div>
                    <img
                        src="/mobil.png"
                        alt="Car"
                        className="relative z-10 w-[110%] max-w-[120%] -ml-2 drop-shadow-2xl"
                    />
                </div>

                {/* Right form panel */}
                <div className="w-full px-8 py-14 md:w-1/2 lg:px-14">
                    <div className="mx-auto flex w-full max-w-sm flex-col items-center text-center">
                        <h1 className="mb-4 text-3xl font-bold text-[#4B3BFB]">
                            Glotomotif
                        </h1>

                        <h2 className="mb-2 text-[26px] font-semibold tracking-tight text-gray-900">
                            Reset Password
                        </h2>

                        <p className="mb-8 text-sm text-gray-500">
                            Enter the 6-digit code sent to{" "}
                            <span className="font-semibold text-gray-900">{emailDariUrl || "your email"}</span>{" "}
                            and your new password.
                        </p>

                        <form className="w-full space-y-5 text-left" onSubmit={handleSubmit(onSubmit)}>

                            {/* Hidden email */}
                            <input type="hidden" {...register("email")} />

                            {/* OTP */}
                            <div className="space-y-3 pt-2">
                                <label className="block text-center text-[15px] font-medium text-gray-900">
                                    One-Time Password (OTP)
                                </label>
                                <div className="flex justify-center">
                                    <Controller
                                        control={control}
                                        name="code"
                                        render={({ field }) => (
                                            <InputOTP maxLength={6} disabled={isPending} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} className="w-12 h-14 text-lg border-gray-300 focus:border-[#4B3BFB] focus:ring-[#4B3BFB] bg-[#D9D9D9] focus:bg-white transition-all rounded-l-xl" />
                                                    <InputOTPSlot index={1} className="w-12 h-14 text-lg border-gray-300 focus:border-[#4B3BFB] focus:ring-[#4B3BFB] bg-[#D9D9D9] focus:bg-white transition-all" />
                                                    <InputOTPSlot index={2} className="w-12 h-14 text-lg border-gray-300 focus:border-[#4B3BFB] focus:ring-[#4B3BFB] bg-[#D9D9D9] focus:bg-white transition-all" />
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={3} className="w-12 h-14 text-lg border-gray-300 focus:border-[#4B3BFB] focus:ring-[#4B3BFB] bg-[#D9D9D9] focus:bg-white transition-all" />
                                                    <InputOTPSlot index={4} className="w-12 h-14 text-lg border-gray-300 focus:border-[#4B3BFB] focus:ring-[#4B3BFB] bg-[#D9D9D9] focus:bg-white transition-all" />
                                                    <InputOTPSlot index={5} className="w-12 h-14 text-lg border-gray-300 focus:border-[#4B3BFB] focus:ring-[#4B3BFB] bg-[#D9D9D9] focus:bg-white transition-all rounded-r-xl" />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        )}
                                    />
                                </div>
                                {errors.code && (
                                    <p className="text-xs font-medium text-red-500 text-center">{errors.code.message}</p>
                                )}
                            </div>

                            {/* New Password */}
                            <div className="space-y-1.5">
                                <label className="block text-[15px] font-medium text-gray-900">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        disabled={isPending}
                                        {...register("newPassword")}
                                        className={`h-11 w-full rounded-2xl bg-[#D9D9D9] pl-5 pr-12 text-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#4B3BFB] disabled:opacity-60
                                            ${errors.newPassword ? "border-2 border-red-500 bg-red-50" : "border border-transparent"}`}
                                    />
                                    <button
                                        type="button"
                                        disabled={isPending}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4B3BFB] transition-colors hover:text-[#3223c9] disabled:opacity-50"
                                    >
                                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                                {errors.newPassword && (
                                    <p className="text-xs font-medium text-red-500 pl-1">{errors.newPassword.message}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5">
                                <label className="block text-[15px] font-medium text-gray-900">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        disabled={isPending}
                                        {...register("confirmPassword")}
                                        className={`h-11 w-full rounded-2xl bg-[#D9D9D9] pl-5 pr-12 text-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#4B3BFB] disabled:opacity-60
                                            ${errors.confirmPassword ? "border-2 border-red-500 bg-red-50" : "border border-transparent"}`}
                                    />
                                    <button
                                        type="button"
                                        disabled={isPending}
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4B3BFB] transition-colors hover:text-[#3223c9] disabled:opacity-50"
                                    >
                                        {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-xs font-medium text-red-500 pl-1">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="mt-4 flex items-center justify-center gap-2 h-11 w-full rounded-2xl bg-[#4B3BFB] text-[15px] font-medium text-white shadow-md transition-colors hover:bg-[#3B29E3] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isPending ? "Resetting..." : "Reset Password"}
                            </button>

                            <div className="flex justify-center pt-1">
                                <a href="/login" className="text-xs text-[#4B3BFB] hover:underline">
                                    Back to Sign In
                                </a>
                            </div>

                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}
