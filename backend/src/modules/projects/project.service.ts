import { prisma } from "../../prisma";

export class ProjectService {

  /* Lista los proyectos del usuario */
  async findAll(userId: number) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.role === "admin") {
      return prisma.project.findMany({
        orderBy: { createdAt: "desc" }
      });
    }

    return prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  }

  /* Crear proyecto */
  async create(userId: number, data: { name: string; description?: string }) {
    return prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        userId,
      },
    });
  }

  /* Obtener un proyecto */
  async findOne(userId: number, projectId: number) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.role === "admin") {
      return prisma.project.findUnique({ where: { id: projectId } });
    }

    return prisma.project.findFirst({
      where: { id: projectId, userId }
    });
  }

  /* Actualizar proyecto */
  async update(userId: number, projectId: number, data: any) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.role === "admin") {
      return prisma.project.update({
        where: { id: projectId },
        data: {
          name: data.name,
          description: data.description
        }
      });
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId }
    });

    if (!project) {
      throw new Error("No tienes permiso para editar este proyecto");
    }

    return prisma.project.update({
      where: { id: projectId },
      data: {
        name: data.name,
        description: data.description
      }
    });
  }

  /* Eliminar proyecto */
  async delete(userId: number, projectId: number) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.role === "admin") {
      return prisma.project.delete({ where: { id: projectId } });
    }

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

  /* Agregar colaborador */
  async addCollaborator(ownerId: number, projectId: number, collaboratorEmail: string) {

    const owner = await prisma.user.findUnique({ where: { id: ownerId } });

    if (owner?.role === "admin") {
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

  /* Eliminar colaborador */
  async removeCollaborator(ownerId: number, collaboratorId: number) {

    const owner = await prisma.user.findUnique({ where: { id: ownerId } });

    if (owner?.role === "admin") {
      const collaborator = await prisma.collaborator.findUnique({
        where: { id: collaboratorId }
      });

      if (!collaborator) throw new Error("Colaborador no encontrado");

      await prisma.collaborator.delete({
        where: { id: collaboratorId }
      });

      return { message: "Colaborador eliminado" };
    }

    const collaborator = await prisma.collaborator.findUnique({
      where: { id: collaboratorId }
    });

    if (!collaborator) throw new Error("Colaborador no encontrado");

    const project = await prisma.project.findFirst({
      where: { id: collaborator.projectId, userId: ownerId }
    });

    if (!project) throw new Error("No tienes permiso para este proyecto");

    await prisma.collaborator.delete({
      where: { id: collaboratorId }
    });

    return { message: "Colaborador eliminado" };
  }

  /* Listar colaboradores */
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
