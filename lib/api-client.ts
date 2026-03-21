// lib/api-client.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = async <T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Terjadi kesalahan");
  }

  return result as T;
};
