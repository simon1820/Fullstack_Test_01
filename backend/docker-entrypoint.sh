#!/bin/sh
set -e

echo "[entrypoint] Esperando a MySQL..."
sleep 3

if [ -d "./prisma/migrations" ] && [ "$(ls -A ./prisma/migrations)" ]; then
  echo "[entrypoint] Migraciones encontradas. Ejecutando prisma migrate deploy..."
  npx prisma migrate deploy
else
  echo "[entrypoint] NO hay migraciones. Ejecutando prisma db push..."
  npx prisma db push
fi

echo "[entrypoint] Iniciando servidor Node..."
exec npm run start
