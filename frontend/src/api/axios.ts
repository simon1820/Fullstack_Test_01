import axios from "axios";
import { useAuthStore } from "../store/auth.store";

// Auto-detecta la URL correcta en monolito (misma URL del host)
const baseURL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL,
});

// Interceptor: agrega automáticamente el token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
