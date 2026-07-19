import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import {
  CONFIG_DEFAULTS,
  serializeConfigValue,
} from '../src/common/config/registry';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const DATA_DIR = path.join(__dirname, 'data');

// ── Types ────────────────────────────────────────────────────────────────────

interface CategoryEntry {
  key: string;
}

interface CategoryTranslationEntry {
  name: string;
  description?: string;
}

interface CategoriesFile {
  categories: CategoryEntry[];
  translations: Record<string, CategoryTranslationEntry[]>;
}

interface FoodVariantTranslationEntry {
  label: string;
}

interface FoodVariantEntry {
  price?: number;
  currency?: string;
  isSeasonal?: boolean;
  translations?: Record<string, FoodVariantTranslationEntry>;
}

interface FoodTranslationEntry {
  name: string;
  description?: string;
}

interface FoodEntry {
  imageUrl?: string;
  variants?: FoodVariantEntry[];
  translations?: Record<string, FoodTranslationEntry>;
}

interface FoodFile {
  key: string;
  items: FoodEntry[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function readFoodFiles(): FoodFile[] {
  const foodsDir = path.join(DATA_DIR, 'foods');
  return fs
    .readdirSync(foodsDir)
    .filter((f: string) => f.endsWith('.json'))
    .map((f: string) => readJson<FoodFile>(path.join(foodsDir, f)));
}

// ── Seed ─────────────────────────────────────────────────────────────────────

async function seedLanguages() {
  const languages = [
    { code: 'en', name: 'English', direction: 'LTR' },
    { code: 'zh', name: '中文', direction: 'LTR' },
    { code: 'vi', name: 'Tiếng Việt', direction: 'LTR' },
    { code: 'th', name: 'ภาษาไทย', direction: 'LTR' },
  ];

  for (const lang of languages) {
    await prisma.language.upsert({
      where: { code: lang.code },
      update: {},
      create: lang,
    });
  }
  console.log(`✓ Languages (${languages.length})`);
}

async function seedConfig() {
  for (const c of CONFIG_DEFAULTS) {
    await prisma.appConfig.upsert({
      where: { key: c.key },
      update: {},
      create: {
        key: c.key,
        value: serializeConfigValue(c.type, c.value),
        type: c.type,
        category: c.category,
        label: c.label,
        isPublic: c.isPublic,
      },
    });
  }
  console.log(`✓ App config (${CONFIG_DEFAULTS.length} settings)`);
}

async function seedCategories(): Promise<Record<string, string>> {
  const { categories, translations }: CategoriesFile = readJson(
    path.join(DATA_DIR, 'categories.json'),
  );

  const categoryIds: Record<string, string> = {};

  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];

    const existing = await prisma.category.findUnique({ where: { key: cat.key } });
    const id = existing?.id ?? uuidv4();

    await prisma.category.upsert({
      where: { key: cat.key },
      update: {},
      create: { id, key: cat.key },
    });

    categoryIds[cat.key] = id;

    for (const [lang, langTranslations] of Object.entries(translations)) {
      const t = langTranslations[i];
      if (!t) continue;
      await prisma.categoryTranslation.upsert({
        where: { categoryId_language: { categoryId: id, language: lang } },
        update: {},
        create: { categoryId: id, language: lang, name: t.name, description: t.description ?? null },
      });
    }
  }

  console.log(`✓ Categories (${categories.length}) with translations`);
  return categoryIds;
}

const SEED_EVENT_ID = 'seed-event';
const SEED_EVENT_PIN = '4821';

async function seedEvent() {
  await prisma.event.deleteMany({ where: { isActive: true } });
  await prisma.event.upsert({
    where: { id: SEED_EVENT_ID },
    update: { isActive: true, pin: SEED_EVENT_PIN },
    create: {
      id: SEED_EVENT_ID,
      pin: SEED_EVENT_PIN,
      name: "Tonight's dinner",
      isActive: true,
    },
  });
  console.log(`✓ Active event (PIN ${SEED_EVENT_PIN})`);
}

async function seedTables() {
  const tables: { name: string; capacity: number }[] = readJson(
    path.join(DATA_DIR, 'tables.json'),
  );

  for (let i = 0; i < tables.length; i++) {
    const t = tables[i];
    const id = `${SEED_EVENT_ID}-table-${i + 1}`;
    await prisma.table.upsert({
      where: { id },
      update: { name: t.name, capacity: t.capacity, no: i + 1 },
      create: {
        id,
        name: t.name,
        capacity: t.capacity,
        no: i + 1,
        eventId: SEED_EVENT_ID,
      },
    });
  }

  console.log(`✓ Tables (${tables.length})`);
}

async function seedFoods(categoryIds: Record<string, string>) {
  const foodFiles = readFoodFiles();
  let totalFoods = 0;

  for (const file of foodFiles) {
    const categoryId = categoryIds[file.key];
    if (!categoryId) {
      console.warn(`  ⚠ No category found for key "${file.key}", skipping`);
      continue;
    }

    for (const food of file.items) {
      const foodId = uuidv4();

      await prisma.food.create({
        data: {
          id: foodId,
          imageUrl: food.imageUrl ?? null,
          categoryId,
          isAvailable: true,
          variants: food.variants
            ? {
                create: food.variants.map((v) => ({
                  id: uuidv4(),
                  price: v.price ?? null,
                  currency: v.currency ?? 'RM',
                  isSeasonal: v.isSeasonal ?? false,
                  isAvailable: true,
                  translations: v.translations
                    ? {
                        create: Object.entries(v.translations)
                          .filter(([, t]) => t.label)
                          .map(([lang, t]) => ({
                            language: lang,
                            label: t.label,
                          })),
                      }
                    : undefined,
                })),
              }
            : undefined,
          translations: food.translations
            ? {
                create: Object.entries(food.translations).map(([lang, t]) => ({
                  language: lang,
                  name: t.name,
                  description: t.description ?? null,
                })),
              }
            : undefined,
        },
      });

      totalFoods++;
    }
  }

  console.log(`✓ Foods (${totalFoods} across ${foodFiles.length} categories)`);
}

async function main() {
  const withSampleData = process.argv.includes('--with-sample-data');

  console.log('🌱 Seeding core data...\n');
  await seedLanguages();
  await seedConfig();
  const categoryIds = await seedCategories();
  await seedFoods(categoryIds);

  if (withSampleData) {
    console.log('\n🧪 Seeding sample data...\n');
    await seedEvent();
    await seedTables();
  }

  console.log(
    `\n✅ Seed complete!${withSampleData ? '' : ' (core only — pass --with-sample-data for demo content)'}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
