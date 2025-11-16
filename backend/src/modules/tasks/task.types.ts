export interface TaskCreateDTO {
  title: string;
  description?: string;
  projectId: number;
  status?: "pendiente" | "en_progreso" | "completada";
  priority?: "baja" | "media" | "alta";
  assignedTo?: number | null;
}

export interface TaskUpdateDTO {
  title?: string;
  description?: string;
  status?: "pendiente" | "en_progreso" | "completada";
  priority?: "baja" | "media" | "alta";
  assignedTo?: number | null;
}
