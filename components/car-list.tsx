"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CarCard } from "./car-card";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchMobilCards() {
    const res = await fetch(`${BASE_URL}/mobil/cards`);
    if (!res.ok) throw new Error("Gagal memuat data mobil");
    return res.json();
}

// Mapping transmisi API → CarCard prop
const toTransmisi = (t?: string): "Otomatis" | "Manual" =>
    t === "OTOMATIS" ? "Otomatis" : "Manual";

const FILTERS = ["Rekomendasi", "Harga Terendah", "Harga Tertinggi", "Tahun Terbaru"];

function sortCars(cars: any[], filter: string) {
    const arr = [...cars];
    if (filter === "Harga Terendah") return arr.sort((a, b) => a.harga - b.harga);
    if (filter === "Harga Tertinggi") return arr.sort((a, b) => b.harga - a.harga);
    if (filter === "Tahun Terbaru") return arr.sort((a, b) => (b.tahun ?? 0) - (a.tahun ?? 0));
    return arr; // Rekomendasi = urutan default server
}

export function CarList() {
    const [activeFilter, setActiveFilter] = useState("Rekomendasi");

    const { data, isLoading, isError } = useQuery({
        queryKey: ["mobil-cards"],
        queryFn: fetchMobilCards,
        staleTime: 60_000,
    });

    const rawCars: any[] = data?.data || data || [];
    const cars = sortCars(rawCars, activeFilter);

    return (
        <section className="w-full max-w-7xl mx-auto mt-10 mb-20 px-4 md:px-8">
            <h2 className="text-[26px] font-bold text-[#0A1930] mb-6">
                Mobil Bekas Pilihan
            </h2>

            {/* Filter Chips */}
            <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {FILTERS.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors border ${
                            activeFilter === filter
                                ? "border-[#E31818] text-[#E31818] bg-[#E31818]/5"
                                : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Loading skeleton */}
            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-2xl bg-gray-100 animate-pulse aspect-[3/4]" />
                    ))}
                </div>
            )}

            {/* Error */}
            {isError && (
                <p className="text-center text-muted-foreground py-12">
                    Gagal memuat data mobil. Coba refresh halaman.
                </p>
            )}

            {/* Empty */}
            {!isLoading && !isError && cars.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                    Belum ada mobil tersedia saat ini.
                </p>
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
