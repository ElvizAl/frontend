"use client";

import { Star } from "lucide-react";

const TESTIMONIALS = [
    {
        name: "Budi Santoso",
        role: "Karyawan Swasta",
        content: "Proses pembelian sangat cepat dan transparan. Mobil sesuai dengan deskripsi dan kondisi prima.",
        avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop",
        rating: 5,
    },
    {
        name: "Siti Rahmawati",
        role: "Pengusaha",
        content: "Jual mobil di sini sangat menguntungkan. Harga yang ditawarkan sesuai pasaran dan inspeksinya sangat detail.",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        rating: 5,
    },
    {
        name: "Andi Wijaya",
        role: "Dokter",
        content: "Pelayanan sangat memuaskan dari awal hingga akhir. Rekomendasi banget untuk yang cari mobil bekas berkualitas.",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
        rating: 4,
    },
];

export function TestimonialSection() {
    return (
        <section className="w-full bg-white py-20 px-4 md:px-8 border-t border-gray-100">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <h2 className="text-[26px] font-bold text-[#0A1930] mb-12 text-center">
                    Apa Kata Pelanggan Kami?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <div 
                            key={index} 
                            className="flex flex-col bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={`w-4 h-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} 
                                    />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-gray-700 leading-relaxed flex-1 mb-8 italic text-[15px]">
                                "{testimonial.content}"
                            </p>

                            {/* User Info */}
                            <div className="flex items-center gap-4 mt-auto">
                                <img
                                    src={testimonial.avatarUrl}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover bg-gray-50 border border-gray-100"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900 text-[15px]">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-[13px] text-gray-500">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
