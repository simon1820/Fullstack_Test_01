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
   * 
   * Soporta filtrado por:
   * - projectId: limitar a un proyecto específico
   * - range: últimos N días (ej: range=7 para últimos 7 días)
   * - from/to: rango de fechas personalizado (ISO format)
   * 
   * Retorna:
   * - totalProjects: cantidad de proyectos del usuario
   * - totalTasks: tareas en proyectos del usuario
   * - completed/inProgress: conteos rápidos de estados comunes
   * - estados: array de { name, value } con distribución de estados
   * - prioridades: array de { priority, count } (baja, media, alta)
   * - historial: array de { day, completed } con tareas creadas por día
   */
  async get(req: Request, res: Response) {
    const userId = req.userId!;
    const { projectId, range, from, to } = req.query;

    // Construcción dinámica del filtro base
    const where: any = {
      project: { userId }  // Solo tareas de proyectos del usuario
    };

    // Filtro opcional por proyecto específico
    if (projectId) {
      where.projectId = Number(projectId);
    }

    // Filtro opcional de fechas
    let dateFilter = {};
    if (range && range !== "custom") {
      // range es número de días atrás
      const days = Number(range);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      dateFilter = { gte: startDate };
    }

    // Filtro de rango personalizado
    if (from && to) {
      dateFilter = { gte: new Date(String(from)), lte: new Date(String(to)) };
    }

    where.createdAt = dateFilter;

    // Consultas paralelas para estadísticas
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

    // Formatea prioridades con valores por defecto (0 si no existen)
    const prioridades = [
      { priority: "baja", count: prioridadesRaw.find((p) => p.priority === "baja")?._count.priority ?? 0 },
      { priority: "media", count: prioridadesRaw.find((p) => p.priority === "media")?._count.priority ?? 0 },
      { priority: "alta", count: prioridadesRaw.find((p) => p.priority === "alta")?._count.priority ?? 0 },
    ];

    // Historial: tareas creadas por día
    const historial = await prisma.task.groupBy({
      by: ["createdAt"],
      where,
      _count: { id: true }
    });

    res.json({
      totalProjects,
      totalTasks,
      completed: estados.find((e) => e.status === "completada")?._count.status ?? 0,
      inProgress: estados.find((e) => e.status === "en progreso")?._count.status ?? 0,
      estados: estados.map((e) => ({
        name: e.status,
        value: e._count.status,
      })),
      prioridades,
      historial: historial.map((h) => ({
        day: h.createdAt.toISOString().split("T")[0],
        completed: h._count.id,
      })),
    });
  }
}
