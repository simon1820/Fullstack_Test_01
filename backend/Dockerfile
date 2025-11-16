# ============================
# 1) Etapa de construcción
# ============================
FROM node:20 AS builder

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Generar cliente Prisma
RUN npx prisma generate

# Compilar TypeScript (si aplica)
RUN npm run build

# ============================
# 2) Etapa de ejecución ligera
# ============================
FROM node:20-alpine AS runner

WORKDIR /app

# Copiar el dist ya compilado
COPY --from=builder /app/dist ./dist

# Copiar node_modules (producción)
COPY --from=builder /app/node_modules ./node_modules

# Copiar Prisma schema para migraciones
COPY --from=builder /app/prisma ./prisma

# Variables de entorno por defecto
ENV NODE_ENV=production

# Exponer el puerto
EXPOSE 4000

# Comando para iniciar la app
CMD ["node", "dist/server.js"]
