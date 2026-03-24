"use client";

import { useState } from "react";
import { EyeOff, Eye, Loader2, Store } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { registerSchema, RegisterInput } from "@/validasi/auth-validasi";
import { registerSeller } from "@/service/auth-service";

export default function RegisterSeller() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: "", email: "", password: "" }
    });

    const { mutate, isPending } = useMutation({
        mutationFn: registerSeller,
        onSuccess: (_data, variables) => {
            toast.success("Registrasi seller berhasil! Silakan verifikasi email Anda.");
            router.push(`/verify-email?email=${variables.email}`);
        },
        onError: (err: any) => {
            toast.error(err.message || "Gagal melakukan registrasi seller");
        }
    });

    const onSubmit = (data: RegisterInput) => mutate(data);

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#D8D8D8] p-4 font-sans">
            <div className="flex w-full max-w-[900px] overflow-hidden rounded-[2rem] bg-white shadow-2xl">

                {/* Left Panel */}
                <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-sky-200 md:flex">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: 'url("/sky.jpg")' }}
                    ></div>
                    {/* Seller badge overlay */}
                    <div className="absolute top-6 left-6 z-20 flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-md backdrop-blur-sm">
                        <Store size={16} className="text-[#4B3BFB]" />
                        <span className="text-sm font-semibold text-[#4B3BFB]">Seller Account</span>
                    </div>
                    <img
                        src="/mobil.png"
                        alt="Car"
                        className="relative z-10 w-[110%] max-w-[120%] -ml-2 drop-shadow-2xl"
                    />
                </div>

                {/* Right Panel */}
                <div className="w-full px-8 py-14 md:w-1/2 lg:px-14">
                    <div className="mx-auto flex w-full max-w-sm flex-col items-center text-center">
                        <h1 className="mb-1 text-3xl font-bold text-[#4B3BFB]">
                            Glotomotif
                        </h1>
                        <div className="mb-3 flex items-center gap-1.5 rounded-full bg-[#4B3BFB]/10 px-3 py-1 text-xs font-semibold text-[#4B3BFB]">
                            <Store size={12} />
                            Daftar sebagai Seller
                        </div>

                        <h2 className="mb-2 text-[22px] font-semibold tracking-tight text-gray-900">
                            Buat Akun Seller
                        </h2>
                        <p className="mb-7 text-sm text-gray-500">
                            Mulai jual kendaraan Anda di platform kami
                        </p>

                        <form className="w-full space-y-5 text-left" onSubmit={handleSubmit(onSubmit)}>

                            {/* USERNAME */}
                            <div className="space-y-1.5">
                                <label className="block text-[15px] font-medium text-gray-900">
                                    Nama Toko / Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Showroom ABC"
                                    disabled={isPending}
                                    {...register("name")}
                                    className={`h-11 w-full rounded-2xl bg-[#D9D9D9] px-5 text-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#4B3BFB] disabled:opacity-60
                                        ${errors.name ? "border-2 border-red-500 bg-red-50" : "border border-transparent"}`}
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-500 pl-1">{errors.name.message}</p>
                                )}
                            </div>

                            {/* EMAIL */}
                            <div className="space-y-1.5">
                                <label className="block text-[15px] font-medium text-gray-900">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    disabled={isPending}
                                    {...register("email")}
                                    className={`h-11 w-full rounded-2xl bg-[#D9D9D9] px-5 text-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#4B3BFB] disabled:opacity-60
                                        ${errors.email ? "border-2 border-red-500 bg-red-50" : "border border-transparent"}`}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500 pl-1">{errors.email.message}</p>
                                )}
                            </div>

                            {/* PASSWORD */}
                            <div className="space-y-1.5">
                                <label className="block text-[15px] font-medium text-gray-900">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Minimal 6 karakter"
                                        disabled={isPending}
                                        {...register("password")}
                                        className={`h-11 w-full rounded-2xl bg-[#D9D9D9] pl-5 pr-12 text-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#4B3BFB] disabled:opacity-60
                                            ${errors.password ? "border-2 border-red-500 bg-red-50" : "border border-transparent"}`}
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
                                {errors.password && (
                                    <p className="text-xs text-red-500 pl-1">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Infobox */}
                            <div className="rounded-xl border border-[#4B3BFB]/20 bg-[#4B3BFB]/5 px-4 py-3 text-xs text-[#4B3BFB]">
                                <p className="font-medium mb-0.5">Keuntungan menjadi Seller:</p>
                                <ul className="list-disc list-inside space-y-0.5 text-[#4B3BFB]/80">
                                    <li>Pasang iklan kendaraan tanpa batas</li>
                                    <li>Jangkau ribuan pembeli potensial</li>
                                    <li>Kelola listing dengan dashboard mudah</li>
                                </ul>
                            </div>

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                disabled={isPending}
                                className="mt-2 flex items-center justify-center gap-2 h-11 w-full rounded-2xl bg-[#4B3BFB] text-[15px] font-medium text-white shadow-md transition-colors hover:bg-[#3B29E3] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isPending ? "Mendaftar..." : "Daftar sebagai Seller"}
                            </button>

                            <div className="flex items-center justify-between pt-1 text-xs">
                                <a href="/register" className="text-gray-500 hover:underline">
                                    Daftar sebagai Pembeli?
                                </a>
                                <a href="/login" className="text-[#4B3BFB] hover:underline">
                                    Sudah punya akun? Login
                                </a>
                            </div>

                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}
