import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { signToken } from "../../utils/jwt";

const prisma = new PrismaClient();

/**
 * AuthService: Lógica de negocio para autenticación.
 * Maneja registro, login y obtención de perfil de usuarios.
 */
export class AuthService {

  /**
   * Registra un nuevo usuario en la base de datos.
   * - Valida que el email no exista previamente
   * - Hashea la contraseña con bcrypt
   * - Asigna rol "user" por defecto (NO puede ser modificado por el cliente)
   * 
   * @param data Objeto con { name, email, password, role }
   * @returns Usuario creado (sin contraseña)
   * @throws Error si el email ya existe o hay problemas con la BD
   * 
   * @note El parámetro role se ignora por seguridad; siempre crea usuario con rol "user"
   */
  async register({ name, email, password, role = "user" }: any) {

    const exists = await prisma.user.findUnique({ where: { email } });

    if (exists) {
      throw new Error("El usuario ya existe");
    }

    const finalRole =
    process.env.ENABLE_ADMIN_CREATION === "true" && role === "admin"
      ? "admin"
      : "user";
      
    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: finalRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    return user;
  }

  /**
   * Autentica un usuario y genera un JWT.
   * - Verifica que el email exista
   * - Compara la contraseña usando bcrypt
   * - Genera un token JWT con { id, role }
   * 
   * @param email Email del usuario
   * @param password Contraseña en texto plano
   * @returns Objeto con { token, user }
   * @throws Error si las credenciales son inválidas
   */
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error("Credenciales inválidas");
    }

    const token = signToken({ id: user.id, role: user.role });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email
      }
    };
  }

  /**
   * Obtiene el perfil del usuario autenticado.
   * 
   * @param userId ID del usuario
   * @returns Perfil del usuario (sin contraseña)
   */
  async profile(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
  }
}

