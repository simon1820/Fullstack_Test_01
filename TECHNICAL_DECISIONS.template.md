<!--
  TECHNICAL_DECISIONS.template.md
  Plantilla limpia para documentar DECISIONES TÉCNICAS del proyecto.
  - Este archivo sirve como plantilla y guía; copiar a `TECHNICAL_DECISIONS.md` cuando se complete.
  - Debe contener justificaciones, trade-offs y alternativas, no instrucciones de ejecución.
-->

# Decisiones Técnicas — Fullstack (Node.js + React)

Propósito: documentar las decisiones arquitectónicas y técnicas principales del proyecto. Esta plantilla agrupa las decisiones por área y su justificación. No incluye instrucciones de despliegue (esas van en `README.md`).

## Alcance

Decisiones técnicas y su justificación: arquitectura, componentes principales, diseño de datos, seguridad, testing y consideraciones operativas.

---

## Resumen de decisiones principales

- Arquitectura: separación frontend/backend mediante una API REST para permitir despliegues independientes y escalabilidad horizontal.
- Backend: `Node.js` + `Express` con `TypeScript`. Razonamiento: buen balance entre productividad, ecosistema y simplicidad operativa.
- ORM: `Prisma` sobre MySQL. Razonamiento: generación de tipos, migraciones y consultas relacionales claras.
- Frontend: `React` + `TypeScript` con `Vite`. Estado global: `Zustand` por su simplicidad. Estilos: `Tailwind`.
- Autenticación: `JWT` (stateless). Razonamiento: simple y escalable; considerar refresh tokens según requisitos de seguridad.
- Testing: `Jest` + `Supertest` para pruebas de integración de endpoints críticos.

---

## Diseño y organización del backend

- Organización por módulos (`auth`, `projects`, `tasks`, `stats`) para separación de responsabilidades.
- Cada módulo contiene controladores, rutas y servicios cuando procede.
- Validación: actualmente validaciones básicas; recomendación: migrar a `Zod` o `Joi` para esquemas declarativos y mensajes consistentes.

---

## Modelo de datos (decisión)

- Modelo relacional: `User`, `Project`, `Task`. Relaciones principales:
  - `User` 1—N `Project`
  - `Project` 1—N `Task`
  - `Project` N—N `User` (colaboradores)

Justificación: el dominio requiere integridad referencial y joins frecuentes.

---

## Seguridad (decisiones y trade-offs)

- Hash de contraseñas con `bcrypt`.
- Uso de `JWT` firmado para autenticación stateless; trade-off: simplicidad vs. necesidad futura de refresh tokens y revocación.

### Creación de administradores (seguridad por diseño)

**Decisión**: El endpoint `/auth/register` **siempre crea usuarios con rol `user`**. Los administradores no pueden ser creados por el endpoint público de registro.

**Justificación**: Prevenir escalación de privilegios donde un usuario malicioso podría registrarse directamente como `admin`. El rol debe ser asignado solo por:
1. **SQL directo** (desarrollo local): insertar directamente en la tabla `User` con `role = 'admin'` tras generar hash bcrypt de la contraseña.
2. **Script Node.js** (desarrollo): ejecutar `node scripts/create-admin.js email password name` para crear admins programáticamente.
3. **Endpoint administrativo futuro** (producción): implementar `POST /api/admin/users` protegido solo para admins existentes.

**Alternativas descartadas**:
- Permitir `role` en el body del registro: riesgo de privilegios no autorizados.
- Usar un token mágico para primer admin: complejidad innecesaria; mejor usar scripts.

**Mitigación**: El código de registro valida y rechaza cualquier intento de especificar `role` en la solicitud.

---

## Control de acceso basado en roles (RBAC)

- Implementación: middleware `requireRole()` que valida roles en el JWT.
- Roles definidos: `admin` y `user` (enum en Prisma).
- Flujo:
  1. Autenticación: usuario se loguea, el backend genera un JWT que contiene `{ id, role }`.
  2. Middleware: cada petición pasa por `authMiddleware` que extrae el `role` del JWT e inyecta en `req.role`.
  3. Autorización: ciertas rutas usan `requireRole(["admin"])` que valida si el usuario tiene el rol requerido.

