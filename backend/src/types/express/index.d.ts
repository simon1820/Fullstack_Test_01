import "express";

/**
 * Extensión de tipos de Express Request.
 * Nota: Actualmente userId y role se definen en AuthRequest (auth.middleware.ts).
 * Se mantiene esta declaración para compatibilidad de tipos globales.
 * Para tipos completos de usuario autenticado, importar AuthRequest de auth.middleware.ts.
 */
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      role?: string; // Agregado para RBAC
    }
  }
}
