"use client";

import { useState } from "react";
import { CarCard } from "./car-card";

// Data dummy untuk contoh tampilan
const DUMMY_CARS = [
    {
        id: "1",
        brand: "Toyota",
        model: "Agya",
        trim: "GR SPORT 1.2 20...",
        year: 2022,
        price: 136000000,
        installmentPerMonth: 3400000,
        mileage: 29030,
        transmission: "Otomatis" as const,
        plateType: "Genap" as const,
        location: "Bandung",
        imageUrl: "https://images.unsplash.com/photo-1549317661-bc02c32e2a96?q=80&w=600&auto=format&fit=crop",
        isHotDeal: true,
        daysLeft: 38,
    },
    {
        id: "2",
        brand: "Daihatsu",
        model: "Ayla",
        trim: "X 1.0",
        year: 2022,
        price: 94000000,
        installmentPerMonth: 2500000,
        mileage: 53497,
        transmission: "Manual" as const,
        plateType: "Genap" as const,
        location: "Bandung",
        imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop",
        isHotDeal: true,
        daysLeft: 38,
    },
    {
        id: "3",
        brand: "Datsun",
        model: "Go+",
        trim: "T 1.2",
        year: 2015,
        price: 68000000,
        installmentPerMonth: 1900000,
        mileage: 63277,
        transmission: "Manual" as const,
        plateType: "Ganjil" as const,
        location: "Cimahi",
        imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop",
        isHotDeal: true,
        daysLeft: 38,
    },
    {
        id: "4",
        brand: "Honda",
        model: "Mobilio",
        trim: "E NEW 1.5",
        year: 2021,
        price: 170000000,
        installmentPerMonth: 4100000,
        mileage: 67401,
        transmission: "Otomatis" as const,
        plateType: "Genap" as const,
        location: "Bandung",
        imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600&auto=format&fit=crop",
        isHotDeal: true,
        daysLeft: 38,
    },
];

const FILTERS = ["Rekomendasi", "Mobil Terbaru", "Harga Terendah", "Tahun Terbaru"];

export function CarList() {
    const [activeFilter, setActiveFilter] = useState("Rekomendasi");

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

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {DUMMY_CARS.map((car) => (
                    <CarCard key={car.id} {...car} />
                ))}
            </div>
        </section>
    );
}
