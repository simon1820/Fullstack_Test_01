import { Router } from "express";

import authRoutes from "./auth/auth.routes";
import projectRoutes from "./projects/project.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default router;
