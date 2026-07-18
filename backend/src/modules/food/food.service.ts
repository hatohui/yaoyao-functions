import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateFoodDto } from "./dto/create-food.dto";
import { prisma } from "../../libs/prisma";
import { v4 as uuidv4 } from "uuid";
import { CacheService } from "@libs/redis";
import { CacheSettings } from "@common/cache/constants";

@Injectable()
export class FoodService {
  async getPopularFoodIds(limit = 8): Promise<string[]> {
    const cacheKey = CacheSettings.food.popular.key;
    const cached = await CacheService.get<string[]>(cacheKey);
    if (cached) return cached;

    const grouped = await prisma.order.groupBy({
      by: ["variantId"],
      _sum: { quantity: true },
    });

    let popular: string[] = [];
    if (grouped.length > 0) {
      const variants = await prisma.foodVariant.findMany({
        where: { id: { in: grouped.map((g) => g.variantId) } },
        select: { id: true, foodId: true },
      });
      const variantToFood = new Map(variants.map((v) => [v.id, v.foodId]));
      const perFood = new Map<string, number>();
      for (const g of grouped) {
        const foodId = variantToFood.get(g.variantId);
        if (!foodId) continue;
        perFood.set(foodId, (perFood.get(foodId) ?? 0) + (g._sum.quantity ?? 0));
      }
      popular = [...perFood.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([foodId]) => foodId);
    }

    await CacheService.set(cacheKey, popular, CacheSettings.food.popular.ttl);
    return popular;
  }

  async findAll(lang = "en", page = 1, count = 20, categoryId = "all") {
    const offset = (page - 1) * count;

    const cacheKey = CacheSettings.food.all.key(lang, page, count, categoryId);

    const cachedFoods = await CacheService.get(cacheKey);
    if (cachedFoods) return cachedFoods;

    const where = {
      isAvailable: true,
      ...(categoryId !== "all" && categoryId !== "" ? { categoryId } : {}),
    };

    const [rawFoods, total, popularIds] = await Promise.all([
      prisma.food.findMany({
        where,
        skip: offset,
        take: count,
        include: {
          translations: { where: { language: lang } },
          variants: { where: { isAvailable: true }, orderBy: { price: "asc" } },
        },
      }),
      prisma.food.count({ where }),
      this.getPopularFoodIds(),
    ]);

    const popular = new Set(popularIds);
    const foods = rawFoods.map((f) => {
      const t = f.translations[0];
      const defaultVariant = f.variants[0] ?? null;
      return {
        id: f.id,
        name: t?.name ?? "",
        description: t?.description ?? null,
        imageUrl: f.imageUrl,
        categoryId: f.categoryId,
        isAvailable: f.isAvailable,
        isPopular: popular.has(f.id),
        defaultVariantId: defaultVariant?.id ?? null,
        price: defaultVariant?.price ? Number(defaultVariant.price) : null,
        currency: defaultVariant?.currency ?? null,
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

  async findOne(id: string, lang = "en") {
    const food = await prisma.food.findUnique({
      where: { id },
      include: {
        translations: { where: { language: lang } },
        variants: {
          include: { translations: { where: { language: lang } } },
        },
      },
    });
    if (!food) throw new NotFoundException("Food not found");

    const t = food.translations[0];
    return {
      id: food.id,
      name: t?.name ?? "",
      description: t?.description ?? null,
      imageUrl: food.imageUrl,
      categoryId: food.categoryId,
      isAvailable: food.isAvailable,
      variants: food.variants.map((v) => ({
        id: v.id,
        label: v.translations[0]?.label ?? "",
        price: v.price ? Number(v.price) : null,
        currency: v.currency,
        isSeasonal: v.isSeasonal,
        isAvailable: v.isAvailable,
      })),
    };
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
