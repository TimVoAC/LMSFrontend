import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

// Optional: attach token per-request via interceptor
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
