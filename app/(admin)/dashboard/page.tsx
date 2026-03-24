"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/service/order-service";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, ShoppingCart, Users, TrendingUp, ArrowRight, PackageCheck, CarFront } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const { data, isLoading } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: getDashboardStats,
        refetchInterval: 60_000,
    });

    const stats = data?.data;

    const cards = [
        {
            title: "Total Mobil",
            value: stats?.totalMobil ?? 0,
            sub: `${stats?.mobilTersedia ?? 0} tersedia`,
            icon: CarFront,
            color: "text-blue-600",
            bg: "bg-blue-50",
            href: "/dashboard/data-mobil",
        },
        {
            title: "Total Pesanan",
            value: stats?.totalOrder ?? 0,
            sub: `${stats?.orderSelesai ?? 0} selesai`,
            icon: ShoppingCart,
            color: "text-purple-600",
            bg: "bg-purple-50",
            href: "/dashboard/pesanan",
        },
        {
            title: "Total Pengguna",
            value: stats?.totalUser ?? 0,
            sub: "aktif terdaftar",
            icon: Users,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            href: "/dashboard/pengguna",
        },
        {
            title: "Total Revenue",
            value: `Rp ${(stats?.totalRevenue ?? 0).toLocaleString("id-ID")}`,
            sub: "dari pembayaran terverifikasi",
            icon: TrendingUp,
            color: "text-orange-600",
            bg: "bg-orange-50",
            href: "/dashboard/pesanan",
        },
    ];

    const quickLinks = [
        { label: "Pengajuan Seller", href: "/dashboard/mobil", icon: Car, desc: "Evaluasi mobil yang diajukan seller" },
        { label: "Katalog Mobil", href: "/dashboard/data-mobil", icon: CarFront, desc: "Tambah & kelola stok mobil" },
        { label: "Pesanan Masuk", href: "/dashboard/pesanan", icon: PackageCheck, desc: "Verifikasi pembayaran buyer" },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger className="-ml-2" />
                <Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-semibold">Dashboard</h1>
            </header>

            <main className="flex-1 p-6 flex flex-col gap-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {cards.map((c) => (
                        <Link key={c.title} href={c.href}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                                <CardHeader className="pb-2 flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {c.title}
                                    </CardTitle>
                                    <div className={`${c.bg} p-2 rounded-lg`}>
                                        <c.icon className={`h-4 w-4 ${c.color}`} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <div className="h-8 w-24 rounded bg-muted animate-pulse" />
                                    ) : (
                                        <p className="text-2xl font-bold">{c.value}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Quick Links */}
                <div>
                    <h2 className="text-base font-semibold mb-3">Aksi Cepat</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {quickLinks.map((ql) => (
                            <Link key={ql.label} href={ql.href}>
                                <Card className="hover:shadow-md transition-all group cursor-pointer border-dashed hover:border-solid hover:border-primary/30">
                                    <CardContent className="flex items-center gap-4 pt-5 pb-5">
                                        <div className="bg-muted rounded-xl p-3">
                                            <ql.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm">{ql.label}</p>
                                            <p className="text-xs text-muted-foreground leading-snug">{ql.desc}</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform" />
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}