import type { Crypto } from "../types/index";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";

export interface ApiResponse {
  success: boolean;
  data: Crypto[];
  count: number;
  fromCache?: boolean;
}

export const fetchCryptoData = async (): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/coins`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error("Failed to fetch cryptocurrency data");
  }

  return data;
};
