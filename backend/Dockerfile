FROM oven/bun:1-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .
RUN bun x prisma generate

EXPOSE 8080

CMD ["bun", "run", "start:dev"]
