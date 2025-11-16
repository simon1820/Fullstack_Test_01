import { Response } from "express";
import { AuthService } from "./auth.service";
import { AuthRequest } from "../../middleware/auth.middleware";

const service = new AuthService();

export class AuthController {

  async register(req: any, res: Response) {
    try {
      const { name, email, password, role = "user" } = req.body; 
      const result = await service.register({ name, email, password, role });
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: any, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await service.login(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async profile(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const result = await service.profile(userId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

}
