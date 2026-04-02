"use client";

import { ChevronDown } from "lucide-react";

export function FilterBar() {
    return (
        <div className="flex w-full items-center justify-between">
            <div className="flex flex-1 divide-x divide-gray-100">

                <div className="flex flex-1 cursor-pointer items-center justify-between px-6 hover:bg-gray-50/50 rounded-l-full py-1">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-medium text-gray-400">Merek & Model</span>
                        <span className="text-[13px] font-semibold text-gray-800">Pilih Merek & Model</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>

                <div className="flex flex-1 cursor-pointer items-center justify-between px-6 hover:bg-gray-50/50 py-1">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-medium text-gray-400">Harga</span>
                        <span className="text-[13px] font-semibold text-gray-800">Pilih Harga</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>

                <div className="flex flex-1 cursor-pointer items-center justify-between px-6 hover:bg-gray-50/50 py-1">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-medium text-gray-400">Tahun</span>
                        <span className="text-[13px] font-semibold text-gray-800">Pilih Tahun</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>


            </div>

            <div className="pl-3 pr-1">
                <button className="flex h-12 items-center justify-center rounded-full bg-[#3D3DE8] px-8 text-sm font-bold text-white transition-colors hover:bg-[#C91414]">
                    Temukan
                </button>
            </div>
        </div>
    );
}
