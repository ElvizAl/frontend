"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

const YEAR_RANGES = [
    "2015 ke bawah",
    "2016–2018",
    "2019–2020",
    "2021–2022",
    "2023 ke atas",
];

const PRICE_RANGES = [
    "< Rp100 Juta",
    "Rp100jt–Rp200jt",
    "Rp200jt–Rp350jt",
    "Rp350jt–Rp500jt",
    "> Rp500 Juta",
];

export function FilterBar() {
    const router = useRouter();
    const [q, setQ] = useState("");
    const [price, setPrice] = useState("");
    const [year, setYear] = useState("");

    const [openDropdown, setOpenDropdown] = useState<"none" | "price" | "year">("none");

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (q.trim()) params.set("q", q.trim());
        if (price) params.set("price", price);
        if (year) params.set("year", year);
        
        const qs = params.toString();
        router.push(qs ? `/beli-mobil?${qs}` : "/beli-mobil");
    };

    return (
        <div className="flex w-full items-center justify-between">
            <div className="flex flex-1 divide-x divide-gray-100">

                {/* Merek & Model */}
                <div className="flex flex-1 items-center justify-between px-6 rounded-l-full py-1 relative">
                    <div className="flex flex-col gap-0.5 w-full">
                        <span className="text-[11px] font-medium text-gray-400">Merek & Model</span>
                        <input
                            type="text"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Cetik merek/model..."
                            className="bg-transparent text-[13px] font-semibold text-gray-800 placeholder:text-gray-400 focus:outline-none w-full"
                        />
                    </div>
                </div>

                {/* Harga */}
                <div className="relative flex flex-1 cursor-pointer items-center justify-between px-6 hover:bg-gray-50/50 py-1"
                     onClick={() => setOpenDropdown(openDropdown === "price" ? "none" : "price")}>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-medium text-gray-400">Harga</span>
                        <span className="text-[13px] font-semibold text-gray-800 line-clamp-1">{price || "Pilih Harga"}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 shrink-0 ml-2" />
                    
                    {openDropdown === "price" && (
                        <div className="absolute top-12 left-0 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-2">
                            <div className="px-4 py-2 hover:bg-gray-50 text-sm font-medium cursor-pointer" onClick={() => setPrice("")}>
                                Semua Harga
                            </div>
                            {PRICE_RANGES.map(p => (
                                <div key={p} className="px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer whitespace-nowrap" onClick={() => setPrice(p)}>
                                    {p}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tahun */}
                <div className="relative flex flex-1 cursor-pointer items-center justify-between px-6 hover:bg-gray-50/50 py-1"
                     onClick={() => setOpenDropdown(openDropdown === "year" ? "none" : "year")}>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-medium text-gray-400">Tahun</span>
                        <span className="text-[13px] font-semibold text-gray-800 line-clamp-1">{year || "Pilih Tahun"}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 shrink-0 ml-2" />

                    {openDropdown === "year" && (
                        <div className="absolute top-12 left-0 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-2">
                            <div className="px-4 py-2 hover:bg-gray-50 text-sm font-medium cursor-pointer" onClick={() => setYear("")}>
                                Semua Tahun
                            </div>
                            {YEAR_RANGES.map(y => (
                                <div key={y} className="px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer whitespace-nowrap" onClick={() => setYear(y)}>
                                    {y}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            <div className="pl-3 pr-1">
                <button onClick={handleSearch} className="flex h-12 items-center justify-center rounded-full bg-[#3D3DE8] px-8 text-sm font-bold text-white transition-colors hover:bg-[#C91414]">
                    Temukan
                </button>
            </div>
            
            {/* Click outside to close dropdowns */}
            {openDropdown !== "none" && (
                <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown("none")} />
            )}
        </div>
    );
}
