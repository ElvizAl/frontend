import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import BannerTable from "@/components/dashboard/banner-table";

export default function BannerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger className="-ml-2" />
        <Separator orientation="vertical" className="h-6" />
        <h1 className="text-xl font-semibold">Banner Promosi</h1>
      </header>

      <main className="flex-1 p-6">
        <BannerTable />
      </main>
    </div>
  );
}
