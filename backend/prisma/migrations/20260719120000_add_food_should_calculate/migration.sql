-- Add should_calculate flag to food (joke/gag menu items that guests can order
-- and see a normal price for, but that should not count toward table/split totals)
ALTER TABLE "food" ADD COLUMN "should_calculate" BOOLEAN NOT NULL DEFAULT true;
