FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma 7 reads DATABASE_URL from prisma.config.ts at generate time.
# Provide a dummy value so code generation works without a real DB.
ARG DATABASE_URL=postgresql://build:build@localhost:5432/build
ENV DATABASE_URL=${DATABASE_URL}

# Generate Prisma Client for database queries and types during compilation
RUN npx prisma generate

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# TCF audio scripts (auto-import + background seed)
COPY --from=builder --chown=nextjs:nodejs /app/src/lib/content ./src/lib/content
COPY --from=builder --chown=nextjs:nodejs /app/src/lib/tcf-tts-server.ts ./src/lib/tcf-tts-server.ts
COPY --chown=nextjs:nodejs scripts/tcf-audio-background.sh ./scripts/tcf-audio-background.sh

RUN mkdir -p public/tcf-audio && chown nextjs:nodejs public/tcf-audio

# Copy pre-installed and pre-generated dependencies (including compiled Prisma Client) from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh /app/scripts/tcf-audio-background.sh

# Make locally-installed CLIs (prisma, tsx) available on PATH
ENV PATH="/app/node_modules/.bin:$PATH"

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "server.js"]

