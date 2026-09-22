-- Preserve evidence and historical scan links atomically.
BEGIN;

-- DropForeignKey
ALTER TABLE "DomainProfile" DROP CONSTRAINT "DomainProfile_scanId_fkey";

-- DropIndex
DROP INDEX "DomainProfile_scanId_key";

-- DropIndex
DROP INDEX "DnsResult_scanId_recordType_idx";

-- AlterTable
ALTER TABLE "Scan" ADD COLUMN     "domainProfileId" TEXT;

-- Transfer every existing relationship before removing its old column.
UPDATE "Scan" AS s SET "domainProfileId" = d.id
FROM "DomainProfile" AS d WHERE d."scanId" = s.id;

-- AlterTable
ALTER TABLE "DomainProfile" DROP COLUMN "scanId",
ADD COLUMN     "retrievedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "DnsResult" ADD COLUMN     "retrievedAt" TIMESTAMP(3),
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'LEGACY_UNKNOWN';

-- AlterTable
ALTER TABLE "TlsResult" ADD COLUMN     "retrievedAt" TIMESTAMP(3),
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'LEGACY_UNKNOWN';

-- CreateIndex
CREATE INDEX "Scan_domainProfileId_idx" ON "Scan"("domainProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "DomainProfile_domain_source_retrievedAt_key" ON "DomainProfile"("domain", "source", "retrievedAt");

-- CreateIndex
CREATE INDEX "DnsResult_scanId_recordType_retrievedAt_idx" ON "DnsResult"("scanId", "recordType", "retrievedAt");

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_domainProfileId_fkey" FOREIGN KEY ("domainProfileId") REFERENCES "DomainProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Future writes must provide a source; timestamps remain null for legacy data.
ALTER TABLE "DnsResult" ALTER COLUMN "source" DROP DEFAULT;
ALTER TABLE "TlsResult" ALTER COLUMN "source" DROP DEFAULT;

COMMIT;
