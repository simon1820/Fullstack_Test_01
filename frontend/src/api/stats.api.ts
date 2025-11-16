import { api } from "./axios";

export const getStats = (_filter?: any) => api.get("/stats");
