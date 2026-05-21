# 1. Dependensi untuk build (termasuk devDependencies)
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2. Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# 3. Dependensi untuk production saja (tanpa devDependencies)
FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# 4. Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Salin node_modules produksi penuh agar script migrasi eksternal memiliki semua modul yang dibutuhkan
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/lib/db/migrations ./lib/db/migrations
COPY --from=builder /app/scripts/migrate.js ./scripts/migrate.js

EXPOSE 3000
CMD ["sh", "-c", "node scripts/migrate.js && node server.js"]
