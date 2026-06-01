-- CreateTable
CREATE TABLE "language" (
    "code" VARCHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "direction" VARCHAR(10) NOT NULL DEFAULT 'LTR',

    CONSTRAINT "language_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "category" (
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_translation" (
    "category_id" VARCHAR(255) NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,

    CONSTRAINT "category_translation_pkey" PRIMARY KEY ("category_id","language")
);

-- CreateTable
CREATE TABLE "food" (
    "id" VARCHAR(255) NOT NULL,
    "image_url" VARCHAR(500),
    "category_id" VARCHAR(255) NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_translation" (
    "food_id" VARCHAR(255) NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,

    CONSTRAINT "food_translation_pkey" PRIMARY KEY ("food_id","language")
);

-- CreateTable
CREATE TABLE "food_variant" (
    "id" VARCHAR(255) NOT NULL,
    "food_id" VARCHAR(255) NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "price" DECIMAL(10,2),
    "currency" VARCHAR(10) NOT NULL DEFAULT 'RM',
    "is_seasonal" BOOLEAN NOT NULL DEFAULT false,
    "is_available" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "food_variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "table" (
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "table_leader_id" VARCHAR(255),
    "is_staging" BOOLEAN NOT NULL DEFAULT false,
    "no" INTEGER NOT NULL DEFAULT -1,

    CONSTRAINT "table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people" (
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "table_id" VARCHAR(255),

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_note" (
    "id" VARCHAR(255) NOT NULL,
    "person_id" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "personal_note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "user_id" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" VARCHAR(255) NOT NULL,
    "table_id" VARCHAR(255) NOT NULL,
    "variant_id" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10,2) NOT NULL,
    "ordered_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback" (
    "id" VARCHAR(255) NOT NULL,
    "by" VARCHAR(255),
    "content" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preset_menu" (
    "id" VARCHAR(255) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "preset_menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preset_menu_food" (
    "preset_id" VARCHAR(255) NOT NULL,
    "variant_id" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "preset_menu_food_pkey" PRIMARY KEY ("preset_id","variant_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "table_name_key" ON "table"("name");

-- CreateIndex
CREATE UNIQUE INDEX "table_table_leader_id_key" ON "table"("table_leader_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_username_key" ON "account"("username");

-- AddForeignKey
ALTER TABLE "category_translation" ADD CONSTRAINT "category_translation_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_translation" ADD CONSTRAINT "category_translation_language_fkey" FOREIGN KEY ("language") REFERENCES "language"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food" ADD CONSTRAINT "food_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_translation" ADD CONSTRAINT "food_translation_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_translation" ADD CONSTRAINT "food_translation_language_fkey" FOREIGN KEY ("language") REFERENCES "language"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_variant" ADD CONSTRAINT "food_variant_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "table"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_note" ADD CONSTRAINT "personal_note_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "table"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "food_variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preset_menu_food" ADD CONSTRAINT "preset_menu_food_preset_id_fkey" FOREIGN KEY ("preset_id") REFERENCES "preset_menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preset_menu_food" ADD CONSTRAINT "preset_menu_food_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "food_variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
