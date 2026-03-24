"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CarCard } from "./car-card";
import { X } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchMobilCards() {
    const res = await fetch(`${BASE_URL}/mobil/cards`);
    if (!res.ok) throw new Error("Gagal memuat data mobil");
    return res.json();
}

const toTransmisi = (t?: string): "Otomatis" | "Manual" =>
    t === "OTOMATIS" ? "Otomatis" : "Manual";

const SORT_FILTERS = ["Rekomendasi", "Harga Terendah", "Harga Tertinggi", "Tahun Terbaru"];

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

function formatPrice(n: number) {
    if (n >= 1_000_000_000) return `Rp${(n / 1_000_000_000).toFixed(1)}M`;
    if (n >= 1_000_000) return `Rp${Math.round(n / 1_000_000)}jt`;
    return `Rp${n.toLocaleString("id-ID")}`;
}

export function CarList() {
    const [activeSort, setActiveSort] = useState("Rekomendasi");
    const [yearRange, setYearRange] = useState<typeof YEAR_RANGES[0] | null>(null);
    const [priceRange, setPriceRange] = useState<typeof PRICE_RANGES[0] | null>(null);
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
        if (yearRange) arr = arr.filter(c => (c.tahun ?? 0) >= yearRange.min && (c.tahun ?? 0) <= yearRange.max);
        if (priceRange) arr = arr.filter(c => Number(c.harga) >= priceRange.min && Number(c.harga) < priceRange.max);
        if (activeSort === "Harga Terendah") arr.sort((a, b) => a.harga - b.harga);
        else if (activeSort === "Harga Tertinggi") arr.sort((a, b) => b.harga - a.harga);
        else if (activeSort === "Tahun Terbaru") arr.sort((a, b) => (b.tahun ?? 0) - (a.tahun ?? 0));
        return arr;
    }, [rawCars, activeSort, yearRange, priceRange]);

    const hasFilter = yearRange || priceRange;
    const clearAll = () => { setYearRange(null); setPriceRange(null); };

    return (
        <section className="w-full max-w-7xl mx-auto mt-10 mb-20 px-4 md:px-8">
            <h2 className="text-[26px] font-bold text-[#0A1930] mb-6">Mobil Bekas Pilihan</h2>

            {/* Filter area */}
            <div className="flex flex-wrap items-center gap-2 mb-6 relative">

                {/* Hapus Filter chip */}
                {hasFilter && (
                    <button
                        onClick={clearAll}
                        className="flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium bg-[#E31818] text-white hover:bg-[#c01414] transition-colors"
                    >
                        Hapus Filter <X className="h-3.5 w-3.5" />
                    </button>
                )}

                {/* Active filter chips */}
                {yearRange && (
                    <button
                        onClick={() => setYearRange(null)}
                        className="flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    >
                        {yearRange.label} <X className="h-3 w-3" />
                    </button>
                )}
                {priceRange && (
                    <button
                        onClick={() => setPriceRange(null)}
                        className="flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    >
                        {priceRange.label} <X className="h-3 w-3" />
                    </button>
                )}

                {/* Separator */}
                {hasFilter && <div className="w-px h-6 bg-gray-200 mx-1" />}

                {/* Tahun dropdown trigger */}
                <div className="relative">
                    <button
                        onClick={() => { setShowYearMenu(p => !p); setShowPriceMenu(false); }}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${yearRange ? "border-[#3D3DE8] text-[#3D3DE8] bg-[#3D3DE8]/5" : "border-gray-200 text-gray-600 bg-white hover:border-gray-300"}`}
                    >
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

                {/* Harga dropdown trigger */}
                <div className="relative">
                    <button
                        onClick={() => { setShowPriceMenu(p => !p); setShowYearMenu(false); }}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${priceRange ? "border-[#3D3DE8] text-[#3D3DE8] bg-[#3D3DE8]/5" : "border-gray-200 text-gray-600 bg-white hover:border-gray-300"}`}
                    >
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

                {/* Sort chips */}
                <div className="w-px h-6 bg-gray-200 mx-1" />
                {SORT_FILTERS.map(f => (
                    <button key={f} onClick={() => setActiveSort(f)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap ${activeSort === f ? "border-[#E31818] text-[#E31818] bg-[#E31818]/5" : "border-gray-200 text-gray-600 bg-white hover:border-gray-300"}`}>
                        {f}
                    </button>
                ))}
            </div>

            {/* Click outside to close menus */}
            {(showYearMenu || showPriceMenu) && (
                <div className="fixed inset-0 z-10" onClick={() => { setShowYearMenu(false); setShowPriceMenu(false); }} />
            )}

            {/* Loading skeleton */}
            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="rounded-2xl bg-gray-100 animate-pulse aspect-[3/4]" />
                    ))}
                </div>
            )}

            {isError && <p className="text-center text-muted-foreground py-12">Gagal memuat data mobil. Coba refresh halaman.</p>}

            {!isLoading && !isError && cars.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                    <p className="text-lg font-medium">Tidak ada mobil yang sesuai filter.</p>
                    {hasFilter && <button onClick={clearAll} className="mt-3 text-[#E31818] underline text-sm">Hapus semua filter</button>}
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
        </section>
    );
}
