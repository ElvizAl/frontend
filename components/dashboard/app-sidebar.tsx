"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CarFront,
    ShoppingCart,
    CreditCard,
    Images,
    Users,
    ChevronLeft,
    ClipboardList,
    FileText,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mainMenuItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Katalog Mobil",
        url: "/dashboard/data-mobil",
        icon: CarFront,
    },
    {
        title: "Pengajuan Seller",
        url: "/dashboard/mobil",
        icon: ClipboardList,
    },
];

const transactionItems = [
    {
        title: "Pesanan / Order",
        url: "/dashboard/pesanan",
        icon: ShoppingCart,
    },
];

const managementItems = [
    {
        title: "Banner Promosi",
        url: "/dashboard/banner",
        icon: Images,
    },
    {
        title: "Laporan Penjualan",
        url: "/dashboard/laporan",
        icon: FileText,
    },
];

const systemItems = [
    {
        title: "Pengguna",
        url: "/dashboard/pengguna",
        icon: Users,
    },
];

interface AppSidebarProps {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export function AppSidebar({ user }: AppSidebarProps) {
    const pathname = usePathname();
    const { state, toggleSidebar } = useSidebar();
    const isCollapsed = state === "collapsed";

    const initials = user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U";

    return (
        <Sidebar collapsible="icon" className="border-r bg-background">
            <SidebarHeader className="border-b px-4 py-3">
                <div className="flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                            EZ
                        </div>
                        {!isCollapsed && (
                            <span className="font-semibold text-lg">ADMIN</span>
                        )}
                    </Link>
                    {!isCollapsed && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={toggleSidebar}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2">
                {/* MENU UTAMA */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Menu Utama
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        tooltip={item.title}
                                        className={cn(
                                            "transition-colors",
                                            pathname === item.url &&
                                            "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                        )}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* TRANSAKSI & PEMBAYARAN */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Transaksi & Pembayaran
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {transactionItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        tooltip={item.title}
                                        className={cn(
                                            "transition-colors",
                                            pathname === item.url &&
                                            "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                        )}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* MANAJEMEN */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Manajemen
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {managementItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        tooltip={item.title}
                                        className={cn(
                                            "transition-colors",
                                            pathname === item.url &&
                                            "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                        )}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* SISTEM */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Sistem
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {systemItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        tooltip={item.title}
                                        className={cn(
                                            "transition-colors",
                                            pathname === item.url &&
                                            "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                        )}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
                <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted transition-colors"
                >
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">
                                {user?.name || "User"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {user?.email || "user@example.com"}
                            </p>
                        </div>
                    )}
                </Link>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}