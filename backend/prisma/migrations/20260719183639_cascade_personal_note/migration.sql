-- DropForeignKey
ALTER TABLE "personal_note" DROP CONSTRAINT "personal_note_person_id_fkey";

-- AddForeignKey
ALTER TABLE "personal_note" ADD CONSTRAINT "personal_note_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;
