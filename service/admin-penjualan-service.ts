import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = (): Record<string, string> => {
  const token = Cookies.get("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export type PenjualanStatus =
  | "DRAFT"
  | "MENUNGGU_EVALUASI"
  | "SEDANG_DIEVALUASI"
  | "DITAWARKAN"
  | "DISETUJUI"
  | "DITOLAK"
  | "TERSEDIA"
  | "TERJUAL";

// GET /penjualan — semua listing mobil seller
export const getAllPenjualan = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const url = new URL(`${BASE_URL}/penjualan`);
  if (params?.status) url.searchParams.append("status", params.status);
  if (params?.page) url.searchParams.append("page", String(params.page));
  if (params?.limit) url.searchParams.append("limit", String(params.limit));

  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal mengambil data penjualan");
  return result;
};

// GET /penjualan/:id — detail pengajuan
export const getPenjualanById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/penjualan/${id}`, {
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal mengambil detail penjualan");
  return result;
};

// PATCH /penjualan/:id/status — ubah status evaluasi
export const updateStatusPenjualan = async (
  id: string,
  status: PenjualanStatus
) => {
  const res = await fetch(`${BASE_URL}/penjualan/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ status }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal mengubah status");
  return result;
};

// POST /penjualan/:id/tawar — beri penawaran harga ke seller
export const createPenawaranAdmin = async (
  id: string,
  data: { hargaTawar: number; catatanAdmin?: string }
) => {
  const res = await fetch(`${BASE_URL}/penjualan/${id}/tawar`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal membuat penawaran");
  return result;
};

// PATCH /penjualan/:id/bayar — konfirmasi pembayaran ke seller
export const konfirmasiPembayaran = async (
  id: string,
  data: { metode: "TUNAI" | "TRANSFER"; buktiTransfer?: File; kwitansi?: File }
) => {
  const formData = new FormData();
  formData.append("metode", data.metode);
  if (data.buktiTransfer) formData.append("buktiTransfer", data.buktiTransfer);
  if (data.kwitansi) formData.append("kwitansi", data.kwitansi);

  const res = await fetch(`${BASE_URL}/penjualan/${id}/bayar`, {
    method: "PATCH",
    headers: getAuthHeaders(), // Don't set Content-Type for FormData
    body: formData,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal konfirmasi pembayaran");
  return result;
};
