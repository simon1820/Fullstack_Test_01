import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { TaskController } from "./task.controller";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();
const controller = new TaskController();

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Obtener todas las tareas del usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tareas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get("/", authMiddleware, controller.findAll);

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Crear una nueva tarea
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - projectId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Implementar Login"
 *               description:
 *                 type: string
 *                 example: "Añadir formulario de login y validaciones"
 *               priority:
 *                 type: string
 *                 enum: [baja, media, alta]
 *                 example: "media"
 *               projectId:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Tarea creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Datos inválidos
 */
router.post("/", authMiddleware, controller.create);

/**
 * @openapi
 * /api/tasks/{id}:
 *   put:
 *     tags:
 *       - Tasks
 *     summary: Actualizar una tarea existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la tarea
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pendiente, en progreso, completada]
 *               priority:
 *                 type: string
 *                 enum: [baja, media, alta]
 *               projectId:
 *                 type: number
 *     responses:
 *       200:
 *         description: Tarea actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarea no encontrada
 */
router.put("/:id", authMiddleware, controller.update);

/**
 * @openapi
 * /api/tasks/{id}/status:
 *   patch:
 *     tags:
 *       - Tasks
 *     summary: Actualizar SOLO el estado de una tarea
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la tarea
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pendiente, en progreso, completada]
 *                 example: completada
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       404:
 *         description: Tarea no encontrada
 */
router.patch("/:id/status", authMiddleware, requireRole(["admin"]), controller.updateStatus);

/**
 * @openapi
 * /api/tasks/{id}:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Eliminar una tarea por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la tarea
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Eliminada correctamente
 *       404:
 *         description: No encontrada
 */
router.delete("/:id", authMiddleware, controller.delete);

export default router;
