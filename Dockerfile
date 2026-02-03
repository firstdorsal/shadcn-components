# 0. build stage
FROM node:23-alpine AS build-stage
WORKDIR /build
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# 1. execution stage
FROM pektin/feoco
COPY --from=build-stage /build/dist/ /public/
