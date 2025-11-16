# =========================================================
# 1) Build del frontend
# =========================================================
FROM node:20 AS frontend_builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN npm run build


# =========================================================
# 2) Build del backend (SIN prisma generate)
# =========================================================
FROM node:20 AS backend_builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend ./
RUN npm run build


# =========================================================
# 3) Imagen final
# =========================================================
FROM node:20

WORKDIR /app

# Copiar backend compilado
COPY --from=backend_builder /app/backend/dist ./dist
COPY --from=backend_builder /app/backend/node_modules ./node_modules

# Copiar frontend compilado
COPY --from=frontend_builder /app/frontend/dist ./public

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

# ✔ Prisma se ejecuta EN RUNTIME (cuando Railway sí pasa DATABASE_URL)
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node dist/server.js"]