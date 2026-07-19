import { GoogleGenAI, Type, Schema } from "@google/genai";
import { prisma } from "./prisma";
import { CacheService } from "./redis";

const SUPPORTED_LOCALES = ["en", "vi", "zh", "th"];

let _ai: GoogleGenAI | null = null;
let _initialized = false;

function initializeAi() {
  if (_initialized) return;
  _initialized = true;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[Gemini] GEMINI_API_KEY not set, AI features disabled");
    return;
  }
  _ai = new GoogleGenAI({ apiKey });
}

function getTargetLocales(sourceLang: string): string[] {
  return SUPPORTED_LOCALES.filter((l) => l !== sourceLang);
}

export const AiService = {
  async translateCategory(
    categoryId: string,
    sourceLang: string,
    name: string,
    description: string | null
  ): Promise<boolean> {
    initializeAi();
    if (!_ai) return false;
    if (!name && !description) return false;

    const targets = getTargetLocales(sourceLang);
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {},
      required: targets,
    };

    for (const lang of targets) {
      schema.properties![lang] = {
        type: Type.OBJECT,
        properties: {},
      };
      if (name) schema.properties![lang].properties!["name"] = { type: Type.STRING };
      if (description)
        schema.properties![lang].properties!["description"] = { type: Type.STRING };
    }

    try {
      const prompt = `Translate the following category from '${sourceLang}' to: ${targets.join(
        ", "
      )}.\n\nJSON Data:\n${JSON.stringify({ name, description })}`;

      const response = await _ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.3,
        },
      });

      const text = response.text;
      if (!text) return false;
      const translations = JSON.parse(text) as Record<
        string,
        { name?: string; description?: string }
      >;

      for (const lang of targets) {
        const data = translations[lang];
        if (!data || !data.name) continue;

        await prisma.categoryTranslation.upsert({
          where: { categoryId_language: { categoryId, language: lang } },
          create: {
            categoryId,
            language: lang,
            name: data.name,
            description: data.description ?? null,
          },
          update: {
            name: data.name,
            description: data.description ?? null,
          },
        });
      }
      await CacheService.deleteByPrefix("categories:");
      return true;
    } catch (err) {
      console.error("[Gemini] Failed to translate category", err);
      return false;
    }
  },

  async translateFood(
    foodId: string,
    sourceLang: string,
    name: string,
    description: string | null,
    variants: { id: string; label: string }[]
  ): Promise<boolean> {
    initializeAi();
    if (!_ai) return false;

    const targets = getTargetLocales(sourceLang);
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {},
      required: targets,
    };

    for (const lang of targets) {
      schema.properties![lang] = {
        type: Type.OBJECT,
        properties: {},
      };
      if (name) schema.properties![lang].properties!["name"] = { type: Type.STRING };
      if (description)
        schema.properties![lang].properties!["description"] = { type: Type.STRING };
      if (variants && variants.length > 0) {
        schema.properties![lang].properties!["variants"] = {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              label: { type: Type.STRING },
            },
          },
        };
      }
    }

    try {
      const payload = { name, description, variants };
      const prompt = `Translate the following food and its variants from '${sourceLang}' to: ${targets.join(
        ", "
      )}.\nPreserve the variant IDs exactly as provided.\n\nJSON Data:\n${JSON.stringify(
        payload
      )}`;

      const response = await _ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.3,
        },
      });

      const text = response.text;
      if (!text) return false;
      const translations = JSON.parse(text) as Record<
        string,
        { name?: string; description?: string; variants?: { id: string; label: string }[] }
      >;

      for (const lang of targets) {
        const data = translations[lang];
        if (!data) continue;

        if (data.name) {
          await prisma.foodTranslation.upsert({
            where: { foodId_language: { foodId, language: lang } },
            create: {
              foodId,
              language: lang,
              name: data.name,
              description: data.description ?? null,
            },
            update: {
              name: data.name,
              description: data.description ?? null,
            },
          });
        }

        if (data.variants && Array.isArray(data.variants)) {
          for (const v of data.variants) {
            if (!v.id || !v.label) continue;
            await prisma.foodVariantTranslation.upsert({
              where: { variantId_language: { variantId: v.id, language: lang } },
              create: {
                variantId: v.id,
                language: lang,
                label: v.label,
              },
              update: {
                label: v.label,
              },
            });
          }
        }
      }
      await CacheService.deleteByPrefix("foods:");
      return true;
    } catch (err) {
      console.error("[Gemini] Failed to translate food", err);
      return false;
    }
  },

  async translateFoodVariant(variantId: string, sourceLang: string, label: string): Promise<boolean> {
    initializeAi();
    if (!_ai) return false;
    if (!label) return false;

    const targets = getTargetLocales(sourceLang);
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {},
      required: targets,
    };

    for (const lang of targets) {
      schema.properties![lang] = {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
        },
      };
    }

    try {
      const prompt = `Translate the following food variant label from '${sourceLang}' to: ${targets.join(
        ", "
      )}.\n\nJSON Data:\n${JSON.stringify({ label })}`;

      const response = await _ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.3,
        },
      });

      const text = response.text;
      if (!text) return false;
      const translations = JSON.parse(text) as Record<string, { label?: string }>;

      for (const lang of targets) {
        const data = translations[lang];
        if (!data || !data.label) continue;

        await prisma.foodVariantTranslation.upsert({
          where: { variantId_language: { variantId, language: lang } },
          create: {
            variantId,
            language: lang,
            label: data.label,
          },
          update: {
            label: data.label,
          },
        });
      }
      await CacheService.deleteByPrefix("foods:");
      return true;
    } catch (err) {
      console.error("[Gemini] Failed to translate variant", err);
      return false;
    }
  },
};
