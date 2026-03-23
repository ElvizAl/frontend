"use client";

export function SearchBar() {
    return (
        <div className="flex w-full items-center justify-between pl-6 pr-1">
            <input
                type="text"
                placeholder="Mau cari apa?"
                className="w-full bg-transparent text-[15px] text-gray-800 placeholder:text-gray-600 focus:outline-none"
            />
            <button className="flex h-12 items-center justify-center rounded-full bg-[#E31818] px-8 text-sm font-bold text-white transition-colors hover:bg-[#C91414]">
                Temukan
            </button>
        </div>
    );
}
