"use client";

import Link from "next/link";

const links = [
  {
    title: "Beli Mobil",
    href: "/beli-mobil",
    // Gambar ilustrasi aesthetic mobil dari Unsplash
    icon: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Jual Mobil",
    href: "/jual-mobil",
    // Gambar ilustrasi kunci/transaksi mobil dari Unsplash 
    icon: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=200&auto=format&fit=crop",
  },
];

export function QuickLinks() {
  return (
    <section className="w-full max-w-7xl mx-auto flex justify-center py-6 mt-4">
      <div className="flex items-center gap-12 md:gap-24">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="flex flex-col items-center group transition-transform hover:scale-105 active:scale-95"
          >
            {/* Lingkaran Background dengan Gambar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 mb-4 group-hover:shadow-[0_8px_30px_-4px_rgba(227,24,24,0.3)] group-hover:-translate-y-1 transition-all duration-300 overflow-hidden text-[#E31818]">
              <div className="w-full h-full relative border border-gray-100 bg-gray-50/50">
                <img
                  src={link.icon}
                  alt={link.title}
                  className="w-full h-full object-cover rounded-full shadow-sm"
                />
              </div>
            </div>

            {/* Teks Judul */}
            <span className="text-sm sm:text-base font-medium text-zinc-900 dark:text-zinc-100 text-center">
              {link.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
