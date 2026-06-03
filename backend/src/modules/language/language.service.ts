import { Injectable } from "@nestjs/common";
import { prisma } from "../../libs/prisma";
import { CacheService } from "@libs/redis";
import { CacheSettings } from "@common/cache/constants";

@Injectable()
export class LanguageService {
  async findAll() {
    const cached = await CacheService.get(CacheSettings.languages.all.key);
    if (cached) return cached;

    const languages = await prisma.language.findMany();
    await CacheService.set(
      CacheSettings.languages.all.key,
      JSON.stringify(languages),
      CacheSettings.languages.all.ttl,
    );
    return languages;
  }

  async findCodes() {
    const cached = await CacheService.get(CacheSettings.languages.codes.key);
    if (cached) return cached;

    const languages = await prisma.language.findMany({
      select: { code: true },
    });

    const codes = languages.map((l) => l.code);

    await CacheService.set(
      CacheSettings.languages.codes.key,
      codes,
      CacheSettings.languages.codes.ttl,
    );
    return codes;
  }
}
