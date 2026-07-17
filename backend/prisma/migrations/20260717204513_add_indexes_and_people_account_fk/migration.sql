-- Add account_id column to people table
ALTER TABLE "people" ADD COLUMN "account_id" VARCHAR(255);

-- Create unique index on account_id (allows multiple NULLs, enforces uniqueness for non-NULL values)
CREATE UNIQUE INDEX "people_account_id_key" ON "people"("account_id") WHERE "account_id" IS NOT NULL;

-- Add foreign key constraint
ALTER TABLE "people" ADD CONSTRAINT "people_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Create indexes for query performance
CREATE INDEX "category_key_idx" ON "category"("key");
CREATE INDEX "food_category_id_is_available_idx" ON "food"("category_id", "is_available");
CREATE INDEX "food_variant_food_id_idx" ON "food_variant"("food_id");
CREATE INDEX "table_no_idx" ON "table"("no");
CREATE INDEX "people_table_id_idx" ON "people"("table_id");
CREATE INDEX "personal_note_person_id_idx" ON "personal_note"("person_id");
CREATE INDEX "order_table_id_created_at_idx" ON "order"("table_id", "created_at");
CREATE INDEX "order_created_at_idx" ON "order"("created_at");
CREATE INDEX "feedback_created_at_idx" ON "feedback"("created_at");
CREATE INDEX "preset_menu_food_variant_id_idx" ON "preset_menu_food"("variant_id");
