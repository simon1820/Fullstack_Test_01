# Fullstack Project — Gestión de Proyectos y Tareas

Breve: aplicación fullstack (API + SPA) para gestionar proyectos, tareas y colaboradores. Desarrollada como prueba técnica usando buenas prácticas, tipado fuerte y pruebas de integración.

## Contenido rápido
- Descripción
- Tecnologías
- Estructura del repo
- Decisiones técnicas (ver `TECHNICAL_DECISIONS.md`)
- Instalación y ejecución (desarrollo)
- Variables de entorno
- Migraciones y base de datos
- Tests
- Docker (opcional)
- Contribuir y contacto

---

## Tecnologías principales

- Backend: Node.js, Express, TypeScript
- ORM: Prisma (MySQL)
- Auth: JWT
- Tests: Jest + Supertest
- Frontend: React, Vite, TypeScript
- Estado: Zustand
- Estilos: Tailwind CSS
- HTTP client: Axios

---

## Estructura del proyecto

Raíz del repo:

```
/
├── backend/
│ ├── src/
│ ├── prisma/
│ ├── Dockerfile.dev
│ ├── Dockerfile.production
│ └── package.json
│
├── frontend/
│ ├── src/
│ ├── public/
│ ├── Dockerfile.dev
│ └── package.json
│
├── docker-compose.yml
├── .github/workflows/deploy.yml
└── README.md
```

Cada carpeta contiene su propio `package.json` y scripts.

---

## Instalación y ejecución (desarrollo)

Las instrucciones siguientes están pensadas para PowerShell en Windows. Ejecuta cada bloque por separado.

1) Clonar el repositorio

```powershell
git clone <REPO_URL>
cd "Fullstack_Test_01"
```

2) Backend (API)

```powershell
cd .\backend
npm install
# Crear .env según la sección "Variables de entorno"
npx prisma migrate dev
npm run dev
```

El servidor por defecto corre en `http://localhost:4000` y la documentación Swagger suele estar en `http://localhost:4000/api/docs`.

3) Frontend (SPA)

```powershell
cd ..\frontend
npm install
```

El frontend por defecto corre en `http://localhost:5173`.

---

## Variables de entorno (ejemplos)

Backend (`backend/.env`)

```env
PORT=4000
API_URL=http://localhost:4000/api
DATABASE_URL="mysql://root:password@localhost:3306/gestorpro"
JWT_SECRET=change_this_jwt_secret_locally
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:4000/api
VITE_WS_URL=ws://localhost:4000
VITE_NODE_ENV=development
VITE_APP_NAME="GestorPro"
```

---

## Crear archivos `.env` desde los ejemplos

Para evitar cometer secretos al repositorio, copia los archivos `*.env.example` a `*.env` y rellena los valores necesarios. Ejemplos (PowerShell):

```powershell
# Backend: copiar y editar
Copy-Item -Path .\backend\.env.example -Destination .\backend\.env
# Edita .\backend\.env con el editor que prefieras (notepad, code, etc.)

# Frontend: copiar y editar
Copy-Item -Path .\frontend\.env.example -Destination .\frontend\.env
# Edita .\frontend\.env
```

Buenas prácticas:

- Nunca subir `*.env` al control de versiones. Asegúrate que `.gitignore` contiene `*.env`.
- Usa secretos fuertes para `JWT_SECRET` y contraseñas de base de datos en entornos reales.
- Para producción considera un gestor de secretos (Azure Key Vault, AWS Secrets Manager, HashiCorp Vault, etc.).

---

## Docker (nota importante sobre env)

El `docker-compose.yml` del repo utiliza `env_file` para el servicio `backend` y `frontend`, por lo que debes crear `backend/.env` y `frontend/.env` antes de levantar con Docker. Evita poner secretos en el `docker-compose.yml`.

Levantar con:

```powershell
docker-compose up --build
```

---

## Comandos `docker-compose` y cuándo usarlos

Proporcionamos los comandos más comunes para levantar el stack con Docker Compose. Ejecuta los comandos desde la raíz del repositorio (`Fullstack_Test_01`).

