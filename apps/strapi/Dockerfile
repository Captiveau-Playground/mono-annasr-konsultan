# This is PRODUCTION Dockerfile for Strapi in Turborepo.
# It's assumed that this Dockerfile is run from the root of the monorepo.

# Related references:
# - https://docs.strapi.io/dev-docs/installation/docker#production-dockerfile
# - https://github.com/vercel/turbo/blob/main/examples/with-docker/apps/api/Dockerfile

# Customize APP (name of folder in /apps) and WORKSPACE (name from package.json) to match this app
ARG APP=strapi
ARG WORKSPACE=@repo/strapi

FROM node:24-alpine AS base

RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git > /dev/null 2>&1

# Install pnpm globally
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@11.1.1 --activate
RUN pnpm config set verify-deps-before-run false

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set working directory
WORKDIR /app

# ---
FROM base AS prepare
ARG WORKSPACE

# Install turbo globally to prune below
RUN pnpm add -g turbo@2.9.18

COPY . .

# see https://turbo.build/repo/docs/reference/command-line-reference#turbo-prune---scopetarget
RUN turbo prune ${WORKSPACE} --docker

# ---
FROM base AS builder

ARG APP

# Install turbo globally to use during build below
RUN pnpm add -g turbo@2.9.18
# Install node-gyp globally to build native addons
RUN pnpm add -g node-gyp

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=prepare /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Override NODE_ENV for build stage to install all dependencies including devDependencies
# They (typescrip, tailwindcss etc.) are needed during build and pnpm would skip them from the start
ENV NODE_ENV=development

# see https://github.com/moby/buildkit/blob/master/frontend/dockerfile/docs/reference.md#run---mounttypecache
RUN \
    --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prefer-offline --ignore-scripts

ENV PATH=/app/apps/${APP}/node_modules/.bin:$PATH

# Build the project and its dependencies
COPY --from=prepare /app/out/full/ .
COPY turbo.json turbo.json

RUN turbo run build

# Remove devDependencies after build to reduce image size; lalu link-kan ulang
# symlink workspace (.bin) yang ikut terhapus oleh prune.
RUN pnpm prune --prod --ignore-scripts --config.confirmModulesPurge=false \
    && pnpm install --prod --frozen-lockfile --offline --ignore-scripts

# ---
FROM node:24-alpine AS runner

# curl untuk healthcheck; vips untuk sharp/media runtime
RUN apk add --no-cache vips-dev bash curl

ARG APP
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Don't run production as root
RUN addgroup --system --gid 1001 strapi
RUN adduser --system --uid 1001 strapi

WORKDIR /app
COPY --from=builder --chown=strapi:strapi /app /app
# Bersihkan cache ringan saja — dist/build (admin) dan source dibiarkan.
RUN rm -rf /app/node_modules/.pnpm-store /app/apps/strapi/.cache /app/apps/strapi/.tmp /app/apps/strapi/tests /app/apps/strapi/vitest.config.* 2>/dev/null || true

ENV PATH=/app/apps/${APP}/node_modules/.bin:$PATH

USER strapi
WORKDIR /app/apps/${APP}
EXPOSE ${PORT:-1337}
# Healthcheck: route Strapi /api/health.
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -fsS http://localhost:${PORT:-1337}/api/health || exit 1
CMD ["node", "scripts/seed-runner.mjs", "start"]
