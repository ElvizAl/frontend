"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { verifyEmailOtpSchema, VerifyEmailOtpInput } from "@/validasi/auth-validasi";
import { verifyEmailUser, resendVerificationOtp } from "@/service/auth-service";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from "@/components/ui/input-otp";

export default function VerifyEmail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailDariUrl = searchParams.get("email") || "";

    // Timer state for resend (5 minutes = 300 seconds)
    const [timeLeft, setTimeLeft] = useState(300);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft]);

    // Format detikan ke MM:SS
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<VerifyEmailOtpInput>({
        resolver: zodResolver(verifyEmailOtpSchema),
        defaultValues: {
            email: emailDariUrl,
            code: "",
        }
    });

    const { mutate: verifyOtp, isPending } = useMutation({
        mutationFn: verifyEmailUser,
        onSuccess: () => {
            toast.success("Verifikasi berhasil! Silakan Sign In.");
            router.push("/login");
        },
        onError: (err: Error) => {
            toast.error(err.message || "Gagal melakukan verifikasi");
        }
    });

    const { mutate: resendOtp, isPending: isResending } = useMutation({
        mutationFn: resendVerificationOtp,
        onSuccess: () => {
            toast.success("Kode OTP baru telah dikirim ke email Anda!");
            setTimeLeft(300); // Reset timer ke 5 menit setelah berhasil kirim ulang
        },
        onError: (err: Error) => {
            toast.error(err.message || "Gagal mengirim ulang OTP");
        }
    });

    const onSubmit = (data: VerifyEmailOtpInput) => {
        verifyOtp(data);
    };

    const handleResend = () => {
        if (!emailDariUrl) {
            toast.error("Tidak dapat mengirim ulang, email tidak ditemukan.");
            return;
        }
        resendOtp({ email: emailDariUrl });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#D8D8D8] p-4 font-sans">
            <div className="flex w-full max-w-[900px] overflow-hidden rounded-[2rem] bg-white shadow-2xl">

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

                <div className="w-full px-8 py-14 md:w-1/2 lg:px-14">
                    <div className="mx-auto flex w-full max-w-sm flex-col items-center text-center">
                        <h1 className="mb-4 text-3xl font-bold text-[#4B3BFB]">
                            Glotomotif
                        </h1>

                        <h2 className="mb-2 text-[26px] font-semibold tracking-tight text-gray-900">
                            Verify your email
                        </h2>

                        <p className="mb-8 text-sm text-gray-500">
                            We've sent a 6-digit verification code to
                            <br />
                            <span className="font-semibold text-gray-900">{emailDariUrl || "your email"}</span>.
                        </p>

                        <form className="w-full space-y-5 text-left" onSubmit={handleSubmit(onSubmit)}>

                            {/* EMAIL HIDDEN */}
                            <input type="hidden" {...register("email")} />

                            {/* OTP CODE */}
                            <div className="space-y-3 pt-2">
                                <label className="block text-center text-[15px] font-medium text-gray-900">
                                    One-Time Password (OTP)
                                </label>

                                {/* Controller needed for generic shadcn custom inputs like InputOTP */}
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

                            <button
                                type="submit"
                                disabled={isPending}
                                className="mt-4 flex items-center justify-center gap-2 h-11 w-full rounded-2xl bg-[#4B3BFB] text-[15px] font-medium text-white shadow-md transition-colors hover:bg-[#3B29E3] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isPending ? "Verifying..." : "Verify Email"}
                            </button>

                            <div className="flex justify-center pt-2">
                                <span className="text-xs text-gray-500">
                                    Didn't receive code?{" "}
                                    {timeLeft > 0 ? (
                                        <span className="text-gray-400 font-medium ml-1">
                                            Resend in {formatTime(timeLeft)}
                                        </span>
                                    ) : (
                                        <button 
                                            type="button" 
                                            onClick={handleResend}
                                            disabled={isPending || isResending}
                                            className="text-[#4B3BFB] hover:underline font-semibold ml-1 disabled:opacity-50"
                                        >
                                            {isResending ? "Resending..." : "Resend"}
                                        </button>
                                    )}
                                </span>
                            </div>

                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}
