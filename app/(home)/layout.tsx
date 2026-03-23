import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-[#F8F9FA]">
            <Navbar />
            <main className="flex-1 mt-[80px]">
                {children}
            </main>
            <Footer />
        </div>
    );
}
