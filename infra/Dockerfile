# ── Stage 1 : dépendances ────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ── Stage 2 : build Next.js ───────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# Variables publiques baked au build (NEXT_PUBLIC_* ne peuvent pas être runtime)
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_CONTACT_EMAIL
ARG NEXT_PUBLIC_CONTACT_PHONE
ARG NEXT_PUBLIC_WHATSAPP_NUMBER
ARG NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_CONTACT_EMAIL=$NEXT_PUBLIC_CONTACT_EMAIL
ENV NEXT_PUBLIC_CONTACT_PHONE=$NEXT_PUBLIC_CONTACT_PHONE
ENV NEXT_PUBLIC_WHATSAPP_NUMBER=$NEXT_PUBLIC_WHATSAPP_NUMBER
ENV NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL=$NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL
# Cette image est celle de la PRODUCTION auto-hébergée (hors Vercel, qui seul définit VERCEL_ENV). Le code lit cette variable
# pour : app/robots.ts (sans « production » : `Disallow: /` — Google ne peut pas explorer le site ; vérifié), lib/content/resources.ts
# (masquage des brouillons et des ressources futures « en production ») et lib/seo/metadata.ts (noindex des aperçus).
# robots.txt et les pages statiques sont figés AU BUILD : la variable doit donc exister ici, pas seulement à l'exécution.
ENV VERCEL_ENV=production
# Stub serveur pour que le build compile sans Resend
ENV RESEND_API_KEY=build-stub
ENV LEADS_TO_EMAIL=build-stub@example.com
ENV LEADS_FROM_EMAIL=build-stub@example.com

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p /app/public
RUN pnpm build

# ── Stage 3 : image de production (standalone) ────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Voir l'étape builder : le code lit VERCEL_ENV (ressources, noindex) aussi à l'exécution.
ENV VERCEL_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