- Rutas protegidas por rol:
  - `DELETE /api/projects/{id}` — solo admin puede eliminar proyectos.
  - Otras rutas (crear, actualizar, listar proyectos y tareas) accesibles a usuarios autenticados.

- Trade-offs:
  - Roles actualmente simples (2 niveles); para control fino se recomienda un sistema de permisos granular.
  - No hay revocación de tokens: un cambio de rol requiere nuevo login para reflejarse.
  
- **Importante**: La creación de administradores se describe en la sección "Creación de administradores (seguridad por diseño)". Por defecto, el registro crea solo usuarios normales.

---

## Observabilidad y operación

- Logs: al menos logs nivel `info`; en producción recomendar logs estructurados (JSON) y un colector central.
- Métricas/Tracing: no implementadas en el alcance inicial; considerar Prometheus/OpenTelemetry si se prepara para producción.

---

## Docker y despliegue (decisiones)

- Proveer `Dockerfile` y `docker-compose.yml` para facilitar evaluación y reproducibilidad.
- Trade-off: aumenta complejidad local pero mejora homogeneidad entre entornos y CI.

---

## Alternativas consideradas

- NoSQL (MongoDB): descartada por la naturaleza relacional del dominio.
- Redux para estado: descartado por overhead; `Zustand` preferido para este scope.

---

## Riesgos y mitigaciones

- Validaciones insuficientes → migrar a esquemas y añadir tests de contratos.
- Tokens JWT sin refresh → añadir refresh tokens y mecanismos de revocación si se necesita control fino.

---

## Entorno Produccion

Se optó por dos configuraciones Docker diferentes:

- Desarrollo (local) → backend y frontend con sus propios Dockerfiles individuales, montando código local (volumes) y recargando con HMR.

- Producción (Railway) → un Dockerfile monolítico que construye backend y frontend dentro de una sola imagen optimizada, sin hot reload, sin volúmenes, usando npm run build en ambos.

Justificación:

- Railway procesa solo una imagen por servicio → monolítico obligatorio.

- Para desarrollo se necesita hot reload → dos servicios con Docker independientes.

Evita inconsistencias entre entornos → ambos comparten base Node 20 y Prisma.

Trade-off:
El Docker de producción no sirve para desarrollo directo por ausencia de node_modules y volumen local.
Mitigado manteniendo ambos setups en paralelo.

## No permitir crear administradores desde el frontend ni API pública

Por seguridad, el endpoint /auth/register siempre genera usuarios user siempre y cuando la variable de entorno **ENABLE_ADMIN_CREATION** tenga un valor user, en caso este habilitada se podran crear usuarios admin para las pruebas correspondientes.

Los administradores deben crearse mediante:

- consulta SQL directa

- script Node interno

- futura ruta protegida para admins

Justificación:
Evita escalamiento de privilegios mediante manipulación del body o ataques directos usando herramientas externas (Postman, ThunderClient).

Trade-off:
Se requiere intervención manual para crear el primer admin.

## Producción en Railway (plan gratuito)

El proyecto se desplegó en Railway usando:

- Dockerfile monolítico

- GitHub Actions (deploy.yml)

- Autodeploy por push a rama específica

Justificación:

- Railway simplifica CI/CD y hosting.

- No requiere configuración de NGINX, PM2 ni servidores físicos.

- Minimiza fricción para el evaluador: solo revisa la URL pública.

Limitación conocida (plan gratuito):

- El servicio puede dormir.

- El cold start puede tardar 20–40 segundos.

Base de datos limitada en capacidad.

## Conclusión

Las decisiones priorizan claridad, mantenibilidad y rapidez de entrega para la prueba técnica. Se recomiendan mejoras (validaciones declarativas, observabilidad y gestión de tokens) si se adapta a producción.

---