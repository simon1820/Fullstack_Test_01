import express from "express";
import cors from "cors";

import { swaggerDocs } from "./config/swagger";
import authRoutes from "./modules/auth/auth.routes";
import projectRoutes from "./modules/projects/project.routes";
import taskRoutes from "./modules/tasks/task.routes";
import statsRoutes from "./modules/stats/stats.routes";

const app = express();

// Middlewares
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Swagger
swaggerDocs(app);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Rutas reales de tu API
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/stats", statsRoutes);

export default app;
