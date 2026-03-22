"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";

export default function OAuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            Cookies.set("auth_token", token, { expires: 7 });
            toast.success("Login berhasil!");
            router.replace("/profile");
        } else {
            toast.error("Login dengan Google gagal. Silakan coba lagi.");
            router.replace("/login");
        }
    }, [searchParams, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#D8D8D8]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-[#4B3BFB]" />
                <p className="text-sm font-medium text-gray-600">Signing you in...</p>
            </div>
        </div>
    );
}
