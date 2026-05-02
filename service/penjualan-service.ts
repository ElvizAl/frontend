import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = (): Record<string, string> => {
  const token = Cookies.get("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// POST /penjualan — buat listing mobil baru (multipart)
export const createMobilSeller = async (
  data: Record<string, string | undefined>,
  fotoFiles: File[]
) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, val]) => {
    if (val !== undefined && val !== "") formData.append(key, val);
  });
  fotoFiles.forEach((file) => formData.append("foto", file));

  const res = await fetch(`${BASE_URL}/penjualan`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  let result;
  try {
    result = await res.json();
  } catch {
    result = { message: "Internal Server Error" };
  }

  if (!res.ok) throw new Error(result.message || "Gagal membuat listing stabil (Mungkin ukuran foto kebesaran atau server bermasalah)");
  return result;
};

// GET /penjualan/my — daftar mobil seller
export const getMyMobilSeller = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const url = new URL(`${BASE_URL}/penjualan/my`);
  if (params?.status) url.searchParams.append("status", params.status);
  if (params?.page) url.searchParams.append("page", String(params.page));
  if (params?.limit) url.searchParams.append("limit", String(params.limit));

  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal mengambil data mobil");
  return result;
};

// PATCH /penjualan/:id/submit — submit ke admin
export const submitMobilSeller = async (id: string) => {
  const res = await fetch(`${BASE_URL}/penjualan/${id}/submit`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal submit mobil");
  return result;
};

// DELETE /penjualan/:id — hapus listing
export const deleteMobilSeller = async (id: string) => {
  const res = await fetch(`${BASE_URL}/penjualan/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal menghapus mobil");
  return result;
};
