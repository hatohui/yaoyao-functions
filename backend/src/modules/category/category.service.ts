import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@libs/prisma";
import { CacheSettings } from "@common/cache/constants";
import { CacheService } from "@libs/redis";

@Injectable()
export class CategoryService {
  async findAll(lang = "en") {
    const cacheKey = CacheSettings.categories.all.key(lang);
    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    const rows = await prisma.category.findMany({
      include: { translations: { where: { language: lang } } },
    });

    const categories = rows.map((c) => {
      const t = c.translations[0];
      return {
        id: c.id,
        key: c.key,
        name: t?.name ?? null,
        description: t?.description ?? null,
        isAvailable: c.isAvailable,
      };
    });

    await CacheService.set(cacheKey, categories, CacheSettings.categories.all.ttl);
    return categories;
  }

  async findOne(id: string, lang = "en") {
    const cacheKey = CacheSettings.categories.one.key(id, lang);
    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    const row = await prisma.category.findUnique({
      where: { id },
      include: { translations: { where: { language: lang } } },
    });

    if (!row) throw new NotFoundException("Category not found");

    const t = row.translations[0];
    const category = {
      id: row.id,
      key: row.key,
      name: t?.name ?? null,
      description: t?.description ?? null,
      isAvailable: row.isAvailable,
    };

    await CacheService.set(cacheKey, category, CacheSettings.categories.one.ttl);
    return category;
  }
}
