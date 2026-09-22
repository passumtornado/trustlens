-- Preserve existing scans; never invent ownership or historical stages.
BEGIN;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "Scan" WHERE "userId" IS NULL) THEN
    RAISE EXCEPTION 'Cannot require scan ownership: resolve ownerless scans before applying this migration';
  END IF;
END $$;

-- CreateEnum
CREATE TYPE "ScanStage" AS ENUM ('VALIDATION', 'DNS_SECURITY_CHECKS', 'DOMAIN_ANALYSIS', 'TLS_ANALYSIS', 'THREAT_INTELLIGENCE', 'WEBSITE_ANALYSIS', 'BRAND_ANALYSIS', 'RISK_ANALYSIS', 'REPORT_GENERATION');

-- DropForeignKey
ALTER TABLE "Scan" DROP CONSTRAINT "Scan_userId_fkey";

-- AlterTable
ALTER TABLE "Scan" ADD COLUMN     "failedStage" "ScanStage",
ADD COLUMN     "failureCode" VARCHAR(64),
ADD COLUMN     "failureMessage" VARCHAR(256),
ADD COLUMN     "stage" "ScanStage",
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'QUEUED';

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Defaults apply only to future scans; legacy stages remain unknown.
ALTER TABLE "Scan" ALTER COLUMN "stage" SET DEFAULT 'VALIDATION';
COMMIT;
