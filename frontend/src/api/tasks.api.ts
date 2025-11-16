import { api } from "./axios";

export const getTasks = () => api.get("/tasks");
export const getTask = (id: number) => api.get(`/tasks/${id}`);

export const createTask = (data: any) => api.post("/tasks", data);
export const updateTask = (id: number, data: any) =>
  api.put(`/tasks/${id}`, data);

export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);

export const updateTaskStatus = (id: number, status: string) =>
  api.patch(`/tasks/${id}/status`, { status });
