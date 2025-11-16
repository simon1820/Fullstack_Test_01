import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { TaskService } from "./task.service";

const service = new TaskService();

export class TaskController {

  async findAll(req: AuthRequest, res: Response) {
    const tasks = await service.findAll(Number(req.userId));
    res.json(tasks);
  }

  async create(req: AuthRequest, res: Response) {
    const task = await service.create(Number(req.userId), req.body);
    res.status(201).json(task);
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const taskId = Number(req.params.id);
      const userId = Number(req.userId);

      const task = await service.update(userId, taskId, req.body);

      res.json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateStatus(req: AuthRequest, res: Response) {
    const updated = await service.updateStatus(
      Number(req.userId),
      Number(req.params.id),
      req.body.status
    );
    res.json(updated);
  }

  async delete(req: AuthRequest, res: Response) {
    await service.delete(Number(req.userId), Number(req.params.id));
    res.json({ message: "Tarea eliminada" });
  }
}
