import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { ProjectService } from "./project.service";

const service = new ProjectService();

export class ProjectController {

  async findAll(req: AuthRequest, res: Response) {
    try {
      const projects = await service.findAll(Number(req.userId));
      res.json(projects);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const project = await service.create(Number(req.userId), req.body);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findOne(req: AuthRequest, res: Response) {
    try {
      const projectId = Number(req.params.id);
      const project = await service.findOne(Number(req.userId), projectId);

      if (!project) return res.status(404).json({ message: "No encontrado" });

      res.json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const projectId = Number(req.params.id);

      const updated = await service.update(
        Number(req.userId),
        projectId,
        req.body
      );

      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const projectId = Number(req.params.id);

      await service.delete(Number(req.userId), projectId);

      res.json({ message: "Proyecto eliminado" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // -----------------------------------------------
  // COLABORADORES
  // -----------------------------------------------

  async addCollaborator(req: AuthRequest, res: Response) {
  try {
    const ownerId = Number(req.userId);
    const projectId = Number(req.params.projectId);
    const { email } = req.body;

    const result = await service.addCollaborator(ownerId, projectId, email);
    res.json(result);

  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}


  async removeCollaborator(req: AuthRequest, res: Response) {
    try {
      const ownerId = Number(req.userId);
      const collaboratorId = Number(req.params.id);

      const result = await service.removeCollaborator(ownerId, collaboratorId);
      res.json(result);

    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async listCollaborators(req: AuthRequest, res: Response) {
    try {
      const projectId = Number(req.params.projectId);

      const result = await service.listCollaborators(projectId);
      res.json(result);

    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
