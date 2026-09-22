-- Add metadata only; no legacy artifact references are fabricated.
BEGIN;

-- CreateEnum
CREATE TYPE "ArtifactType" AS ENUM ('SCREENSHOT', 'HTML_CAPTURE', 'BROWSER_CAPTURE', 'OTHER');

-- AlterTable
ALTER TABLE "WebsiteSnapshot" ADD COLUMN     "artifactType" "ArtifactType",
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "mimeType" VARCHAR(127),
ADD COLUMN     "r2ObjectKey" VARCHAR(1024),
ADD COLUMN     "sizeBytes" BIGINT,
ADD COLUMN     "width" INTEGER;

-- CreateIndex
CREATE INDEX "WebsiteSnapshot_scanId_idx" ON "WebsiteSnapshot"("scanId");

-- CreateIndex
CREATE INDEX "WebsiteSnapshot_expiresAt_idx" ON "WebsiteSnapshot"("expiresAt");

-- Page-only observations stay valid; a stored artifact needs complete metadata.
ALTER TABLE "WebsiteSnapshot" ADD CONSTRAINT "WebsiteSnapshot_artifact_metadata_check" CHECK (
  ("artifactType" IS NULL AND "r2ObjectKey" IS NULL AND "mimeType" IS NULL
    AND "sizeBytes" IS NULL AND width IS NULL AND height IS NULL AND "expiresAt" IS NULL)
  OR
  ("artifactType" IS NOT NULL AND "r2ObjectKey" IS NOT NULL
    AND btrim("r2ObjectKey") <> '' AND "r2ObjectKey" !~ '^[a-zA-Z][a-zA-Z0-9+.-]*:'
    AND "mimeType" IS NOT NULL AND "mimeType" ~ '^[^[:space:]/]+/[^[:space:]/]+$'
    AND "sizeBytes" IS NOT NULL AND "sizeBytes" >= 0
    AND ((width IS NULL AND height IS NULL)
      OR (width IS NOT NULL AND height IS NOT NULL AND width > 0 AND height > 0))
    AND ("expiresAt" IS NULL OR "expiresAt" > "createdAt"))
);

COMMIT;
