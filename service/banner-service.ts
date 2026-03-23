import Cookies from "js-cookie";
import { apiClient } from "@/lib/api-client";
import { BannerInput } from "@/validasi/banner-validasi";

// Types
export interface BannerData {
  id: string;
  judul: string;
  imageUrl: string;
  isActive: boolean;
  urutan: number;
  createdAt: string;
  updatedAt: string;
}

export interface BannerResponse {
  data: BannerData[];
}

export interface BannerMutationResponse {
  message: string;
  data: BannerData;
}

// apiClient tidak bisa menangani FormData (karena selalu set Content-Type JSON),
// sehingga untuk POST/PUT kita pakai helper khusus multipart.
const apiClientFormData = async <T>(
  endpoint: string,
  options: RequestInit
): Promise<T> => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = Cookies.get("auth_token");

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      // Tidak set Content-Type agar browser yang mengatur boundary untuk FormData
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Terjadi kesalahan");
  }
  return result as T;
};

// --- Service Functions ---

export const getAllBanners = () =>
  apiClient<BannerResponse>("/banner", { method: "GET" });

export const createBanner = (values: BannerInput, imageFile: File) => {
  const form = new FormData();
  form.append("judul", values.judul);
  form.append("urutan", values.urutan.toString());
  form.append("isActive", values.isActive);
  form.append("image", imageFile);

  return apiClientFormData<BannerMutationResponse>("/banner", {
    method: "POST",
    body: form,
  });
};

export const updateBanner = (id: string, values: BannerInput, imageFile?: File) => {
  const form = new FormData();
  form.append("judul", values.judul);
  form.append("urutan", values.urutan.toString());
  form.append("isActive", values.isActive);
  if (imageFile) form.append("image", imageFile);

  return apiClientFormData<BannerMutationResponse>(`/banner/${id}`, {
    method: "PUT",
    body: form,
  });
};

export const deleteBanner = (id: string) =>
  apiClient<{ message: string }>(`/banner/${id}`, { method: "DELETE" });
