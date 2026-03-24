import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = (): Record<string, string> => {
    const token = Cookies.get("auth_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// ─── BUYER ─────────────────────────────────────────────────────────

export const createOrder = async (data: {
    mobilId: string;
    metodePengambilan?: "AMBIL_SENDIRI" | "DIANTAR";
    alamatKirim?: string;
}) => {
    const res = await fetch(`${BASE_URL}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Gagal membuat pesanan");
    return result;
};

export const getMyOrders = async (params?: { status?: string; page?: number; limit?: number }) => {
    const url = new URL(`${BASE_URL}/order/my`);
    if (params?.status) url.searchParams.append("status", params.status);
    if (params?.page) url.searchParams.append("page", String(params.page));
    if (params?.limit) url.searchParams.append("limit", String(params.limit));

    const res = await fetch(url.toString(), { headers: getAuthHeaders() });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Gagal mengambil pesanan");
    return result;
};

export const getMyOrderById = async (id: string) => {
    const res = await fetch(`${BASE_URL}/order/my/${id}`, { headers: getAuthHeaders() });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Gagal mengambil detail pesanan");
    return result;
};

export const uploadKtp = async (orderId: string, ktpFile: File) => {
    const formData = new FormData();
    formData.append("ktp", ktpFile);
    const res = await fetch(`${BASE_URL}/order/${orderId}/ktp`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Gagal upload KTP");
    return result;
};

export const uploadBuktiPembayaran = async (
    orderId: string,
    data: { tipe: string; metode: string; nominal?: number },
    buktiFile?: File
) => {
    const formData = new FormData();
    formData.append("tipe", data.tipe);
    formData.append("metode", data.metode);
    if (data.nominal) formData.append("nominal", String(data.nominal));
    if (buktiFile) formData.append("bukti", buktiFile);

    const res = await fetch(`${BASE_URL}/order/${orderId}/bayar`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Gagal upload bukti pembayaran");
    return result;
};

// ─── ADMIN ─────────────────────────────────────────────────────────

export const getAllOrders = async (params?: { status?: string; page?: number; limit?: number }) => {
    const url = new URL(`${BASE_URL}/order`);
    if (params?.status) url.searchParams.append("status", params.status);
    if (params?.page) url.searchParams.append("page", String(params.page));
    if (params?.limit) url.searchParams.append("limit", String(params.limit));

    const res = await fetch(url.toString(), { headers: getAuthHeaders() });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Gagal mengambil data pesanan");
    return result;
};

export const getOrderById = async (id: string) => {
    const res = await fetch(`${BASE_URL}/order/${id}`, { headers: getAuthHeaders() });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Gagal mengambil detail pesanan");
    return result;
};

export const verifikasiPembayaran = async (
    pembayaranId: string,
    data: { sudahDiverifikasi: boolean; kwitansiUrl?: string },
    kwitansiFile?: File
) => {
    const formData = new FormData();
    formData.append("sudahDiverifikasi", String(data.sudahDiverifikasi));
    if (data.kwitansiUrl) formData.append("kwitansiUrl", data.kwitansiUrl);
    if (kwitansiFile) formData.append("kwitansi", kwitansiFile);

    const res = await fetch(`${BASE_URL}/order/pembayaran/${pembayaranId}/verifikasi`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: formData,
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Gagal verifikasi pembayaran");
    return result;
};

export const updateStatusSurat = async (
    orderId: string,
    data: { statusStnk?: string; statusBpkb?: string }
) => {
    const res = await fetch(`${BASE_URL}/order/${orderId}/surat`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Gagal update status surat");
    return result;
};

export const updatePengambilan = async (
    orderId: string,
    data: { metodePengambilan: string; alamatKirim?: string },
    suratJalanFile?: File
) => {
    const formData = new FormData();
    formData.append("metodePengambilan", data.metodePengambilan);
    if (data.alamatKirim) formData.append("alamatKirim", data.alamatKirim);
    if (suratJalanFile) formData.append("suratJalan", suratJalanFile);

    const res = await fetch(`${BASE_URL}/order/${orderId}/pengambilan`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: formData,
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Gagal update pengambilan");
    return result;
};

export const getDashboardStats = async () => {
    const res = await fetch(`${BASE_URL}/order/stats`, { headers: getAuthHeaders() });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Gagal mengambil statistik");
    return result;
};
