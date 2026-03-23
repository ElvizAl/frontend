"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllBanners, BannerData } from "@/service/banner-service";
import { useQuery } from "@tanstack/react-query";

export function Banner() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  // Fetch banner aktif dari API
  const { data: res, isLoading } = useQuery({
    queryKey: ["banners-public"],
    queryFn: getAllBanners,
    staleTime: 1000 * 60 * 5, // Cache 5 menit
  });

  // Hanya tampilkan banner yang isActive === true, urutkan berdasarkan urutan
  const banners: BannerData[] = React.useMemo(() => {
    return (res?.data ?? [])
      .filter((b: BannerData) => b.isActive)
      .sort((a: BannerData, b: BannerData) => a.urutan - b.urutan);
  }, [res]);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="w-full relative aspect-[21/9] sm:aspect-[3/1] rounded-[20px] bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
    );
  }

  // Jika tidak ada banner aktif, tampilkan placeholder
  if (banners.length === 0) {
    return (
      <div className="w-full relative aspect-[21/9] sm:aspect-[3/1] rounded-[20px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
        <span className="text-zinc-400 font-medium">Belum ada banner aktif</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto relative group">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {banners.map((banner, index) => (
            <CarouselItem key={banner.id}>
              <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] overflow-hidden rounded-[20px] bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                {/* Fallback teks jika gambar belum ada */}
                <span className="absolute text-zinc-400 font-medium z-0">
                  {banner.judul}
                </span>

                {/* Image dari URL backend */}
                <img
                  src={banner.imageUrl}
                  alt={banner.judul}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Carousel Navigation Arrows */}
        <div className="hidden md:block">
          <CarouselPrevious className="left-4 bg-white/90 hover:bg-white text-black border-none h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity z-20" />
          <CarouselNext className="right-4 bg-white/90 hover:bg-white text-black border-none h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity z-20" />
        </div>
      </Carousel>

      {/* Custom Bottom Controls */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 px-6 sm:px-8 flex justify-between items-center z-20 pointer-events-none">
        {/* Dots */}
        <div className="flex space-x-2 sm:space-x-2.5 items-center pointer-events-auto">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-2 sm:h-2.5 rounded-full transition-all duration-300",
                i + 1 === current
                  ? "w-6 sm:w-8 bg-white"
                  : "w-2 sm:w-2.5 bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Pause Button */}
        <button
          className="h-7 w-7 sm:h-9 sm:w-9 flex items-center justify-center rounded-full border border-white/60 sm:border-2 sm:border-white/60 text-white/60 hover:border-white hover:text-white transition-colors pointer-events-auto shadow-sm"
          aria-label="Pause slider"
        >
          <Pause className="h-3 w-3 sm:h-4 sm:w-4 drop-shadow-md" fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
