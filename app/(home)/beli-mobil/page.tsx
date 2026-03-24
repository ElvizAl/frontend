"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { CarCard } from "@/components/car-card";
import { X, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchMobilCards() {
    const res = await fetch(`${BASE_URL}/mobil/cards`);
    if (!res.ok) throw new Error("Gagal memuat data mobil");
    return res.json();
}

const toTransmisi = (t?: string): "Otomatis" | "Manual" =>
    t === "OTOMATIS" ? "Otomatis" : "Manual";

const YEAR_RANGES = [
    { label: "2015 ke bawah", min: 0, max: 2015 },
    { label: "2016–2018", min: 2016, max: 2018 },
    { label: "2019–2020", min: 2019, max: 2020 },
    { label: "2021–2022", min: 2021, max: 2022 },
    { label: "2023 ke atas", min: 2023, max: 9999 },
];

const PRICE_RANGES = [
    { label: "< Rp100 Juta", min: 0, max: 100_000_000 },
    { label: "Rp100jt–Rp200jt", min: 100_000_000, max: 200_000_000 },
    { label: "Rp200jt–Rp350jt", min: 200_000_000, max: 350_000_000 },
    { label: "Rp350jt–Rp500jt", min: 350_000_000, max: 500_000_000 },
    { label: "> Rp500 Juta", min: 500_000_000, max: Infinity },
];

const TRANSMISI = ["Semua", "OTOMATIS", "MANUAL"];

function BeliMobilContent() {
    const searchParams = useSearchParams();
    const initialQ = searchParams.get("q") ?? "";

    const [q, setQ] = useState(initialQ);
    const [search, setSearch] = useState(initialQ);
    const [yearRange, setYearRange] = useState<typeof YEAR_RANGES[0] | null>(null);
    const [priceRange, setPriceRange] = useState<typeof PRICE_RANGES[0] | null>(null);
    const [transmisi, setTransmisi] = useState("Semua");
    const [sort, setSort] = useState("Rekomendasi");
    const [showYearMenu, setShowYearMenu] = useState(false);
    const [showPriceMenu, setShowPriceMenu] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["mobil-cards"],
        queryFn: fetchMobilCards,
        staleTime: 60_000,
    });

    const rawCars: any[] = data?.data || data || [];

    const cars = useMemo(() => {
        let arr = [...rawCars];
        if (search) arr = arr.filter(c =>
            c.nama?.toLowerCase().includes(search.toLowerCase()) ||
            c.merek?.toLowerCase().includes(search.toLowerCase()) ||
            c.model?.toLowerCase().includes(search.toLowerCase()) ||
            String(c.tahun).includes(search)
        );
        if (yearRange) arr = arr.filter(c => (c.tahun ?? 0) >= yearRange.min && (c.tahun ?? 0) <= yearRange.max);
        if (priceRange) arr = arr.filter(c => Number(c.harga) >= priceRange.min && Number(c.harga) < priceRange.max);
        if (transmisi !== "Semua") arr = arr.filter(c => c.transmisi === transmisi);
        if (sort === "Harga Terendah") arr.sort((a, b) => a.harga - b.harga);
        else if (sort === "Harga Tertinggi") arr.sort((a, b) => b.harga - a.harga);
        else if (sort === "Tahun Terbaru") arr.sort((a, b) => (b.tahun ?? 0) - (a.tahun ?? 0));
        return arr;
    }, [rawCars, search, yearRange, priceRange, transmisi, sort]);

    const hasFilter = !!search || yearRange || priceRange || transmisi !== "Semua";
    const clearAll = () => { setSearch(""); setQ(""); setYearRange(null); setPriceRange(null); setTransmisi("Semua"); };

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Beli Mobil Bekas</h1>
                    <p className="text-gray-500 mt-1">Temukan mobil impianmu dari ribuan pilihan terpercaya</p>
                </div>

                {/* Search + Filter Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                    {/* Search input */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5">
                            <Search className="h-4 w-4 text-gray-400 shrink-0" />
                            <input
                                type="text"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && setSearch(q)}
                                placeholder="Cari merek, model, atau tahun..."
                                className="flex-1 bg-transparent text-sm focus:outline-none"
                            />
                            {q && <button onClick={() => { setQ(""); setSearch(""); }} className="text-gray-400 hover:text-gray-600"><X className="h-3.5 w-3.5" /></button>}
                        </div>
                        <Button onClick={() => setSearch(q)} className="bg-[#E31818] hover:bg-[#C91414] rounded-xl px-6">Cari</Button>
                    </div>

                    {/* Filter chips row */}
                    <div className="flex flex-wrap items-center gap-2">
                        {hasFilter && (
                            <button onClick={clearAll} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#E31818] text-white hover:bg-[#c01414]">
                                Hapus Filter <X className="h-3 w-3" />
                            </button>
                        )}
                        {search && <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs border bg-white text-gray-700">"{search}" <button onClick={() => { setSearch(""); setQ(""); }}><X className="h-3 w-3" /></button></span>}
                        {yearRange && <button onClick={() => setYearRange(null)} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs border bg-white text-gray-700">{yearRange.label} <X className="h-3 w-3" /></button>}
                        {priceRange && <button onClick={() => setPriceRange(null)} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs border bg-white text-gray-700">{priceRange.label} <X className="h-3 w-3" /></button>}

                        <div className="w-px h-5 bg-gray-200 mx-1" />

                        {/* Tahun */}
                        <div className="relative">
                            <button onClick={() => { setShowYearMenu(p => !p); setShowPriceMenu(false); }}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${yearRange ? "border-[#3D3DE8] text-[#3D3DE8] bg-[#3D3DE8]/5" : "border-gray-200 text-gray-600 bg-white hover:border-gray-300"}`}>
                                Tahun
                            </button>
                            {showYearMenu && (
                                <div className="absolute z-20 top-full mt-1 left-0 bg-white border rounded-xl shadow-lg py-1 min-w-[180px]">
                                    {YEAR_RANGES.map(r => (
                                        <button key={r.label} onClick={() => { setYearRange(r); setShowYearMenu(false); }}
                                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${yearRange?.label === r.label ? "text-[#3D3DE8] font-semibold" : "text-gray-700"}`}>
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Harga */}
                        <div className="relative">
                            <button onClick={() => { setShowPriceMenu(p => !p); setShowYearMenu(false); }}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${priceRange ? "border-[#3D3DE8] text-[#3D3DE8] bg-[#3D3DE8]/5" : "border-gray-200 text-gray-600 bg-white hover:border-gray-300"}`}>
                                Harga
                            </button>
                            {showPriceMenu && (
                                <div className="absolute z-20 top-full mt-1 left-0 bg-white border rounded-xl shadow-lg py-1 min-w-[220px]">
                                    {PRICE_RANGES.map(r => (
                                        <button key={r.label} onClick={() => { setPriceRange(r); setShowPriceMenu(false); }}
                                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${priceRange?.label === r.label ? "text-[#3D3DE8] font-semibold" : "text-gray-700"}`}>
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Transmisi */}
                        {TRANSMISI.slice(1).map(t => (
                            <button key={t} onClick={() => setTransmisi(transmisi === t ? "Semua" : t)}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${transmisi === t ? "border-[#3D3DE8] text-[#3D3DE8] bg-[#3D3DE8]/5" : "border-gray-200 text-gray-600 bg-white hover:border-gray-300"}`}>
                                {t === "OTOMATIS" ? "Matic" : "Manual"}
                            </button>
                        ))}

                        <div className="w-px h-5 bg-gray-200 mx-1" />

                        {/* Sort */}
                        {["Rekomendasi", "Harga Terendah", "Harga Tertinggi", "Tahun Terbaru"].map(s => (
                            <button key={s} onClick={() => setSort(s)}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${sort === s ? "border-[#E31818] text-[#E31818] bg-[#E31818]/5" : "border-gray-200 text-gray-600 bg-white hover:border-gray-300"}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Click outside */}
                {(showYearMenu || showPriceMenu) && <div className="fixed inset-0 z-10" onClick={() => { setShowYearMenu(false); setShowPriceMenu(false); }} />}

                {/* Result count */}
                {!isLoading && !isError && (
                    <p className="text-sm text-gray-500 mb-4">{cars.length} mobil ditemukan</p>
                )}

                {/* Loading */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="rounded-2xl bg-white animate-pulse aspect-[3/4]" />)}
                    </div>
                )}

                {/* Error */}
                {isError && <p className="text-center text-gray-500 py-16">Gagal memuat mobil. Coba refresh halaman.</p>}

                {/* Empty */}
                {!isLoading && !isError && cars.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <SlidersHorizontal className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p className="font-medium text-gray-600">Tidak ada mobil yang cocok</p>
                        <button onClick={clearAll} className="mt-3 text-[#E31818] underline text-sm">Hapus semua filter</button>
                    </div>
                )}

                {/* Grid */}
                {!isLoading && !isError && cars.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {cars.map((car: any) => {
                            const primaryFoto = car.fotomobils?.find((f: any) => f.isPrimary) ?? car.fotomobils?.[0];
                            return (
                                <CarCard
                                    key={car.id}
                                    id={car.id}
                                    brand={car.merek ?? ""}
                                    model={car.model ?? ""}
                                    trim={car.nama ?? ""}
                                    year={car.tahun ?? new Date().getFullYear()}
                                    price={Number(car.harga) || 0}
                                    installmentPerMonth={Math.round((Number(car.harga) || 0) / 60)}
                                    mileage={Number(car.kilometer) || 0}
                                    transmission={toTransmisi(car.transmisi)}
                                    plateType="Genap"
                                    location={car.lokasi ?? ""}
                                    imageUrl={primaryFoto?.url ?? "https://images.unsplash.com/photo-1549317661-bc02c32e2a96?q=80&w=600&auto=format&fit=crop"}
                                    isHotDeal={false}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function BeliMobilPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center text-gray-400">Memuat...</div>}>
            <BeliMobilContent />
        </Suspense>
    );
}
