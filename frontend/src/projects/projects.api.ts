import { api } from "../api/axios";

export const getProjects = () => api.get("/projects");

export const createProject = (data: { name: string; description?: string }) =>
  api.post("/projects", data);

export const updateProject = (id: number, data: any) =>
  api.put(`/projects/${id}`, data);

export const deleteProject = (id: number) =>
  api.delete(`/projects/${id}`);
