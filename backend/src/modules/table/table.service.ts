import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from '@Redis/redis.service';
import { prisma } from '../../prisma';

const CACHE_TTL = 1800;

@Injectable()
export class TableService {
  constructor(private redis: RedisService) {}

  async findAll() {
    const cacheKey = 'tables:all';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const tables = await prisma.table.findMany({ orderBy: { no: 'asc' } });
    await this.redis.set(cacheKey, JSON.stringify(tables), CACHE_TTL);
    return tables;
  }

  async findOne(id: string) {
    const cacheKey = `tables:${id}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const table = await prisma.table.findUnique({ where: { id } });
    if (!table) throw new NotFoundException('Table not found');

    await this.redis.set(cacheKey, JSON.stringify(table), CACHE_TTL);
    return table;
  }
}
