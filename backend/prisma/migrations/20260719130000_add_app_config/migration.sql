-- Admin-editable key-value configuration: feature toggles and system parameters.
-- `type` tells consumers how to parse `value`; `is_public` gates whether a row
-- may be served to guests (feature flags that drive UI) vs. admin-only params.
CREATE TABLE "app_config" (
    "key" VARCHAR(255) NOT NULL,
    "value" TEXT NOT NULL,
    "type" VARCHAR(20) NOT NULL DEFAULT 'string',
    "category" VARCHAR(100),
    "label" VARCHAR(255),
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_config_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "app_config_category_idx" ON "app_config"("category");

-- Seed default settings so a fresh `migrate deploy` (no seed step) still boots
-- with a working admin gate and feature flags. Idempotent: admin edits survive.
INSERT INTO "app_config" ("key", "value", "type", "category", "label", "is_public", "updated_at") VALUES
  ('auth.adminPassphrase', 'barkbark', 'string', 'auth', 'Admin passphrase', false, now()),
  ('event.pinLength', '4', 'number', 'event', 'Guest PIN length', true, now()),
  ('table.defaultCapacity', '8', 'number', 'tables', 'Default table capacity', true, now()),
  ('feedback.suggestedReactions', '["👍","❤️","😂","🎉","🔥"]', 'json', 'feedback', 'Suggested reactions', true, now()),
  ('feature.feedbackWall', 'true', 'boolean', 'features', 'Feedback wall', true, now()),
  ('feature.floorPlan', 'true', 'boolean', 'features', 'Floor-plan map', true, now())
ON CONFLICT ("key") DO NOTHING;