- `docker-compose up --build` — Fuerza la recompilación de las imágenes antes de levantar los contenedores. Úsalo cuando:
	- Hagas cambios en `Dockerfile` o en dependencias (`package.json`).
	- Quieras asegurarte de que la última versión del código está incluida en las imágenes.

	Ejemplo (muestra logs en primer plano):

	```powershell
	docker-compose up --build
	```

- `docker-compose up` — Levanta los contenedores usando las imágenes ya construidas. Úsalo cuando:
	- No hiciste cambios en Dockerfile ni en dependencias.
	- Quieres levantar los servicios rápidamente reutilizando imágenes existentes.

	Ejemplo (en background):

	```powershell
	docker-compose up -d
	```

Notas:
- Si usas `env_file` (recomendado), asegúrate de haber creado `backend/.env` y `frontend/.env` desde los ejemplos antes de ejecutar `docker-compose up`.
- Para ver logs en background:

```powershell
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## Primer arranque (guía detallada)

Los siguientes pasos describen qué debe hacer una persona que ejecuta el proyecto por primera vez en su máquina (sin asumir que tenga nada ya configurado). Las instrucciones incluyen tanto la opción Docker como la opción de desarrollo local.

1) Clonar el repositorio

```powershell
git clone <REPO_URL>
cd "Fullstack_Test_01"
```

2) Crear archivos de entorno

```powershell
Copy-Item -Path .\backend\.env.example -Destination .\backend\.env
Copy-Item -Path .\frontend\.env.example -Destination .\frontend\.env
```

Edita `backend/.env` y `frontend/.env` según tu entorno (DB password, `JWT_SECRET`, `API_URL` si aplica).

3A) Opción recomendada: levantar con Docker (recomendado para evaluación)

- Construir y levantar todo (recomendado la primera vez):

```powershell
docker-compose up --build
```

- Si prefieres no reconstruir (arranques posteriores, sin cambios en Dockerfiles):

```powershell
docker-compose up -d
```

- Verifica servicios:

```powershell
docker-compose ps
docker-compose logs -f backend
```

3B) Opción alternativa: ejecutar en local (sin Docker)

- Backend (en una terminal):

```powershell
cd .\backend
npm install
# Generar cliente Prisma y ejecutar migraciones locales
npx prisma generate
npx prisma migrate dev
npm run dev
```

- Frontend (en otra terminal):

```powershell
cd ..\frontend
npm install
npm run dev
```

4) Migraciones Prisma (nota importante)

- El proyecto usa Prisma: las migraciones se encuentran en `backend/prisma/migrations`.
- Si levantas con Docker y tu contenedor de MySQL se crea por primera vez, desde el contenedor `backend` puedes ejecutar:

```powershell
# Entrar al contenedor backend (ejemplo)
docker exec -it <nombre_contenedor_backend> sh
# Dentro del contenedor
npx prisma migrate deploy
```

- Para desarrollo local, ejecuta desde la carpeta `backend`:

```powershell
npx prisma generate
npx prisma migrate dev
```

5) Endpoints y comprobaciones

- Frontend usualmente en `http://localhost` (si usaste Docker con nginx) o `http://localhost:5173` (dev).
- Backend API en `http://localhost:4000/api`.
- Swagger: `http://localhost:4000/docs`.

6) Credenciales de prueba

```
Usuario regular:
Email: alex@test.com
Contraseña: 123456

Administrador:
Email: admin@dev.com
Contraseña: 123456
```

---

## Migraciones y base de datos

Se usa Prisma para definir el esquema y ejecutar migraciones.

Comandos comunes (desde `backend`):

```powershell
npx prisma migrate dev       # ejecutar migraciones en desarrollo
npx prisma db push           # sincronizar esquema (sin generar migración)
npx prisma studio            # abrir GUI para explorar la BD
```

---

## Tests

Los tests del backend usan `Jest` + `Supertest`.

Ejecutar tests (desde `backend`):

```powershell
cd .\backend
npm test
```

Incluye pruebas para autenticación, recursos de proyectos, tareas y endpoints de estadísticas.

---

