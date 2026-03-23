import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const getHeaders = () => {
    const token = Cookies.get("auth_token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const getAllUsers = async (params?: { page?: number; limit?: number; search?: string }) => {
    const url = new URL(`${BASE_URL}/users`);
    
    if (params?.page) url.searchParams.append("page", params.page.toString());
    if (params?.limit) url.searchParams.append("limit", params.limit.toString());
    if (params?.search) url.searchParams.append("search", params.search);

    const res = await fetch(url.toString(), {
        headers: getHeaders(),
    });

    if (!res.ok) {
        throw new Error("Gagal mengambil data pengguna");
    }
    
    return res.json();
};

export const updateUser = async (id: string, data: { name?: string; role?: string; email?: string }) => {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Gagal memperbarui pengguna");
    }
    
    return res.json();
};

export const deleteUser = async (id: string) => {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    });

    if (!res.ok) {
        throw new Error("Gagal menghapus pengguna");
    }
    
    return res.json();
};

export const banUser = async (id: string, data: { status: boolean; reason?: string }) => {
    const res = await fetch(`${BASE_URL}/users/${id}/ban`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Gagal mengubah status blokir pengguna");
    }
    
    return res.json();
};
