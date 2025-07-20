# Multi-Stage Build für Next.js Anwendung
FROM node:18-alpine AS base

# Installiere Abhängigkeiten nur wenn nötig
FROM base AS deps
# Prüfe https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine um zu verstehen, warum libc6-compat nötig ist
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Kopiere package.json und package-lock.json
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild der Anwendung
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Setze Umgebungsvariablen für den Build
ENV NEXT_TELEMETRY_DISABLED 1

# Baue die Anwendung
RUN npm run build

# Production Image, kopiere alle Dateien und führe next aus
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Kopiere die public-Dateien zuerst
COPY --from=builder /app/public ./public

# Setze die korrekten Berechtigungen für prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatisch nutzen Sie die Ausgabe von 'npm run build'
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Stelle sicher, dass nextjs user Zugriff auf public hat
RUN chown -R nextjs:nodejs ./public

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Server wird mit 'node server.js' gestartet
CMD ["node", "server.js"] 