"use client";

import { useState } from "react";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loginSchema, LoginInput, LoginResponse } from "@/validasi/auth-validasi";
import { loginUser } from "@/service/auth-service";
import Cookies from "js-cookie";

export default function Login() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" }
    });

    const { mutate, isPending } = useMutation({
        mutationFn: loginUser,
        onSuccess: (data: LoginResponse) => {
            toast.success(data.message || "Login berhasil!");
            Cookies.set("auth_token", data.accessToken, { expires: 7 });

            if (data.role === "ADMIN") {
                router.push("/admin/dashboard");
            } else if (data.role === "SELLER") {
                router.push("/seller/dashboard");
            } else {
                router.push("/profile");
            }
        },
        onError: (err: Error) => {
            toast.error(err.message || "Gagal melakukan login");
        }
    });

    const onSubmit = (data: LoginInput) => {
        mutate(data);
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

                        <h2 className="mb-8 text-[26px] font-semibold tracking-tight text-gray-900">
                            Sign in to your account
                        </h2>

                        <form className="w-full space-y-5 text-left" onSubmit={handleSubmit(onSubmit)}>

                            <div className="space-y-1.5">
                                <label className="block text-[15px] font-medium text-gray-900">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    disabled={isPending}
                                    {...register("email")}
                                    className={`h-11 w-full rounded-2xl bg-[#D9D9D9] px-5 text-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#4B3BFB] disabled:opacity-60
                                        ${errors.email ? "border-2 border-red-500 bg-red-50" : "border border-transparent"}`}
                                />
                                {errors.email && (
                                    <p className="text-xs font-medium text-red-500 pl-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[15px] font-medium text-gray-900">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
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
                                    <p className="text-xs font-medium text-red-500 pl-1">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="flex justify-end pt-1">
                                <a href="/forgot-password" className="text-xs text-[#4B3BFB] hover:underline">
                                    Forgot your password? Here
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="mt-2 flex items-center justify-center gap-2 h-11 w-full rounded-2xl bg-[#4B3BFB] text-[15px] font-medium text-white shadow-md transition-colors hover:bg-[#3B29E3] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isPending ? "Signing in..." : "Sign in"}
                            </button>

                            <div className="flex justify-center pt-1">
                                <a href="/register" className="text-xs text-[#4B3BFB] hover:underline">
                                    Don't have an account? Register Here
                                </a>
                            </div>

                            <div className="my-5 text-center text-[13px] font-medium text-gray-800">
                                Or
                            </div>
                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => {
                                        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
                                    }}
                                    className="group relative flex items-center justify-center gap-2 pb-1 text-sm font-medium text-gray-900 transition-all hover:text-black disabled:opacity-50"
                                >
                                    <svg viewBox="0 0 24 24" className="h-[20px] w-[20px]" aria-hidden="true">
                                        <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                                        <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                                        <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                                        <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                                    </svg>
                                    <span>Sign in with google</span>
                                    <span className="absolute bottom-0 left-0 h-[1px] w-full bg-gray-500 transition-all group-hover:bg-black"></span>
                                </button>
                            </div>

                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}
