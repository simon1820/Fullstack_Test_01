###############################################
# 1) Build FRONTEND (Vite)
###############################################
FROM node:20 AS frontend_builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend .
RUN npm run build


###############################################
# 2) Build BACKEND (TypeScript + Prisma)
###############################################
FROM node:20 AS backend_builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend .

# Generar Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build


###############################################
# 3) Final Image - Ejecuta el MONOLITO
###############################################
FROM node:20-alpine AS runner

WORKDIR /app

# Copiar backend compilado
COPY --from=backend_builder /app/backend/dist ./dist
COPY --from=backend_builder /app/backend/node_modules ./node_modules
COPY --from=backend_builder /app/backend/prisma ./prisma

# Copiar build del frontend y servirlo desde Express
COPY --from=frontend_builder /app/frontend/dist ./public

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["node", "dist/server.js"]
