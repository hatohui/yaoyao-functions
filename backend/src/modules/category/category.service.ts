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

    const categories = await prisma.category.findMany({
      include: {
        translations: {
          where: {
            language: lang,
          },
        },
      },
    });

    await CacheService.set(
      cacheKey,
      categories,
      CacheSettings.categories.all.ttl,
    );
    return categories;
  }

  async findOne(id: string, lang = "en") {
    const cacheKey = CacheSettings.categories.one.key(id, lang);
    const cached = await CacheService.get(cacheKey);

    if (cached) return cached;

    const rows = await prisma.category.findUnique({
      where: { id },
      include: {
        translations: {
          where: {
            language: lang,
          },
        },
      },
    });

    if (!rows) throw new NotFoundException("Category not found");

    await CacheService.set(cacheKey, rows, CacheSettings.categories.one.ttl);
    return rows;
  }
}
