import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "../../libs/prisma";
import { CacheService } from "@libs/redis";
import { CacheSettings } from "@common/cache/constants";

@Injectable()
export class TableService {
  async findAll() {
    const cacheKey = CacheSettings.tables.all.key;
    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    const tables = await prisma.table.findMany({ orderBy: { no: "asc" } });
    await CacheService.set(cacheKey, tables, CacheSettings.tables.all.ttl);
    return tables;
  }

  async findOne(id: string) {
    const cacheKey = CacheSettings.tables.one.key(id);
    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    const table = await prisma.table.findUnique({ where: { id } });
    if (!table) throw new NotFoundException("Table not found");

    await CacheService.set(cacheKey, table, CacheSettings.tables.one.ttl);
    return table;
  }
}
