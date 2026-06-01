import { Injectable } from '@nestjs/common';
import { RedisService } from '@Redis/redis.service';
import { prisma } from '../../prisma';

const CACHE_TTL = 3600;
const CACHE_KEY_ALL = 'languages:all';
const CACHE_KEY_CODES = 'languages:codes';

@Injectable()
export class LanguageService {
  constructor(private redis: RedisService) {}

  async findAll() {
    const cached = await this.redis.get(CACHE_KEY_ALL);
    if (cached) return JSON.parse(cached);

    const languages = await prisma.language.findMany();
    await this.redis.set(CACHE_KEY_ALL, JSON.stringify(languages), CACHE_TTL);
    return languages;
  }

  async findCodes() {
    const cached = await this.redis.get(CACHE_KEY_CODES);
    if (cached) return JSON.parse(cached);

    const languages = await prisma.language.findMany({ select: { code: true } });
    const codes = languages.map((l) => l.code);
    await this.redis.set(CACHE_KEY_CODES, JSON.stringify(codes), CACHE_TTL);
    return codes;
  }
}
