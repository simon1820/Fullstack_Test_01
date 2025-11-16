import { Router } from "express";
import { StatsController } from "./stats.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
const controller = new StatsController();

/**
 * @openapi
 * /stats:
 *   get:
 *     tags:
 *       - Stats
 *     summary: Obtener estadísticas del usuario autenticado
 *     description: Retorna totales, estados, prioridades e historial de actividad.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filtrar estadísticas por proyecto
 *       - in: query
 *         name: range
 *         schema:
 *           type: string
 *           enum: [7, 30, 90, custom]
 *         required: false
 *         description: Rango de días (7, 30, 90 o personalizado)
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha inicio (si range = custom)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha fin (si range = custom)
 *     responses:
 *       200:
 *         description: Estadísticas generadas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatsResponse'
 *       401:
 *         description: No autorizado
 */
router.get("/", authMiddleware, controller.get);

export default router;
