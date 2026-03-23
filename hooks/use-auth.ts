import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface AuthUser {
    id: string;
    name: string | null;
    email: string;
    role: string;
    isVerified: boolean;
    avatarUrl: string | null;
}

const fetchMe = async (): Promise<AuthUser> => {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("No token");

    const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Unauthorized");

    const data = await res.json();
    return data.user as AuthUser;
};

export function useAuth() {
    const token = typeof window !== "undefined" ? Cookies.get("auth_token") : undefined;

    const { data: user, isLoading, isError } = useQuery({
        queryKey: ["auth-user"],
        queryFn: fetchMe,
        enabled: !!token,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    return {
        user,
        isLoading,
        isLoggedIn: !!user && !isError,
    };
}
