#!/bin/sh
npx prisma migrate deploy

if [ ! -f "/app/.seed-completed" ]; then
  npx prisma migrate deploy
  npm run seed
  touch /app/.seed-completed
fi

npm run start:prod
