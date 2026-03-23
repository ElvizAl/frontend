import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";

export const dynamic = "force-dynamic";

async function getAdminUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        
        if (!token) return null;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        });

        if (!res.ok) return null;
        
        const data = await res.json();
        
        if (data?.user?.role !== "ADMIN") return null;

        return data.user;
    } catch (error) {
        return null;
    }
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getAdminUser();

    if (!user) {
        // Arahkan ke halaman utama atau halaman login jika bukan admin
        redirect("/"); 
    }

    return (
        <SidebarProvider>
            <AppSidebar 
                user={{
                    name: user.name,
                    email: user.email,
                    image: user.avatarUrl
                }}
            />
            <SidebarInset className="bg-muted/30">
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}