import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

/**
 * Firma y genera un JWT con el payload proporcionado.
 * @param payload Objeto con datos a incluir en el token (típicamente { id, role })
 * @returns Token JWT firmado con expiración de 7 días
 * @note El secret se obtiene de process.env.JWT_SECRET; en desarrollo usa un valor por defecto
 */
export const signToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

/**
 * Verifica y decodifica un JWT.
 * @param token Token JWT a verificar
 * @returns Payload decodificado si el token es válido
 * @throws Error si el token es inválido o ha expirado
 */
export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
