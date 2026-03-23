import { Banner } from "@/components/banner";
import { QuickLinks } from "@/components/quick-links";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 w-full max-w-7xl mx-auto flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
        {/* Banner Section */}
        <div className="w-full">
          <Banner />
        </div>

        {/* Quick Links Section */}
        <QuickLinks />
        
        {/* Rest of the page content */}
        <div className="mt-12 flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Pusat Jual Beli Mobil Bekas
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Temukan mobil impianmu dengan harga terbaik dan kualitas terjamin.
          </p>
        </div>
      </main>
    </div>
  );
}
