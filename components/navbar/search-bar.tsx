"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/beli-mobil?q=${encodeURIComponent(query.trim())}`);
        } else {
            router.push("/beli-mobil");
        }
    };

    return (
        <div className="flex w-full items-center justify-between pl-6 pr-1">
            <Search className="h-4 w-4 text-gray-400 shrink-0 mr-3" />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Cari merek, model, atau tahun..."
                className="w-full bg-transparent text-[15px] text-gray-800 placeholder:text-gray-600 focus:outline-none"
            />
            <button
                onClick={handleSearch}
                className="flex h-12 items-center justify-center rounded-full bg-[#E31818] px-8 text-sm font-bold text-white transition-colors hover:bg-[#C91414]"
            >
                Temukan
            </button>
        </div>
    );
}
