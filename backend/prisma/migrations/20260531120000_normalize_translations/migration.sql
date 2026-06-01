-- ── Category: add key + isAvailable, migrate name→key, drop name/description ─

-- 1. Add key as nullable so existing rows don't fail
ALTER TABLE "category" ADD COLUMN "key" VARCHAR(255);

-- 2. Populate key from the existing name column
UPDATE "category" SET "key" = "name";

-- 3. Enforce NOT NULL + UNIQUE now that all rows have a value
ALTER TABLE "category" ALTER COLUMN "key" SET NOT NULL;
CREATE UNIQUE INDEX "category_key_key" ON "category"("key");

-- 4. Add isAvailable with a safe default
ALTER TABLE "category" ADD COLUMN "is_available" BOOLEAN NOT NULL DEFAULT true;

-- 5. Drop old columns
ALTER TABLE "category" DROP COLUMN "name";
ALTER TABLE "category" DROP COLUMN "description";

-- ── FoodVariant: create translation table, migrate label, drop label ──────────

-- 6. Create food_variant_translation table
CREATE TABLE "food_variant_translation" (
    "variant_id" VARCHAR(255) NOT NULL,
    "language"   VARCHAR(10)  NOT NULL,
    "label"      VARCHAR(255) NOT NULL,

    CONSTRAINT "food_variant_translation_pkey" PRIMARY KEY ("variant_id", "language")
);

-- 7. Migrate existing label data as 'en' translations
INSERT INTO "food_variant_translation" ("variant_id", "language", "label")
SELECT "id", 'en', "label"
FROM "food_variant";

-- 8. Add foreign keys on the new table
ALTER TABLE "food_variant_translation"
    ADD CONSTRAINT "food_variant_translation_variant_id_fkey"
    FOREIGN KEY ("variant_id") REFERENCES "food_variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "food_variant_translation"
    ADD CONSTRAINT "food_variant_translation_language_fkey"
    FOREIGN KEY ("language") REFERENCES "language"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- 9. Drop label from food_variant
ALTER TABLE "food_variant" DROP COLUMN "label";
