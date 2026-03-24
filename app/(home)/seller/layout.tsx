import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function getSellerUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if (!token) return null;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });

        if (!res.ok) return null;

        const data = await res.json();
        if (data?.user?.role !== "SELLER") return null;

        return data.user;
    } catch {
        return null;
    }
}

export default async function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getSellerUser();

    if (!user) {
        redirect("/");
    }

    return <>{children}</>;
}
