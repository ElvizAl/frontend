"use client";

import Link from "next/link";
import { Heart, MapPin, Gauge, Settings2, Calendar } from "lucide-react";
import { Button } from "./ui/button";

export interface CarCardProps {
    id: string;
    brand: string;
    model: string;
    trim: string;
    year: number;
    price: number;
    installmentPerMonth: number;
    mileage: number;
    transmission: "Otomatis" | "Manual";
    plateType: "Ganjil" | "Genap";
    location: string;
    imageUrl: string;
    isHotDeal?: boolean;
    daysLeft?: number;
}

export function CarCard({
    id,
    brand,
    model,
    trim,
    year,
    price,
    mileage,
    transmission,
    plateType,
    imageUrl,
    isHotDeal = false,
    daysLeft,
}: CarCardProps) {
    // Format harga ke Rupiah
    const formatRp = (num: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num);
    };

    // Format cicilan per bulan (misal: 3.4jt)
    const formatInstallment = (num: number) => {
        const inJuta = num / 1000000;
        return `Rp ${inJuta.toFixed(1).replace(".", ",")}jt`;
    };

    return (
        <Link
            href={`/mobil/${id}`}
            className="group flex flex-col w-full rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all overflow-hidden"
        >
            {/* Image Section */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                <img
                    src={imageUrl}
                    alt={`${brand} ${model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#1E40AF] text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm">
                            <span className="w-3 h-3 rounded-full bg-white/20 flex items-center justify-center text-[8px]">✓</span>
                            Garansi 7G+
                        </div>
                        {isHotDeal && (
                            <div className="bg-[#E31818] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm italic">
                                HOT DEAL
                            </div>
                        )}
                    </div>
                </div>

                {/* Days Left Bar */}
                {daysLeft && (
                    <div className="absolute bottom-0 left-0 right-0 bg-[#E31818]/90 text-white text-[10px] font-semibold py-1 px-3 text-right backdrop-blur-sm">
                        {daysLeft} Hari Lagi
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col p-4">
                {/* Title & Location */}
                <div className="mb-4">
                    <h3 className="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[44px]">
                        {brand} {model} {trim} {year}
                    </h3>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 mb-4">
                    <div className="flex flex-col items-center justify-center gap-1">
                        <Gauge className="h-4 w-4 text-gray-400" />
                        <span className="text-[11px] text-gray-500 font-medium">
                            {new Intl.NumberFormat("id-ID").format(mileage)} KM
                        </span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1">
                        <Settings2 className="h-4 w-4 text-gray-400" />
                        <span className="text-[11px] text-gray-500 font-medium">{transmission}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-[11px] text-gray-500 font-medium">{plateType}</span>
                    </div>
                </div>

                {/* Price */}
                <div className="mb-2">
                    <Button className="w-full bg-[#3D3DE8] hover:bg-[#3D3DE8]/80 text-white font-bold py-2 px-4 rounded-lg">
                        <p className="text-lg font-bold text-white">
                            {formatRp(price)}
                        </p>
                    </Button>
                </div>
            </div>
        </Link>
    );
}
