import { apiClient } from "@/lib/api-client";
import { ProfileInput, ChangePasswordInput } from "@/validasi/profile-validasi";

export interface ProfileData {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  gender?: string;
  birthDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  data: ProfileData;
}

export interface ProfileMutationResponse {
  message: string;
  data: ProfileData;
}

export interface DeleteProfileResponse {
  message: string;
}

export const getProfile = () =>
  apiClient<ProfileResponse>("/profile", { method: "GET" });

export const createProfile = (data: ProfileInput) =>
  apiClient<ProfileMutationResponse>("/profile", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate).toISOString() : undefined,
    }),
  });

export const updateProfile = (data: Partial<ProfileInput>) =>
  apiClient<ProfileMutationResponse>("/profile", {
    method: "PUT",
    body: JSON.stringify({
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate).toISOString() : undefined,
    }),
  });

export const deleteProfile = () =>
  apiClient<DeleteProfileResponse>("/profile", { method: "DELETE" });

export const changePassword = (data: ChangePasswordInput) =>
  apiClient<{ message: string }>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
