-- Remove food_variant_translation rows where label is empty
DELETE FROM "food_variant_translation" WHERE "label" = '';
