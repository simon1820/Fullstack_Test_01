import { api } from "./axios";

export const registerRequest = (data: {
  name: string;
  email: string;
  password: string;
}) => api.post("/auth/register", data);

export const loginRequest = (data: {
  email: string;
  password: string;
}) => api.post("/auth/login", data);

export const profileRequest = () =>
  api.get("/auth/profile", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
