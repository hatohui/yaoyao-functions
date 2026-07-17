-- CreateTable
CREATE TABLE "feedback_reaction" (
    "feedback_id" VARCHAR(255) NOT NULL,
    "emoji" VARCHAR(16) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "feedback_reaction_pkey" PRIMARY KEY ("feedback_id","emoji")
);

-- AddForeignKey
ALTER TABLE "feedback_reaction" ADD CONSTRAINT "feedback_reaction_feedback_id_fkey" FOREIGN KEY ("feedback_id") REFERENCES "feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;
