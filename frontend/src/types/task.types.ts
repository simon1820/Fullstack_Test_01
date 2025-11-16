export interface ITask {
  id: number;
  title: string;
  description: string;
  status: string;       // pendiente | en progreso | completada
  priority: string;     // baja | media | alta
  projectId: number;
  assignedTo?: number | null;
  createdAt: string;
}
