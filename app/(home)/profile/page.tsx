"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, LogOut, Mail, ShieldCheck, BadgeCheck } from "lucide-react";
import { getMe, logout } from "@/service/user-service";

export default function ProfilePage() {
    const router = useRouter();

    const { data: user, isLoading, isError } = useQuery({
        queryKey: ["me"],
        queryFn: getMe,
        retry: false,
    });

    useEffect(() => {
        if (isError) {
            toast.error("Sesi habis, silakan login kembali");
            logout();
            router.replace("/login");
        }
    }, [isError, router]);

    const handleLogout = () => {
        logout();
        toast.success("Berhasil logout");
        router.replace("/login");
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#D8D8D8]">
                <Loader2 className="h-10 w-10 animate-spin text-[#4B3BFB]" />
            </div>
        );
    }

    const initials = user?.name
        ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        : user?.email?.[0]?.toUpperCase() ?? "U";

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#D8D8D8] p-4 font-sans">
            <div className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl">

                {/* Header */}
                <div className="flex flex-col items-center bg-[#4B3BFB] px-8 py-10">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-bold text-[#4B3BFB] shadow-lg overflow-hidden">
                        {user?.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt="Avatar"
                                className="h-20 w-20 rounded-full object-cover"
                            />
                        ) : (
                            <span>{initials}</span>
                        )}
                    </div>
                    <h1 className="mt-4 text-xl font-bold text-white">
                        {user?.name ?? "Pengguna"}
                    </h1>
                    <span className="mt-1 rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium text-white">
                        {user?.role ?? "USER"}
                    </span>
                </div>

                {/* Info */}
                <div className="space-y-4 px-8 py-6">
                    <div className="flex items-center gap-3 rounded-2xl bg-[#F4F4FF] px-5 py-4">
                        <Mail className="h-5 w-5 shrink-0 text-[#4B3BFB]" />
                        <div className="min-w-0">
                            <p className="text-xs text-gray-400">Email</p>
                            <p className="truncate text-sm font-medium text-gray-800">{user?.email ?? "-"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-[#F4F4FF] px-5 py-4">
                        <ShieldCheck className="h-5 w-5 shrink-0 text-[#4B3BFB]" />
                        <div>
                            <p className="text-xs text-gray-400">Role</p>
                            <p className="text-sm font-medium text-gray-800">{user?.role ?? "-"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-[#F4F4FF] px-5 py-4">
                        <BadgeCheck className="h-5 w-5 shrink-0 text-[#4B3BFB]" />
                        <div>
                            <p className="text-xs text-gray-400">Status Verifikasi</p>
                            <p className="text-sm font-medium text-gray-800">
                                {user?.isVerified ? "✅ Terverifikasi" : "❌ Belum Terverifikasi"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Logout */}
                <div className="px-8 pb-8">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-red-100 bg-red-50 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-100"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
