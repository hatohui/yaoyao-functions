-- Split the physical spot (TableSlot) from the per-event seating (Table).
-- A slot's number and floor-plan position are arranged once and reused every
-- event; a Table is one event's seating at that slot.

CREATE TABLE "table_slot" (
    "id" VARCHAR(255) NOT NULL,
    "no" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "x" DOUBLE PRECISION,
    "y" DOUBLE PRECISION,
    "default_capacity" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "table_slot_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "table_slot_no_key" ON "table_slot"("no");
CREATE INDEX "table_slot_no_idx" ON "table_slot"("no");

DROP INDEX IF EXISTS "table_no_idx";

ALTER TABLE "table" DROP COLUMN "no";
ALTER TABLE "table" DROP COLUMN "x";
ALTER TABLE "table" DROP COLUMN "y";
ALTER TABLE "table" DROP COLUMN "name";
ALTER TABLE "table" ADD COLUMN "slot_id" VARCHAR(255);

CREATE INDEX "table_slot_id_idx" ON "table"("slot_id");
CREATE UNIQUE INDEX "table_slot_id_event_id_key" ON "table"("slot_id", "event_id");

ALTER TABLE "table" ADD CONSTRAINT "table_slot_id_fkey"
    FOREIGN KEY ("slot_id") REFERENCES "table_slot"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
