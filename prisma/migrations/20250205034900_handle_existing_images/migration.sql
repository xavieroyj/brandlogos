-- Create a temporary GenerationSession for existing images
INSERT INTO "GenerationSession" (
  "id",
  "userId",
  "prompt",
  "style",
  "brandName",
  "tags",
  "createdAt",
  "updatedAt"
)
SELECT 
  'legacy_session_' || "userId" as "id",
  "userId",
  'Legacy Image' as "prompt",
  'Legacy' as "style",
  'Legacy Brand' as "brandName",
  ARRAY[]::text[] as "tags",
  MIN("createdAt") as "createdAt",
  MIN("updatedAt") as "updatedAt"
FROM "GeneratedImage"
WHERE "sessionId" IS NULL
GROUP BY "userId";

-- Update existing images to point to the legacy session
UPDATE "GeneratedImage"
SET "sessionId" = 'legacy_session_' || "userId"
WHERE "sessionId" IS NULL;

-- Now add the NOT NULL constraint
ALTER TABLE "GeneratedImage" 
ALTER COLUMN "sessionId" SET NOT NULL;

-- Add the new indices
CREATE INDEX "Credit_userId_resetDate_idx" ON "Credit"("userId", "resetDate");
CREATE INDEX "GenerationSession_userId_createdAt_idx" ON "GenerationSession"("userId", "createdAt");