## Documentación de la API (Swagger)

La API expone documentación OpenAPI/Swagger en runtime (ruta por defecto `/api/docs`). La URL que Swagger muestra puede estar basada en `API_URL` (si está configurada en `backend/.env`).

---

## Autenticación y Roles

El sistema implementa autenticación basada en JWT con control de acceso por roles.

### Roles y permisos

- **Usuario (user)**: rol por defecto. Puede crear y gestionar sus propios proyectos y tareas.
- **Administrador (admin)**: puede eliminar cualquier proyecto. Acceso completo a estadísticas.

### Flujo de autenticación

1. Registro o login en `/auth/register` o `/auth/login`.
2. El servidor genera un JWT que contiene `{ id, role }`.
3. El frontend guarda el token en `localStorage` y lo envía en cada petición (header `Authorization: Bearer <token>`).
4. Las rutas protegidas validan el token y el rol según sea necesario.

### Rutas protegidas por rol

- `DELETE /api/projects/{id}` — solo administrador.
- Otras rutas (GET, POST, PUT) — requieren autenticación pero accesibles a cualquier rol.

---

## Buenas prácticas y recomendaciones

- Validaciones: migrar a `Zod` o `Joi` para esquemas y mensajes uniformes.
- Seguridad: usar refresh tokens para flujos largos y revocación segura si se requiere logout inmediato.
- Observabilidad: agregar logs estructurados y métricas para entornos productivos.

---

## Contribuir

1. Abrir un issue describiendo la propuesta.
2. Crear una rama con nombre `feature/descripcion-corta` o `fix/descripcion-corta`.
3. Abrir un Pull Request con descripción y pasos para reproducir.

---

## Aplicación en Producción

La aplicación está desplegada en **Railway** mediante un contenedor monolítico que incluye:

✔ **Backend (Express + TypeScript)**  
✔ **Frontend (React + Vite) servido por el backend**  
✔ **Prisma ORM + MySQL**  
✔ **Build multi-stage optimizado**  
✔ **CI/CD automático con GitHub Actions + Railway CLI**

### URL de Producción  
**https://fullstacktest01-production.up.railway.app/**

### Arquitectura del despliegue

El contenedor final contiene:

- Compilación del frontend (`npm run build`)
- Compilación del backend (`npm run build`)
- Copia del frontend al directorio `/public` del servidor Express
- Cliente Prisma generado
- Migraciones ejecutadas automáticamente vía:


### Dockerfile de Producción (multi-stage)

Este Dockerfile construye ambas partes y entrega un solo contenedor:

1. **Frontend builder** (Vite)
2. **Backend builder** (TS → JS)
3. **Contenedor final** (solo ejecuta Node)

Railway toma este Dockerfile directamente para construir la imagen final.

### CI/CD (GitHub Actions → Railway)

Cada push a la rama configurada ejecuta:

1. Verificación del proyecto Railway  
2. Construcción  
3. Deploy usando:

### 📦 Resultado

- Una sola imagen Docker optimizada  
- Migraciones Prisma aplicadas automáticamente  
- Frontend servido por Express en `/`  
- API accesible desde `/api`  
- Entorno de producción estable y reproducible  
- Deploy confiable con un solo push

---

> **Nota importante sobre el entorno de producción**
>
> La aplicación está actualmente desplegada en Railway bajo un **entorno gratuito**, lo cual implica que:
> - El servicio puede entrar en modo “sleep” si no recibe tráfico por un periodo prolongado.
> - El arranque inicial después de dormir puede tardar algunos segundos.
> - Los recursos asignados (CPU, RAM y tiempo de ejecución) son limitados.
>
> A pesar de estas restricciones, **el proyecto funciona correctamente** y cumple su propósito de demostración para la prueba técnica.  
>
> En entorno **local**, utilizando Docker Compose o ejecución directa del backend/frontend, el sistema corre sin limitaciones, con mejor rendimiento y sin tiempos de espera.

## Contacto

Autor: **Simon Guijarro**
Correo: **simon132000@hotmail.com**
Linkedin: **linkedin.com/in/saguijarro/es/**