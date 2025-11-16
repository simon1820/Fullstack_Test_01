FROM node:20 AS frontend_builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN npm run build

FROM node:20 AS backend_builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY backend ./
RUN npm run build

FROM node:20

WORKDIR /app

COPY --from=backend_builder /app/backend/dist ./dist
COPY --from=backend_builder /app/backend/node_modules ./node_modules
COPY --from=backend_builder /app/backend/prisma ./prisma

COPY --from=frontend_builder /app/frontend/dist ./public

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["sh", "-c", "npx prisma generate && node dist/server.js"]