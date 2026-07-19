-- NOTE: this migration originally re-added people.account_id with a foreign key
-- to "account", but the previous migration drops that table and the Prisma
-- schema has no Account model. Those statements are removed so the history
-- replays from scratch; only the performance indexes remain.

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
