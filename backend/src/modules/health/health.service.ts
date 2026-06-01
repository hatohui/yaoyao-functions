import { Injectable } from '@nestjs/common';
import { RedisService } from '@Redis/redis.service';
import { prisma } from '../../prisma';

@Injectable()
export class HealthService {
  constructor(private redis: RedisService) {}

  async checkDatabase(): Promise<void> {
    await prisma.$queryRaw`SELECT 1`;
  }

  async checkRedis(): Promise<void> {
    const result = await this.redis.ping();
    if (result !== 'PONG') throw new Error('Redis ping failed');
  }
}
