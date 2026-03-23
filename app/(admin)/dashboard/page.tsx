"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function DashboardPage() {
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove("auth_token");
        router.push("/");
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
                <div className="flex items-center gap-4">
                    <SidebarTrigger className="-ml-2" />
                    <Separator orientation="vertical" className="h-6" />
                    <h1 className="text-xl font-semibold">Dashboard</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Keluar
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-6">
                <div className="h-full rounded-xl bg-muted/50 w-full min-h-[500px]" />
            </main>
        </div>
    );
}