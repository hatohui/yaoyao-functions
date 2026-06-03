import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateFoodDto } from "./dto/create-food.dto";
import { prisma } from "../../libs/prisma";
import { v4 as uuidv4 } from "uuid";
import { CacheService } from "@libs/redis";
import { CacheSettings } from "@common/cache/constants";

@Injectable()
export class FoodService {
  async findAll(lang = "en", page = 1, count = 20, categoryId = "all") {
    const offset = (page - 1) * count;

    const cacheKey = CacheSettings.food.all.key(lang, page, count, categoryId);

    const cachedFoods = await CacheService.get(cacheKey);
    if (cachedFoods) return cachedFoods;

    const where = {
      isAvailable: true,
      ...(categoryId !== "all" && categoryId !== "" ? { categoryId } : {}),
    };

    const [rawFoods, total] = await Promise.all([
      prisma.food.findMany({
        where,
        skip: offset,
        take: count,
        include: { translations: { where: { language: lang } } },
      }),
      prisma.food.count({ where }),
    ]);

    const foods = rawFoods.map((f) => {
      const t = f.translations[0];
      return {
        id: f.id,
        name: t?.name ?? "",
        description: t?.description ?? null,
        imageUrl: f.imageUrl,
        categoryId: f.categoryId,
        isAvailable: f.isAvailable,
      };
    });

    const result = { foods, page, count: foods.length, total };

    await CacheService.set(
      cacheKey,
      JSON.stringify(result),
      CacheSettings.food.all.ttl,
    );

    return result;
  }

  async create(dto: CreateFoodDto) {
    const foodId = uuidv4();
    const food = await prisma.food.create({
      data: {
        id: foodId,
        imageUrl: dto.imageUrl,
        categoryId: dto.categoryId,
        translations: {
          create: [
            {
              language: "en",
              name: dto.name,
              description: dto.description ?? null,
            },
          ],
        },
        variants: dto.variants
          ? {
              create: dto.variants.map((v) => ({
                id: uuidv4(),
                price: v.price,
                currency: v.currency ?? "RM",
                isSeasonal: v.isSeasonal ?? false,
                isAvailable: true,
                translations: {
                  create: [{ language: "en", label: v.label }],
                },
              })),
            }
          : undefined,
      },
      include: {
        variants: { include: { translations: true } },
        translations: true,
      },
    });
    return food;
  }
}
