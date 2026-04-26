"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

const GUIDE_DATA = {
    beli: [
        {
            title: "Cari Mobil",
            description: "Lihat pilihan mobil melalui menu pencarian atau filter",
            imgUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Pilih Mobil",
            description: "Pilih mobil idaman sesuai dengan kebutuhan Anda",
            imgUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Beli Mobil",
            description: "Lakukan pembayaran dengan aman dan mudah",
            imgUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800"
        },
    ],
    jual: [
        {
            title: "Lengkapi Data",
            description: "Isi form detail dan unggah beberapa foto mobil Anda",
            imgUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Inspeksi Mobil",
            description: "Mobil akan diinspeksi oleh ahli secara komprehensif",
            imgUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Terima Pembayaran",
            description: "Dana akan segera ditransfer setelah semua disetujui",
            imgUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800"
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
                                {/* Image */}
                                <div className="w-full aspect-[4/3] bg-[#E5E5E5] rounded-xl mb-4 md:mb-6 overflow-hidden relative shadow-sm">
                                    <img 
                                        src={step.imgUrl} 
                                        alt={step.title}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                </div>
                                
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
