"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { SlidersHorizontal, Search, ShoppingCart, User, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { SearchBar } from "./navbar/search-bar";
import { FilterBar } from "./navbar/filter-bar";

export default function Navbar() {
    const [activeTab, setActiveTab] = useState<"search" | "filter">("search");
    const [isMounted, setIsMounted] = useState(false);
    const { user, isLoading, isLoggedIn } = useAuth();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const initials = user?.name
        ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        : user?.email?.[0]?.toUpperCase() ?? "U";

    return (
        <div className="relative font-sans">
            {/* Top Navbar */}
            <div className="flex h-[88px] w-full items-center justify-between bg-white px-6 md:px-12 lg:px-24">
                {/* Left - Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E31818]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 16C4 17.1046 4.89543 18 6 18H18C19.1046 18 20 17.1046 20 16V12L18.5 7H5.5L4 12V16Z" fill="white" />
                            <circle cx="7.5" cy="14.5" r="1.5" fill="#E31818" />
                            <circle cx="16.5" cy="14.5" r="1.5" fill="#E31818" />
                            <path d="M6 10H18" stroke="#E31818" strokeWidth="2" />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-[#E31818]">
                        Glotomotif
                    </span>
                </Link>

                {/* Center - Filter & Search Toggles */}
                <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-8">
                    <button
                        onClick={() => setActiveTab("filter")}
                        className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === "filter" ? "text-black" : "text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        <SlidersHorizontal className="h-6 w-6" strokeWidth={2.5} />
                        <span className="text-[11px] font-semibold uppercase tracking-wider">
                            Filter
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab("search")}
                        className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === "search" ? "text-black" : "text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        <Search className="h-6 w-6" strokeWidth={2.5} />
                        <span className="text-[11px] font-semibold uppercase tracking-wider">
                            Search
                        </span>
                    </button>
                </div>

                {/* Right - Links & Icons */}
                <div className="flex items-center gap-6 text-sm font-medium text-black">
                    <div className="ml-2 h-5 w-[1px] bg-gray-200"></div>
                    <div className="flex items-center gap-5">
                        <Link href="/cart" className="relative hover:text-gray-600">
                            <ShoppingCart className="h-6 w-6" strokeWidth={2.5} />
                            <span className="absolute -right-1.5 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#E31818] text-[10px] font-bold text-white">
                                0
                            </span>
                        </Link>
                        {!isMounted ? (
                            <div className="h-6 w-6" />
                        ) : isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                        ) : isLoggedIn && user ? (
                            <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                <div className="flex">
                                    <p className="text-base font-medium text-gray-800">Halo, {user.name}</p>
                                </div>
                                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#E31818] text-xs font-bold text-white">
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        initials
                                    )}
                                </div>
                            </Link>
                        ) : (
                            <Link href="/login" className="hover:text-gray-600">
                                <User className="h-6 w-6" strokeWidth={2.5} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Search/Filter Bar Container */}
            <div className="absolute left-0 right-0 top-[88px] flex justify-center w-full px-6 z-10">
                <div className="w-full max-w-[1000px] rounded-full bg-white px-4 py-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] transition-all duration-300">
                    {activeTab === "search" ? <SearchBar /> : <FilterBar />}
                </div>
            </div>
        </div>
    );
}
