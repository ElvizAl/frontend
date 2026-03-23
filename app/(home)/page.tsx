import { Banner } from "@/components/banner";
import { QuickLinks } from "@/components/quick-links";
import { CarList } from "@/components/car-list";
import { GuideSection } from "@/components/guide-section";
import { TestimonialSection } from "@/components/testimonial-section";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black min-h-screen pb-16">
      <main className="flex flex-1 w-full max-w-7xl mx-auto flex-col items-center px-4 sm:px-6 lg:px-8">
        {/* Banner Section */}
        <div className="w-full">
          <Banner />
        </div>

        {/* Quick Links Section */}
        <QuickLinks />

        {/* Mobil Bekas Pilihan Section */}
        <CarList />
      </main>

      {/* Guide Section (Full Bleed) */}
      <GuideSection />

      {/* Testimoni Section (Full Bleed) */}
      <TestimonialSection />
    </div>
  );
}
