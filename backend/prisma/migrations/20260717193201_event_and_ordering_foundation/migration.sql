/*
  Warnings:

  - You are about to drop the column `ordered_by` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `account_id` on the `people` table. All the data in the column will be lost.
  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "feedback" DROP CONSTRAINT "feedback_by_fkey";

-- DropForeignKey
ALTER TABLE "people" DROP CONSTRAINT "people_account_id_fkey";

-- DropForeignKey
ALTER TABLE "people" DROP CONSTRAINT "people_table_id_fkey";

-- DropIndex
DROP INDEX "table_name_key";

-- AlterTable
ALTER TABLE "feedback" ADD COLUMN     "event_id" VARCHAR(255);

-- AlterTable
ALTER TABLE "order" DROP COLUMN "ordered_by",
ADD COLUMN     "event_id" VARCHAR(255),
ADD COLUMN     "split_all" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "people" DROP COLUMN "account_id",
ADD COLUMN     "event_id" VARCHAR(255);

-- AlterTable
ALTER TABLE "table" ADD COLUMN     "event_id" VARCHAR(255),
ADD COLUMN     "x" DOUBLE PRECISION,
ADD COLUMN     "y" DOUBLE PRECISION;

-- DropTable
DROP TABLE "account";

-- CreateTable
CREATE TABLE "event" (
    "id" VARCHAR(255) NOT NULL,
    "pin" VARCHAR(10) NOT NULL,
    "name" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "preset_menu_id" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_split" (
    "order_id" VARCHAR(255) NOT NULL,
    "person_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "order_split_pkey" PRIMARY KEY ("order_id","person_id")
);

-- CreateIndex
CREATE INDEX "event_is_active_idx" ON "event"("is_active");

-- CreateIndex
CREATE INDEX "order_split_person_id_idx" ON "order_split"("person_id");

-- CreateIndex
CREATE INDEX "feedback_event_id_idx" ON "feedback"("event_id");

-- CreateIndex
CREATE INDEX "order_event_id_idx" ON "order"("event_id");

-- CreateIndex
CREATE INDEX "people_event_id_idx" ON "people"("event_id");

-- CreateIndex
CREATE INDEX "table_event_id_idx" ON "table"("event_id");

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_preset_menu_id_fkey" FOREIGN KEY ("preset_menu_id") REFERENCES "preset_menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "table" ADD CONSTRAINT "table_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "table"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_split" ADD CONSTRAINT "order_split_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_split" ADD CONSTRAINT "order_split_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
