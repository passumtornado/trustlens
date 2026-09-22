-- Preserve historical evidence and apply consistency checks atomically.
BEGIN;

-- CreateEnum
CREATE TYPE "ThreatResultStatus" AS ENUM ('MATCH', 'NO_MATCH', 'UNKNOWN', 'ERROR');

-- AlterTable
ALTER TABLE "ThreatResult" ADD COLUMN     "reference" TEXT,
ADD COLUMN     "status" "ThreatResultStatus" NOT NULL DEFAULT 'UNKNOWN',
ALTER COLUMN "detected" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Finding" ADD COLUMN     "createdAt" TIMESTAMP(3),
ADD COLUMN     "evidenceReference" TEXT,
ADD COLUMN     "scoreContribution" INTEGER;

-- Preserve the meaning of all previously recorded detection flags.
UPDATE "ThreatResult" SET status = CASE
  WHEN detected IS TRUE THEN 'MATCH'::"ThreatResultStatus"
  WHEN detected IS FALSE THEN 'NO_MATCH'::"ThreatResultStatus"
  ELSE 'UNKNOWN'::"ThreatResultStatus"
END;

ALTER TABLE "ThreatResult" ADD CONSTRAINT "ThreatResult_status_detected_check" CHECK (
  (status = 'MATCH' AND detected IS TRUE)
  OR (status = 'NO_MATCH' AND detected IS FALSE)
  OR (status IN ('UNKNOWN', 'ERROR') AND detected IS NULL)
);

-- Do not backfill guessed creation times or score contributions.
ALTER TABLE "Finding" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- Require a named source and either structured evidence or a source reference.
ALTER TABLE "Finding" ADD CONSTRAINT "Finding_provenance_check" CHECK (
  btrim(source) <> '' AND (
    NULLIF(btrim("evidenceReference"), '') IS NOT NULL
    OR COALESCE(jsonb_typeof(evidence) = 'object' AND evidence <> '{}'::jsonb, false)
  )
);

COMMIT;
