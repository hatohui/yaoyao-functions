import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from '@Redis/redis.service';
import { prisma } from '../../prisma';

const CACHE_TTL = 3600;

@Injectable()
export class CategoryService {
  constructor(private redis: RedisService) {}

  async findAll(lang = 'en') {
    const cacheKey = `categories:all:${lang}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const categories = await prisma.$queryRaw<any[]>`
      SELECT c.id, COALESCE(ct.name, c.name) AS name, COALESCE(ct.description, c.description) AS description
      FROM category c
      LEFT JOIN category_translation ct ON c.id = ct.category_id AND ct.language = ${lang}
    `;

    await this.redis.set(cacheKey, JSON.stringify(categories), CACHE_TTL);
    return categories;
  }

  async findOne(id: string, lang = 'en') {
    const cacheKey = `categories:${id}:${lang}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const rows = await prisma.$queryRaw<any[]>`
      SELECT c.id, COALESCE(ct.name, c.name) AS name, COALESCE(ct.description, c.description) AS description
      FROM category c
      LEFT JOIN category_translation ct ON c.id = ct.category_id AND ct.language = ${lang}
      WHERE c.id = ${id}
      LIMIT 1
    `;

    if (!rows.length) throw new NotFoundException('Category not found');

    await this.redis.set(cacheKey, JSON.stringify(rows[0]), CACHE_TTL);
    return rows[0];
  }
}
