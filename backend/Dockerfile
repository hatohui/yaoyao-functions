FROM oven/bun:1-debian AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun x prisma generate
RUN bun run build

RUN cp -r node_modules/.prisma /tmp/prisma-generated \
    && bun install --frozen-lockfile --production \
    && cp -r /tmp/prisma-generated node_modules/.prisma

# ──────────────────────────────────────────────────────────────────

FROM node:20-slim

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:1.0.1 /lambda-adapter /opt/extensions/lambda-adapter

WORKDIR /var/task

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

ENV PORT=8080
ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
