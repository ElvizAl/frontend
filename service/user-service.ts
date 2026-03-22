import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface UserProfile {
    id: string;
    name: string | null;
    email: string;
    role: string;
    isVerified: boolean;
    avatarUrl: string | null;
    createdAt: string;
}

export const getMe = async (): Promise<UserProfile> => {
    const token = Cookies.get("auth_token");
    const response = await fetch(`${BASE_URL}/auth/me`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil data user");
    }

    // Backend mengembalikan { user: {...} }
    return result.user as UserProfile;
};

export const logout = () => {
    Cookies.remove("auth_token");
};
