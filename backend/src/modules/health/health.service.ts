import { Injectable } from "@nestjs/common";
import { prisma } from "@libs/prisma";
import { CacheService } from "@libs/redis";
import { Prisma } from "@prisma/client";

@Injectable()
export class HealthService {
  async checkDatabase(): Promise<{ latency: number }> {
    const start = Date.now();
    await prisma.$queryRaw(Prisma.sql`SELECT 1`);
    return { latency: Date.now() - start };
  }

  async checkRedis(): Promise<{ latency: number }> {
    const start = Date.now();
    const result = await CacheService.ping();
    if (result !== "PONG") throw new Error("Redis ping failed");
    return { latency: Date.now() - start };
  }

  getSystemMetrics() {
    const mem = process.memoryUsage();
    return {
      uptime: Math.floor(process.uptime()),
      memory: {
        heapUsed: mem.heapUsed,
        heapTotal: mem.heapTotal,
        rss: mem.rss,
      },
    };
  }
}
