"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SlidersHorizontal, Search, ShoppingCart, User, Loader2, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { SearchBar } from "./navbar/search-bar";
import { FilterBar } from "./navbar/filter-bar";

export default function Navbar() {
    const [activeTab, setActiveTab] = useState<"search" | "filter">("search");
    const [isMounted, setIsMounted] = useState(false);
    const { user, isLoading, isLoggedIn } = useAuth();
    const pathname = usePathname();

    const isHomePage = pathname === "/";

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const initials = user?.name
        ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        : user?.email?.[0]?.toUpperCase() ?? "U";

    return (
        <div className="relative font-sans">
            <div className="flex h-[72px] w-full items-center justify-between bg-white px-6 md:px-12 lg:px-24 border-b border-gray-100">

                {/* Left - Logo */}
                <Link href="/" className="flex items-center gap-2 shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E31818]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 16C4 17.1046 4.89543 18 6 18H18C19.1046 18 20 17.1046 20 16V12L18.5 7H5.5L4 12V16Z" fill="white" />
                            <circle cx="7.5" cy="14.5" r="1.5" fill="#E31818" />
                            <circle cx="16.5" cy="14.5" r="1.5" fill="#E31818" />
                            <path d="M6 10H18" stroke="#E31818" strokeWidth="2" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[#E31818]">Glotomotif</span>
                </Link>

                {/* Center — berbeda berdasarkan halaman */}
                {isHomePage ? (
                    // GAMBAR 1: Halaman utama — Toggle Filter & Search
                    <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-8">
                        <button
                            onClick={() => setActiveTab("filter")}
                            className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === "filter" ? "text-black" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            <SlidersHorizontal className="h-6 w-6" strokeWidth={2.5} />
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Filter</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("search")}
                            className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === "search" ? "text-black" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            <Search className="h-6 w-6" strokeWidth={2.5} />
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Search</span>
                        </button>
                    </div>
                ) : (
                    // GAMBAR 2: Halaman lain — Search pill + Beli Mobil + Jual Mobil
                    <div className="flex flex-1 items-center justify-center mx-8 gap-6">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-full px-5 py-2.5 w-full max-w-sm">
                            <Search className="h-4 w-4 text-gray-400 shrink-0" />
                            <input
                                type="text"
                                placeholder="Mau cari apa?"
                                className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
                            />
                        </div>
                        <Link href="/beli-mobil" className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-black transition-colors whitespace-nowrap">
                            Beli Mobil <ChevronDown className="h-4 w-4 text-gray-500" />
                        </Link>
                        <Link href="/jual-mobil" className="text-sm font-semibold text-gray-700 hover:text-black transition-colors whitespace-nowrap">
                            Jual Mobil
                        </Link>
                    </div>
                )}

                {/* Right - Icons & User */}
                <div className="flex items-center gap-5 shrink-0">
                    <Link href="/cart" className="relative hover:text-gray-600">
                        <ShoppingCart className="h-6 w-6" strokeWidth={2.5} />
                        <span className="absolute -right-1.5 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#E31818] text-[10px] font-bold text-white">0</span>
                    </Link>
                    {!isMounted ? (
                        <div className="h-6 w-6" />
                    ) : isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    ) : isLoggedIn && user ? (
                        <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <p className="text-sm font-medium text-gray-800">Halo, {user.name}</p>
                            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#E31818] text-xs font-bold text-white">
                                {user.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                                ) : initials}
                            </div>
                        </Link>
                    ) : (
                        <Link href="/login" className="hover:text-gray-600">
                            <User className="h-6 w-6" strokeWidth={2.5} />
                        </Link>
                    )}
                </div>
            </div>

            {/* Search/Filter Bar — HANYA di halaman utama */}
            {isHomePage && (
                <div className="absolute left-0 right-0 top-[72px] flex justify-center w-full px-6 z-10">
                    <div className="w-full max-w-[1000px] rounded-full bg-white px-4 py-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
                        {activeTab === "search" ? <SearchBar /> : <FilterBar />}
                    </div>
                </div>
            )}
        </div>
    );
}
