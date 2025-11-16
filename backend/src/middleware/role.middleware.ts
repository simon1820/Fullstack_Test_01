import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

/**
 * Middleware factory que crea un validador de roles basado en RBAC (Role-Based Access Control).
 * Verifica que el usuario autenticado tenga al menos uno de los roles especificados.
 * Debe usarse DESPUÉS de authMiddleware para que req.role esté disponible.
 * 
 * @param roles Array de roles permitidos (ej: ["admin", "user"])
 * @returns Middleware que valida el rol del usuario
 * @throws Retorna 401 si no hay autenticación; 403 si el rol no está autorizado
 * 
 * @example Uso en rutas: 
 *   router.delete("/:id", requireRole(["admin"]), controller.delete)
 *   router.post("/", requireRole(["user", "admin"]), controller.create)
 */
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.role) {
      return res.status(401).json({ message: "No autorizado" });
    }

    if (!roles.includes(req.role)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    next();
  };
};
