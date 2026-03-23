"use client";

import Link from "next/link";

const links = [
  {
    title: "Beli Mobil",
    href: "/beli-mobil",
    // Ganti dengan path ikon 3D yang sesuai di folder public/
    icon: "/icon-beli-mobil.png", 
  },
  {
    title: "Jual Mobil",
    href: "/jual-mobil",
    // Ganti dengan path ikon 3D yang sesuai di folder public/
    icon: "/icon-jual-mobil.png",
  },
];

export function QuickLinks() {
  return (
    <section className="w-full flex justify-center py-6 mt-4">
      <div className="flex items-center gap-12 md:gap-24">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="flex flex-col items-center group transition-transform hover:scale-105 active:scale-95"
          >
            {/* Lingkaran Background */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shadow-sm border border-black/5 dark:border-white/5 mb-3 group-hover:shadow-md transition-all">
              {/* Ikon 3D */}
              {/* Fallback teks jika gambar tidak ditemukan saat development */}
              <div className="relative w-full h-full flex items-center justify-center">
                <span className="absolute text-[10px] text-zinc-400 font-medium text-center leading-tight px-2 z-0">
                  Icon<br />{link.title}
                </span>
                <img
                  src={link.icon}
                  alt={link.title}
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain z-10 drop-shadow-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
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
