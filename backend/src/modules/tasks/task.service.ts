import { prisma } from "../../prisma";

/**
 * TaskService: Lógica de negocio para gestión de tareas.
 * Maneja CRUD de tareas con validación de permisos.
 * 
 * Política de acceso:
 * - El dueño del proyecto SIEMPRE puede ver, editar y eliminar sus tareas
 * - Los usuarios asignados a una tarea PUEDEN cambiar su estado
 */
export class TaskService {

  /**
   * Lista todas las tareas accesibles por el usuario.
   * - Tareas del usuario como dueño del proyecto
   * - Tareas asignadas al usuario
   * 
   * @param userId ID del usuario autenticado
   * @returns Array de tareas ordenadas por fecha descending
   */
  async findAll(userId: number) {
    return prisma.task.findMany({
      where: {
        OR: [
          { assignedTo: userId },         // Tareas asignadas al usuario
          { project: { userId } }         // Tareas de proyectos que posee
        ]
      },
      orderBy: { createdAt: "desc" }
    });
  }

  /**
   * Crea una nueva tarea en un proyecto.
   * - Valida que el usuario sea dueño del proyecto
   * - Inicializa con estado "pendiente" y prioridad "media" (por defecto)
   * 
   * @param userId ID del usuario propietario del proyecto
   * @param data Objeto con { projectId, title, description, priority }
   * @returns Tarea creada
   * @throws Error si el proyecto no pertenece al usuario
   */
  async create(userId: number, data: any) {
    // Validar que el proyecto sea del usuario
    const project = await prisma.project.findFirst({
      where: { id: data.projectId, userId }
    });

    if (!project) {
      throw new Error("No puedes crear tareas en un proyecto que no es tuyo");
    }

    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority ?? "media",
        status: "pendiente",
        projectId: data.projectId,
        assignedTo: null // Puede asignarse después
      }
    });
  }

  /**
   * Actualiza una tarea existente.
   * - Solo el dueño del proyecto puede editar
   * - Permite cambiar título, descripción, prioridad, estado y asignación
   * 
   * @param userId ID del usuario autenticado
   * @param taskId ID de la tarea a editar
   * @param data Campos a actualizar
   * @returns Tarea actualizada
   * @throws Error si el usuario no es dueño del proyecto
   */
  async update(userId: number, taskId: number, data: any) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: { userId } // Validar propiedad del proyecto
      }
    });

    if (!task) throw new Error("No tienes permiso para editar esta tarea");

    return prisma.task.update({
      where: { id: taskId },
      data
    });
  }

  /**
   * Actualiza solo el estado de una tarea.
   * - El dueño del proyecto O el usuario asignado pueden cambiar el estado
   * - Estados válidos: "pendiente", "en progreso", "completada"
   * 
   * @param userId ID del usuario autenticado
   * @param taskId ID de la tarea
   * @param status Nuevo estado
   * @returns Tarea actualizada
   * @throws Error si el usuario no tiene permiso
   */
  async updateStatus(userId: number, taskId: number, status: string) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        OR: [
          { assignedTo: userId },         // Usuario asignado
          { project: { userId } }         // Dueño del proyecto
        ]
      }
    });

    if (!task) throw new Error("No puedes cambiar el estado de esta tarea");

    return prisma.task.update({
      where: { id: taskId },
      data: { status }
    });
  }

  /**
   * Elimina una tarea.
   * - Solo el dueño del proyecto puede eliminar
   * 
   * @param userId ID del usuario autenticado
   * @param taskId ID de la tarea a eliminar
   * @returns Tarea eliminada
   * @throws Error si el usuario no es dueño del proyecto
   */
  async delete(userId: number, taskId: number) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: { userId }
      }
    });

    if (!task) throw new Error("No autorizado para eliminar esta tarea");

    return prisma.task.delete({
      where: { id: taskId }
    });
  }
}
