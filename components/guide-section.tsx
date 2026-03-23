"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

const GUIDE_DATA = {
    beli: [
        {
            title: "Cari Mobil",
            description: "Lihat pilihan mobil melalui menu pencarian atau filter",
        },
        {
            title: "Pilih Mobil",
            description: "Lihat pilihan mobil melalui menu pencarian atau filter",
        },
        {
            title: "Beli Mobil",
            description: "Lihat pilihan mobil melalui menu pencarian atau filter",
        },
    ],
    jual: [
        {
            title: "Lengkapi Data",
            description: "Lihat pilihan mobil melalui menu pencarian atau filter",
        },
        {
            title: "Inspeksi Mobil",
            description: "Lihat pilihan mobil melalui menu pencarian atau filter",
        },
        {
            title: "Terima Pembayaran",
            description: "Lihat pilihan mobil melalui menu pencarian atau filter",
        },
    ]
};

export function GuideSection() {
    const [activeTab, setActiveTab] = useState<"beli" | "jual">("beli");

    const steps = GUIDE_DATA[activeTab];

    return (
        <section className="w-full bg-[#f4f4f4] py-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-[26px] font-bold text-[#0A1930] mb-6">
                    Panduan Jual & Beli Mobil Glotomotif
                </h2>

                {/* Tabs */}
                <div className="flex items-center gap-3 mb-10">
                    <button
                        onClick={() => setActiveTab("beli")}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                            activeTab === "beli"
                                ? "bg-[#3B5BDB] text-white border border-[#3B5BDB]"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        Beli Mobil
                    </button>
                    <button
                        onClick={() => setActiveTab("jual")}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                            activeTab === "jual"
                                ? "bg-[#3B5BDB] text-white border border-[#3B5BDB]"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        Jual Mobil
                    </button>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-x-4 lg:gap-x-8 gap-y-6">
                    {steps.map((step, index) => (
                        <div key={index} className="contents">
                            {/* Step Item */}
                            <div className="flex flex-col w-full">
                                {/* Gray Image Placeholder */}
                                <div className="w-full aspect-[4/3] bg-[#E5E5E5] rounded-xl mb-4 md:mb-6"></div>
                                
                                {/* Content */}
                                <div>
                                    <h3 className="text-base font-bold text-black mb-1 md:mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-[13px] md:text-sm text-gray-800 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>

                            {/* Arrow (Desktop) */}
                            {index !== steps.length - 1 && (
                                <div className="hidden md:flex flex-col w-6 lg:w-8">
                                    <div className="w-full aspect-[4/3] flex items-center justify-center">
                                        <ArrowRight className="w-5 h-5 stroke-[1.5] text-black" />
                                    </div>
                                </div>
                            )}

                            {/* Arrow (Mobile) */}
                            {index !== steps.length - 1 && (
                                <div className="flex md:hidden items-center justify-center py-2 text-black">
                                    <ArrowRight className="w-5 h-5 stroke-[1.5] rotate-90" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
