-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ScanStatus" AS ENUM ('PENDING', 'QUEUED', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "Verdict" AS ENUM ('LIKELY_SAFE', 'LOW_RISK', 'CAUTION', 'SUSPICIOUS', 'HIGH_RISK', 'KNOWN_MALICIOUS', 'IMPERSONATION', 'INSUFFICIENT_EVIDENCE');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'system',
    "emailAlerts" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scan" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "inputUrl" TEXT NOT NULL,
    "normalizedUrl" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "rootDomain" TEXT NOT NULL,
    "subdomain" TEXT,
    "tld" TEXT,
    "status" "ScanStatus" NOT NULL DEFAULT 'PENDING',
    "riskScore" INTEGER,
    "confidence" DOUBLE PRECISION,
    "verdict" "Verdict",
    "riskEngineVersion" TEXT,
    "scannerVersion" TEXT,
    "modelVersion" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DomainProfile" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "registrar" TEXT,
    "registrationDate" TIMESTAMP(3),
    "expirationDate" TIMESTAMP(3),
    "updatedDate" TIMESTAMP(3),
    "domainAgeDays" INTEGER,
    "registrantOrganization" TEXT,
    "registrantCountry" TEXT,
    "nameservers" TEXT[],
    "dnssec" BOOLEAN,
    "status" TEXT[],
    "source" TEXT NOT NULL,

    CONSTRAINT "DomainProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DnsResult" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "ttl" INTEGER,
    "priority" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DnsResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TlsResult" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL,
    "issuer" TEXT,
    "subject" TEXT,
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "hostnameMatches" BOOLEAN,
    "sanEntries" TEXT[],
    "errors" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TlsResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThreatResult" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "detected" BOOLEAN NOT NULL,
    "categories" TEXT[],
    "confidence" DOUBLE PRECISION,
    "rawData" JSONB,
    "checkedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThreatResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteSnapshot" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "requestedUrl" TEXT NOT NULL,
    "finalUrl" TEXT,
    "title" TEXT,
    "description" TEXT,
    "screenshotUrl" TEXT,
    "faviconUrl" TEXT,
    "statusCode" INTEGER,
    "redirects" JSONB,
    "externalDomains" TEXT[],
    "technologies" TEXT[],
    "htmlHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebsiteSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandCandidate" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "officialDomain" TEXT,
    "officialUrl" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL,
    "domainSimilarity" DOUBLE PRECISION,
    "textualSimilarity" DOUBLE PRECISION,
    "visualSimilarity" DOUBLE PRECISION,
    "evidence" JSONB,

    CONSTRAINT "BrandCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Finding" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "evidence" JSONB,

    CONSTRAINT "Finding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiAnalysis" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "explanation" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "userId" TEXT,
    "verdict" "Verdict" NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "summary" TEXT NOT NULL,
    "riskEngineVersion" TEXT NOT NULL,
    "modelVersion" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- CreateIndex
CREATE INDEX "Scan_userId_createdAt_idx" ON "Scan"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Scan_status_idx" ON "Scan"("status");

-- CreateIndex
CREATE INDEX "Scan_rootDomain_idx" ON "Scan"("rootDomain");

-- CreateIndex
CREATE UNIQUE INDEX "DomainProfile_scanId_key" ON "DomainProfile"("scanId");

-- CreateIndex
CREATE INDEX "DnsResult_scanId_recordType_idx" ON "DnsResult"("scanId", "recordType");

-- CreateIndex
CREATE UNIQUE INDEX "TlsResult_scanId_key" ON "TlsResult"("scanId");

-- CreateIndex
CREATE INDEX "ThreatResult_scanId_provider_idx" ON "ThreatResult"("scanId", "provider");

-- CreateIndex
CREATE INDEX "Finding_scanId_severity_idx" ON "Finding"("scanId", "severity");

-- CreateIndex
CREATE UNIQUE INDEX "AiAnalysis_scanId_key" ON "AiAnalysis"("scanId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_scanId_key" ON "Report"("scanId");

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainProfile" ADD CONSTRAINT "DomainProfile_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DnsResult" ADD CONSTRAINT "DnsResult_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TlsResult" ADD CONSTRAINT "TlsResult_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreatResult" ADD CONSTRAINT "ThreatResult_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsiteSnapshot" ADD CONSTRAINT "WebsiteSnapshot_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandCandidate" ADD CONSTRAINT "BrandCandidate_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finding" ADD CONSTRAINT "Finding_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiAnalysis" ADD CONSTRAINT "AiAnalysis_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
