import { Request, Response } from "express";
import { prisma } from "../../prisma";

/**
 * StatsController: Controlador para estadísticas y análisis de proyectos.
 * Proporciona métricas de tareas, estados, prioridades e historial de creación.
 * 
 * @note Actualmente sin protección de roles; considerar restricción a admins en futuro
 */
export class StatsController {
  /**
   * Obtiene estadísticas de proyectos y tareas del usuario.
   */
  async get(req: Request, res: Response) {
    const userId = req.userId!;
    const { projectId, range, from, to } = req.query;

    // Construcción dinámica del filtro base
    const where: any = {
      project: { userId }
    };

    if (projectId) {
      where.projectId = Number(projectId);
    }

    let dateFilter = {};
    if (range && range !== "custom") {
      const days = Number(range);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      dateFilter = { gte: startDate };
    }

    if (from && to) {
      dateFilter = { gte: new Date(String(from)), lte: new Date(String(to)) };
    }

    where.createdAt = dateFilter;

    const totalProjects = await prisma.project.count({
      where: { userId }
    });

    const totalTasks = await prisma.task.count({ where });

    const estados = await prisma.task.groupBy({
      by: ["status"],
      where,
      _count: { status: true }
    });

    const prioridadesRaw = await prisma.task.groupBy({
      by: ["priority"],
      where,
      _count: { priority: true }
    });

    // Tipos explícitos
    type PrioridadItem = {
      priority: string | null;
      _count: { priority: number };
    };

    type EstadoItem = {
      status: string | null;
      _count: { status: number };
    };

    type HistorialItem = {
      createdAt: Date;
      _count: { id: number };
    };

    const prioridades = [
      { 
        priority: "baja",
        count: (prioridadesRaw as PrioridadItem[])
          .find((p) => p.priority === "baja")?._count.priority ?? 0 
      },
      { 
        priority: "media",
        count: (prioridadesRaw as PrioridadItem[])
          .find((p) => p.priority === "media")?._count.priority ?? 0 
      },
      { 
        priority: "alta",
        count: (prioridadesRaw as PrioridadItem[])
          .find((p) => p.priority === "alta")?._count.priority ?? 0 
      },
    ];

    const historial = await prisma.task.groupBy({
      by: ["createdAt"],
      where,
      _count: { id: true }
    });

    res.json({
      totalProjects,
      totalTasks,
      completed: (estados as EstadoItem[])
        .find((e) => e.status === "completada")?._count.status ?? 0,
      inProgress: (estados as EstadoItem[])
        .find((e) => e.status === "en progreso")?._count.status ?? 0,
      estados: (estados as EstadoItem[]).map((e) => ({
        name: e.status,
        value: e._count.status,
      })),
      prioridades,
      historial: (historial as HistorialItem[]).map((h) => ({
        day: h.createdAt.toISOString().split("T")[0],
        completed: h._count.id,
      })),
    });
  }
}
