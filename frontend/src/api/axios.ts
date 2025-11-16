import axios from "axios";
import { useAuthStore } from "../store/auth.store";

// Vite exposes env vars under import.meta.env
const VITE_API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:4000/api";

export const api = axios.create({
  baseURL: VITE_API_URL,
});

// Interceptor: agrega automáticamente el token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
