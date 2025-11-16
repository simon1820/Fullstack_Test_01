import { prisma } from "../../prisma";

/**
 * ProjectService: Lógica de negocio para gestión de proyectos.
 * Maneja CRUD de proyectos, colaboradores y permisos.
 * 
 * Política de acceso:
 * - Solo el dueño del proyecto puede ver, editar y eliminar
 * - Solo el dueño puede gestionar colaboradores
 * - Los colaboradores pueden ver el proyecto (si se implementa)
 */
export class ProjectService {

  /**
   * Lista todos los proyectos del usuario.
   * 
   * @param userId ID del propietario del proyecto
   * @returns Array de proyectos ordenados por fecha descending
   */
  async findAll(userId: number) {
    return prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  }

  /**
   * Crea un nuevo proyecto.
   * 
   * @param userId ID del usuario propietario
   * @param data Objeto con { name, description }
   * @returns Proyecto creado
   */
  async create(userId: number, data: { name: string; description?: string }) {
    return prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        userId,
      },
    });
  }

  /**
   * Obtiene un proyecto específico.
   * 
   * @param userId ID del usuario autenticado
   * @param projectId ID del proyecto
   * @returns Proyecto si el usuario es el dueño, null en caso contrario
   */
  async findOne(userId: number, projectId: number) {
    return prisma.project.findFirst({
      where: {
        id: projectId,
        userId, // Validar propiedad
      },
    });
  }

  /**
   * Actualiza un proyecto existente.
   * - Solo el dueño puede editar
   * 
   * @param userId ID del usuario autenticado
   * @param projectId ID del proyecto a editar
   * @param data Campos a actualizar (name, description)
   * @returns Proyecto actualizado
   * @throws Error si el usuario no es el dueño
   */
  async update(userId: number, projectId: number, data: any) {

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId }
    });

    if (!project) throw new Error("No tienes permiso para editar este proyecto");

    return prisma.project.update({
      where: { id: projectId },
      data: {
        name: data.name,
        description: data.description
      }
    });
  }

  /**
   * Elimina un proyecto.
   * - Solo el dueño puede eliminar
   * - NOTA: Por defecto solo admins pueden eliminar (verificar en controlador/rutas)
   * 
   * @param userId ID del usuario autenticado
   * @param projectId ID del proyecto a eliminar
   * @returns Proyecto eliminado
   * @throws Error si el proyecto no existe o el usuario no es el dueño
   */
  async delete(userId: number, projectId: number) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new Error("Proyecto no encontrado o no autorizado");
    }

    return prisma.project.delete({
      where: { id: projectId },
    });
  }

  /**
   * Agrega un colaborador a un proyecto.
   * - Solo el dueño del proyecto puede agregar colaboradores
   * - El colaborador se identifica por email
   * 
   * @param ownerId ID del propietario del proyecto
   * @param projectId ID del proyecto
   * @param collaboratorEmail Email del usuario a agregar como colaborador
   * @returns Mensaje de confirmación
   * @throws Error si el proyecto no existe, el usuario no es dueño, o el email no existe
   */
  async addCollaborator(ownerId: number, projectId: number, collaboratorEmail: string) {

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: ownerId }
  });

  if (!project) throw new Error("No tienes permiso para este proyecto");

  const user = await prisma.user.findUnique({
    where: { email: collaboratorEmail }
  });

  if (!user) throw new Error("Usuario no encontrado");

  await prisma.collaborator.create({
    data: {
      projectId,
      userId: user.id
    }
  });

  return { message: "Colaborador agregado correctamente" };
}

  /**
   * Elimina un colaborador de un proyecto.
   * - Solo el dueño del proyecto puede remover colaboradores
   * 
   * @param ownerId ID del propietario del proyecto
   * @param collaboratorId ID del registro de colaborador a eliminar
   * @returns Mensaje de confirmación
   * @throws Error si el colaborador no existe o el usuario no es dueño del proyecto
   */
  async removeCollaborator(ownerId: number, collaboratorId: number) {

  // 1. Obtener el colaborador a eliminar
  const collaborator = await prisma.collaborator.findUnique({
    where: { id: collaboratorId }
  });

  if (!collaborator) throw new Error("Colaborador no encontrado");

  // 2. Validar que el owner es dueño del proyecto
  const project = await prisma.project.findFirst({
    where: { id: collaborator.projectId, userId: ownerId }
  });

  if (!project) throw new Error("No tienes permiso para este proyecto");

  // 3. Eliminar colaborador
  await prisma.collaborator.delete({
    where: { id: collaboratorId }
  });

  return { message: "Colaborador eliminado" };
}

  /**
   * Lista todos los colaboradores de un proyecto.
   * 
   * @param projectId ID del proyecto
   * @returns Array de colaboradores con información de usuario
   */
  async listCollaborators(projectId: number) {
    return prisma.collaborator.findMany({
      where: { projectId },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

}

