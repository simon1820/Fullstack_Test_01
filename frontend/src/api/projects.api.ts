import { api } from "./axios";

// ---- PROYECTOS ----
export const getProjects = () => api.get("/projects");
export const getProject = (id: number) => api.get(`/projects/${id}`);
export const createProject = (data: any) => api.post("/projects", data);
export const updateProject = (id: number, data: any) =>
  api.put(`/projects/${id}`, data);
export const deleteProject = (id: number) => api.delete(`/projects/${id}`);

// ---- COLABORADORES ----
export const getProjectCollaborators = (projectId: number) =>
  api.get(`/projects/${projectId}/collaborators`);

export const addProjectCollaborator = (projectId: number, email: string) =>
  api.post(`/projects/${projectId}/collaborators`, { email });

export const removeProjectCollaborator = (
  projectId: number,
  collaboratorId: number
) => api.delete(`/projects/${projectId}/collaborators/${collaboratorId}`);
