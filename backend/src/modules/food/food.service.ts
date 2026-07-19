import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { CreateFoodDto } from "./dto/create-food.dto";
import { UpdateFoodDto } from "./dto/update-food.dto";
import { AddFoodVariantDto } from "./dto/add-food-variant.dto";
import { UpdateFoodVariantDto } from "./dto/update-food-variant.dto";
import { prisma } from "../../libs/prisma";
import { v4 as uuidv4 } from "uuid";
import { CacheService } from "@libs/redis";
import { CacheSettings } from "@common/cache/constants";
import { AiService } from "@libs/gemini";

const FOOD_CACHE_PREFIX = "foods:";

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
        shouldCalculate: f.shouldCalculate,
      };
    });

    const result = { foods, page, count: foods.length, total };

    await CacheService.set(cacheKey, result, CacheSettings.food.all.ttl);

    return result;
  }

  private foodDetailInclude(lang: string) {
    return {
      translations: { where: { language: lang } },
      variants: {
        include: { translations: { where: { language: lang } } },
      },
    };
  }

  private toDetailDto(food: {
    id: string;
    imageUrl: string | null;
    categoryId: string;
    isAvailable: boolean;
    shouldCalculate: boolean;
    translations: { name: string; description: string | null }[];
    variants: {
      id: string;
      price: unknown;
      currency: string;
      isSeasonal: boolean;
      isAvailable: boolean;
      translations: { label: string }[];
    }[];
  }) {
    const t = food.translations[0];
    return {
      id: food.id,
      name: t?.name ?? "",
      description: t?.description ?? null,
      imageUrl: food.imageUrl,
      categoryId: food.categoryId,
      isAvailable: food.isAvailable,
      shouldCalculate: food.shouldCalculate,
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

  async findOne(id: string, lang = "en") {
    const food = await prisma.food.findUnique({
      where: { id },
      include: this.foodDetailInclude(lang),
    });
    if (!food) throw new NotFoundException("Food not found");
    return this.toDetailDto(food);
  }

  async findAllForAdmin(
    lang = "en",
    page = 1,
    count = 20,
    categoryId = "all",
    search?: string,
  ) {
    const offset = (page - 1) * count;
    const where = {
      ...(categoryId !== "all" && categoryId !== "" ? { categoryId } : {}),
      ...(search
        ? {
            translations: {
              some: { name: { contains: search, mode: "insensitive" as const } },
            },
          }
        : {}),
    };

    const [rawFoods, total] = await Promise.all([
      prisma.food.findMany({
        where,
        skip: offset,
        take: count,
        orderBy: { id: "asc" },
        include: this.foodDetailInclude(lang),
      }),
      prisma.food.count({ where }),
    ]);

    return {
      foods: rawFoods.map((f) => this.toDetailDto(f)),
      page,
      count: rawFoods.length,
      total,
    };
  }

  async create(dto: CreateFoodDto) {
    const foodId = uuidv4();
    const lang = dto.lang ?? "en";
    const food = await prisma.food.create({
      data: {
        id: foodId,
        imageUrl: dto.imageUrl,
        categoryId: dto.categoryId,
        shouldCalculate: dto.shouldCalculate ?? true,
        translations: {
          create: [
            {
              language: lang,
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
                  create: [{ language: lang, label: v.label }],
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
    await CacheService.deleteByPrefix(FOOD_CACHE_PREFIX);

    let aiTranslationFailed = false;
    if (dto.name || (dto.variants && dto.variants.length > 0)) {
      const vLabels = (dto.variants ?? [])
        .map((v, idx) => ({ id: food.variants[idx]?.id, label: v.label }))
        .filter((v) => v.id && v.label) as { id: string; label: string }[];
        
      const success = await AiService.translateFood(foodId, lang, dto.name, dto.description ?? null, vLabels);
      if (!success) aiTranslationFailed = true;
    }

    return { ...food, aiTranslationFailed };
  }

  async update(id: string, dto: UpdateFoodDto) {
    const existing = await prisma.food.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Food not found");

    const lang = dto.lang ?? "en";
    const food = await prisma.food.update({
      where: { id },
      data: {
        imageUrl: dto.imageUrl,
        categoryId: dto.categoryId,
        isAvailable: dto.isAvailable,
        shouldCalculate: dto.shouldCalculate,
        translations:
          dto.name !== undefined || dto.description !== undefined
            ? {
                upsert: {
                  where: { foodId_language: { foodId: id, language: lang } },
                  create: {
                    language: lang,
                    name: dto.name ?? "",
                    description: dto.description ?? null,
                  },
                  update: {
                    name: dto.name,
                    description: dto.description,
                  },
                },
              }
            : undefined,
      },
      include: { variants: { include: { translations: true } }, translations: true },
    });
    await CacheService.deleteByPrefix(FOOD_CACHE_PREFIX);

    let aiTranslationFailed = false;
    if (dto.name !== undefined || dto.description !== undefined) {
      const updatedT = food.translations.find((t) => t.language === lang);
      if (updatedT) {
        const success = await AiService.translateFood(id, lang, updatedT.name, updatedT.description ?? null, []);
        if (!success) aiTranslationFailed = true;
      }
    }

    return { ...food, aiTranslationFailed };
  }

  async remove(id: string) {
    const existing = await prisma.food.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Food not found");

    const orderCount = await prisma.order.count({
      where: { variant: { foodId: id } },
    });
    if (orderCount > 0) {
      throw new ConflictException(
        "This food has order history and can't be deleted — toggle its availability instead",
      );
    }

    await prisma.food.delete({ where: { id } });
    await CacheService.deleteByPrefix(FOOD_CACHE_PREFIX);
    return { id };
  }

  async bulkToggle(ids: string[], isAvailable: boolean) {
    await prisma.food.updateMany({
      where: { id: { in: ids } },
      data: { isAvailable },
    });
    await CacheService.deleteByPrefix(FOOD_CACHE_PREFIX);
    return { count: ids.length };
  }

  async bulkRemove(ids: string[]) {
    const withOrders = await prisma.order.findMany({
      where: { variant: { foodId: { in: ids } } },
      select: { variant: { select: { foodId: true } } },
      distinct: ["variantId"],
    });
    const blockedIds = new Set(withOrders.map((o) => o.variant.foodId));
    const deletableIds = ids.filter((id) => !blockedIds.has(id));

    await prisma.food.deleteMany({ where: { id: { in: deletableIds } } });
    await CacheService.deleteByPrefix(FOOD_CACHE_PREFIX);
    return { deleted: deletableIds.length, skipped: [...blockedIds] };
  }

  async addVariant(foodId: string, dto: AddFoodVariantDto) {
    const food = await prisma.food.findUnique({ where: { id: foodId } });
    if (!food) throw new NotFoundException("Food not found");

    const lang = dto.lang ?? "en";
    const variant = await prisma.foodVariant.create({
      data: {
        id: uuidv4(),
        foodId,
        price: dto.price,
        currency: dto.currency ?? "RM",
        isSeasonal: dto.isSeasonal ?? false,
        isAvailable: true,
        translations: { create: [{ language: lang, label: dto.label }] },
      },
      include: { translations: true },
    });
    await CacheService.deleteByPrefix(FOOD_CACHE_PREFIX);

    let aiTranslationFailed = false;
    if (dto.label) {
      const success = await AiService.translateFoodVariant(variant.id, lang, dto.label);
      if (!success) aiTranslationFailed = true;
    }

    return { ...variant, aiTranslationFailed };
  }

  async updateVariant(variantId: string, dto: UpdateFoodVariantDto) {
    const existing = await prisma.foodVariant.findUnique({ where: { id: variantId } });
    if (!existing) throw new NotFoundException("Food variant not found");

    const lang = dto.lang ?? "en";
    const variant = await prisma.foodVariant.update({
      where: { id: variantId },
      data: {
        price: dto.price,
        currency: dto.currency,
        isSeasonal: dto.isSeasonal,
        isAvailable: dto.isAvailable,
        translations:
          dto.label !== undefined
            ? {
                upsert: {
                  where: { variantId_language: { variantId, language: lang } },
                  create: { language: lang, label: dto.label },
                  update: { label: dto.label },
                },
              }
            : undefined,
      },
      include: { translations: true },
    });
    await CacheService.deleteByPrefix(FOOD_CACHE_PREFIX);

    let aiTranslationFailed = false;
    if (dto.label !== undefined) {
      const updatedT = variant.translations.find((t) => t.language === lang);
      if (updatedT) {
        const success = await AiService.translateFoodVariant(variantId, lang, updatedT.label);
        if (!success) aiTranslationFailed = true;
      }
    }

    return { ...variant, aiTranslationFailed };
  }

  async removeVariant(variantId: string) {
    const existing = await prisma.foodVariant.findUnique({ where: { id: variantId } });
    if (!existing) throw new NotFoundException("Food variant not found");

    const orderCount = await prisma.order.count({ where: { variantId } });
    if (orderCount > 0) {
      throw new ConflictException(
        "This variant has order history and can't be deleted — toggle its availability instead",
      );
    }

    await prisma.foodVariant.delete({ where: { id: variantId } });
    await CacheService.deleteByPrefix(FOOD_CACHE_PREFIX);
    return { id: variantId };
  }
}
