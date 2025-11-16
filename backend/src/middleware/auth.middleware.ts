import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

/**
 * Interfaz extendida de Express.Request que incluye información de usuario autenticado.
 * - userId: ID del usuario extraído del JWT
 * - role: Rol del usuario ("admin" o "user") extraído del JWT
 */
export interface AuthRequest extends Request {
  userId?: number;
  role?: string;
}

/**
 * Middleware de autenticación.
 * Valida el JWT en el header Authorization y extrae el userId y role.
 * Si el token es válido, inyecta los datos en req.userId y req.role y llama a next().
 * Si no es válido, retorna 401 (No autorizado).
 * 
 * @example Uso en rutas: router.use(authMiddleware)
 */
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Token requerido" });
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    ) as any;

    req.userId = payload.id;
    req.role = payload.role;

    next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
};
