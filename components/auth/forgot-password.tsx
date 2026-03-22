"use client";

import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/validasi/auth-validasi";
import { forgotPassword } from "@/service/auth-service";

export default function ForgotPassword() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: forgotPassword,
        onSuccess: (_data, variables) => {
            toast.success("Kode OTP telah dikirim ke email Anda!");
            router.push(`/reset-password?email=${encodeURIComponent(variables.email)}`);
        },
        onError: (err: Error) => {
            toast.error(err.message || "Gagal mengirim kode reset password");
        },
    });

    const onSubmit = (data: ForgotPasswordInput) => {
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
                            Forgot Password
                        </h2>

                        <p className="mb-8 text-sm text-gray-500">
                            Enter your email address and we'll send you a code to reset your password.
                        </p>

                        <form className="w-full space-y-5 text-left" onSubmit={handleSubmit(onSubmit)}>

                            <div className="space-y-1.5">
                                <label className="block text-[15px] font-medium text-gray-900">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    disabled={isPending}
                                    {...register("email")}
                                    placeholder="your@email.com"
                                    className={`h-11 w-full rounded-2xl bg-[#D9D9D9] px-5 text-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#4B3BFB] disabled:opacity-60
                                        ${errors.email ? "border-2 border-red-500 bg-red-50" : "border border-transparent"}`}
                                />
                                {errors.email && (
                                    <p className="text-xs font-medium text-red-500 pl-1">{errors.email.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="mt-2 flex items-center justify-center gap-2 h-11 w-full rounded-2xl bg-[#4B3BFB] text-[15px] font-medium text-white shadow-md transition-colors hover:bg-[#3B29E3] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isPending ? "Sending..." : "Send Reset Code"}
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
