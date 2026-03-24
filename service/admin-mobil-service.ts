import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = (): Record<string, string> => {
  const token = Cookies.get("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET /mobil — semua mobil (public tapi kita kirim auth utk konsistensi)
export const getAllMobil = async (params?: {
  status?: string;
  merek?: string;
  transmisi?: string;
  page?: number;
  limit?: number;
}) => {
  const url = new URL(`${BASE_URL}/mobil`);
  if (params?.status) url.searchParams.append("status", params.status);
  if (params?.merek) url.searchParams.append("merek", params.merek);
  if (params?.transmisi) url.searchParams.append("transmisi", params.transmisi);
  if (params?.page) url.searchParams.append("page", String(params.page));
  if (params?.limit) url.searchParams.append("limit", String(params.limit));

  const res = await fetch(url.toString());
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal mengambil data mobil");
  return result;
};

// GET /mobil/:id
export const getMobilById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/mobil/${id}`);
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal mengambil detail mobil");
  return result;
};

// POST /mobil — multipart/form-data
export const createMobil = async (
  data: Record<string, string | undefined>,
  fotoFiles: File[]
) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, val]) => {
    if (val !== undefined && val !== "") formData.append(key, val);
  });
  fotoFiles.forEach((file) => formData.append("foto", file));

  const res = await fetch(`${BASE_URL}/mobil`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal membuat mobil");
  return result;
};

// PUT /mobil/:id — JSON
export const updateMobil = async (
  id: string,
  data: Record<string, string | number | undefined>
) => {
  const res = await fetch(`${BASE_URL}/mobil/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal mengupdate mobil");
  return result;
};

// DELETE /mobil/:id
export const deleteMobil = async (id: string) => {
  const res = await fetch(`${BASE_URL}/mobil/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal menghapus mobil");
  return result;
};

// POST /mobil/:id/foto — tambah foto
export const addFotoMobil = async (id: string, fotoFiles: File[]) => {
  const formData = new FormData();
  fotoFiles.forEach((file) => formData.append("foto", file));
  const res = await fetch(`${BASE_URL}/mobil/${id}/foto`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal menambah foto");
  return result;
};

// PATCH /mobil/foto/:fotoId/primary
export const setPrimaryFoto = async (fotoId: string) => {
  const res = await fetch(`${BASE_URL}/mobil/foto/${fotoId}/primary`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal set foto utama");
  return result;
};

// DELETE /mobil/foto/:fotoId
export const deleteFotoMobil = async (fotoId: string) => {
  const res = await fetch(`${BASE_URL}/mobil/foto/${fotoId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal menghapus foto");
  return result;
};
