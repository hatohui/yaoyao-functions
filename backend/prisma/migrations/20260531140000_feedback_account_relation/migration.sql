-- Connect Feedback.by → Account.user_id as a proper FK
ALTER TABLE "feedback"
  ADD CONSTRAINT "feedback_by_fkey"
  FOREIGN KEY ("by") REFERENCES "account"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
