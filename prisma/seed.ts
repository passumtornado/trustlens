import "dotenv/config";

import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

if (process.env.NODE_ENV === "production") {
  throw new Error("Refusing to seed while NODE_ENV=production");
}

if (!databaseUrl.includes("neon.tech")) {
  throw new Error("Refusing to seed a non-Neon database");
}

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: databaseUrl }),
});

const DEMO_EMAIL = "demo@trustlens.dev";
const RISK_ENGINE_VERSION = "1.0.0";
const SCANNER_VERSION = "1.0.0";
const MODEL_VERSION = "seed-data-v1";

const scenarios = [
  {
    id: "seed_scan_established",
    domain: "example.com",
    status: "COMPLETED",
    riskScore: 8,
    confidence: 96,
    verdict: "LIKELY_SAFE",
    createdAt: "2026-09-10T08:00:00Z",
    summary:
      "Established development scenario with valid TLS and no simulated threat matches.",
  },
  {
    id: "seed_scan_low_risk",
    domain: "example.org",
    status: "COMPLETED",
    riskScore: 27,
    confidence: 88,
    verdict: "LOW_RISK",
    createdAt: "2026-09-11T09:15:00Z",
    summary:
      "Low-risk development scenario with minor uncertainty and no strong malicious indicators.",
  },
  {
    id: "seed_scan_caution",
    domain: "new-demo-store.test",
    status: "COMPLETED",
    riskScore: 52,
    confidence: 72,
    verdict: "CAUTION",
    createdAt: "2026-09-12T10:30:00Z",
    summary:
      "Caution scenario representing a recently registered fictional store domain.",
  },
  {
    id: "seed_scan_suspicious",
    domain: "account-security-demo.test",
    status: "COMPLETED",
    riskScore: 71,
    confidence: 86,
    verdict: "SUSPICIOUS",
    createdAt: "2026-09-13T11:00:00Z",
    summary:
      "Suspicious scenario with simulated login and redirect indicators.",
  },
  {
    id: "seed_scan_high_risk",
    domain: "unknown-shop.test",
    status: "COMPLETED",
    riskScore: 87,
    confidence: 93,
    verdict: "HIGH_RISK",
    createdAt: "2026-09-14T12:00:00Z",
    summary: "High-risk scenario with simulated threat-intelligence evidence.",
  },
  {
    id: "seed_scan_impersonation",
    domain: "paypa1-secure-login.test",
    status: "COMPLETED",
    riskScore: 92,
    confidence: 96,
    verdict: "IMPERSONATION",
    createdAt: "2026-09-15T13:00:00Z",
    summary:
      "Fictional PayPal impersonation scenario using a typosquatted reserved domain.",
  },
  {
    id: "seed_scan_malicious",
    domain: "malicious-demo.test",
    status: "COMPLETED",
    riskScore: 98,
    confidence: 99,
    verdict: "KNOWN_MALICIOUS",
    createdAt: "2026-09-16T14:00:00Z",
    summary: "Fictional known-malicious simulation for development UI testing.",
  },
  {
    id: "seed_scan_insufficient",
    domain: "limited-evidence.test",
    status: "COMPLETED",
    riskScore: null,
    confidence: 25,
    verdict: "INSUFFICIENT_EVIDENCE",
    createdAt: "2026-09-17T08:30:00Z",
    summary: null,
  },
  {
    id: "seed_scan_active",
    domain: "shop-under-review.test",
    status: "RUNNING",
    riskScore: null,
    confidence: null,
    verdict: null,
    createdAt: "2026-09-18T08:00:00Z",
    summary: null,
  },
  {
    id: "seed_scan_failed",
    domain: "unreachable-demo.test",
    status: "FAILED",
    riskScore: null,
    confidence: null,
    verdict: null,
    createdAt: "2026-09-18T09:00:00Z",
    summary: null,
  },
] as const;

const seedScanIds = scenarios.map(({ id }) => id);

function urlFor(domain: string) {
  return `https://${domain}/`;
}

async function removeSeedRecords() {
  const profiles = await prisma.domainProfile.findMany({
    where: { scans: { some: { id: { in: seedScanIds } } } },
    select: { id: true },
  });
  const where = { scanId: { in: seedScanIds } };
  await prisma.report.deleteMany({ where });
  await prisma.aiAnalysis.deleteMany({ where });
  await prisma.finding.deleteMany({ where });
  await prisma.brandCandidate.deleteMany({ where });
  await prisma.websiteSnapshot.deleteMany({ where });
  await prisma.threatResult.deleteMany({ where });
  await prisma.tlsResult.deleteMany({ where });
  await prisma.dnsResult.deleteMany({ where });
  await prisma.scan.deleteMany({ where: { id: { in: seedScanIds } } });
  // Preserve profiles reused by scans outside this seed.
  await prisma.domainProfile.deleteMany({
    where: { id: { in: profiles.map(({ id }) => id) }, scans: { none: {} } },
  });
}

async function createScans(userId: string) {
  for (const scenario of scenarios) {
    const createdAt = new Date(scenario.createdAt);
    const completedAt =
      scenario.status === "COMPLETED"
        ? new Date(createdAt.getTime() + 20_000)
        : null;
    const url = urlFor(scenario.domain);

    await prisma.scan.create({
      data: {
        id: scenario.id,
        userId,
        submittedUrl: url,
        normalizedUrl: url,
        hostname: scenario.domain,
        normalizedDomain: scenario.domain,
        tld: scenario.domain.split(".").at(-1),
        status: scenario.status,
        stage: scenario.status === "COMPLETED" ? "REPORT_GENERATION"
          : scenario.status === "FAILED" ? "WEBSITE_ANALYSIS" : "THREAT_INTELLIGENCE",
        failureCode: scenario.status === "FAILED" ? "DEMO_CONNECTION_FAILURE" : null,
        failureMessage: scenario.status === "FAILED" ? "The demo website could not be reached." : null,
        failedStage: scenario.status === "FAILED" ? "WEBSITE_ANALYSIS" : null,
        riskScore: scenario.riskScore,
        confidence: scenario.confidence,
        verdict: scenario.verdict,
        riskEngineVersion: RISK_ENGINE_VERSION,
        scannerVersion: SCANNER_VERSION,
        modelVersion: MODEL_VERSION,
        startedAt: createdAt,
        completedAt,
        createdAt,
        updatedAt: createdAt,
      },
    });

    if (
      scenario.status === "COMPLETED" &&
      scenario.riskScore !== null &&
      scenario.confidence !== null &&
      scenario.verdict !== null &&
      scenario.summary !== null
    ) {
      await prisma.report.create({
        data: {
          scanId: scenario.id,
          userId,
          verdict: scenario.verdict,
          riskScore: scenario.riskScore,
          confidence: scenario.confidence,
          summary: scenario.summary,
          riskEngineVersion: RISK_ENGINE_VERSION,
          modelVersion: MODEL_VERSION,
          generatedAt: completedAt ?? createdAt,
        },
      });
    }
  }
}

async function createEvidence() {
  const domainProfiles = scenarios.map((scenario, index) => ({
    normalizedDomain: scenario.domain,
    retrievedAt: new Date(scenario.createdAt),
    registrar: "DEMO_REGISTRAR",
    registrationDate: new Date(`202${index % 4}-01-01T00:00:00Z`),
    expirationDate: new Date("2027-01-01T00:00:00Z"),
    updatedDate: new Date("2026-01-01T00:00:00Z"),
    domainAgeDays:
      scenario.id === "seed_scan_established" ? 3200 : index < 2 ? 900 : 12,
    registrantOrganization: "TrustLens Seed Data",
    registrantCountry: "DE",
    nameservers: ["ns1.demo.test", "ns2.demo.test"],
    dnssec: index % 3 !== 2,
    status: ["clientTransferProhibited"],
    source: "SEED_DATA",
  }));
  for (const [index, profile] of domainProfiles.entries()) {
    const scenario = scenarios[index];
    if (!scenario) throw new Error("Missing seed scenario");
    await prisma.scan.update({
      where: { id: scenario.id },
      data: {
        domainProfile: {
          connectOrCreate: {
            where: {
              normalizedDomain_source_retrievedAt: {
                normalizedDomain: profile.normalizedDomain,
                source: profile.source,
                retrievedAt: profile.retrievedAt,
              },
            },
            create: profile,
          },
        },
      },
    });
  }

  await prisma.dnsResult.createMany({
    data: scenarios.flatMap((scenario, index) => [
      {
        scanId: scenario.id,
        source: "SEED_DATA",
        retrievedAt: new Date(scenario.createdAt),
        recordType: "A",
        value: `192.0.2.${index + 1}`,
        ttl: 300,
        priority: null,
      },
      {
        scanId: scenario.id,
        source: "SEED_DATA",
        retrievedAt: new Date(scenario.createdAt),
        recordType: "AAAA",
        value: "2001:db8::1",
        ttl: 300,
        priority: null,
      },
      {
        scanId: scenario.id,
        source: "SEED_DATA",
        retrievedAt: new Date(scenario.createdAt),
        recordType: "MX",
        value: "mail.demo.test",
        ttl: 300,
        priority: 10,
      },
      {
        scanId: scenario.id,
        source: "SEED_DATA",
        retrievedAt: new Date(scenario.createdAt),
        recordType: "NS",
        value: "ns1.demo.test",
        ttl: 3600,
        priority: null,
      },
    ]),
  });

  await prisma.tlsResult.createMany({
    data: scenarios.map((scenario) => ({
      scanId: scenario.id,
      source: "SEED_DATA",
      retrievedAt: new Date(scenario.createdAt),
      valid: !["seed_scan_suspicious", "seed_scan_failed"].includes(
        scenario.id,
      ),
      issuer: "DEMO_CERTIFICATE_AUTHORITY",
      subject: scenario.domain,
      validFrom: new Date("2026-01-01T00:00:00Z"),
      validTo: new Date("2027-01-01T00:00:00Z"),
      hostnameMatches: !["seed_scan_suspicious", "seed_scan_failed"].includes(
        scenario.id,
      ),
      sanEntries: [scenario.domain],
      errors:
        scenario.id === "seed_scan_failed" ? ["DEMO_CONNECTION_FAILURE"] : [],
    })),
  });

  await prisma.websiteSnapshot.createMany({
    data: scenarios.map((scenario) => ({
      scanId: scenario.id,
      requestedUrl: urlFor(scenario.domain),
      finalUrl: urlFor(scenario.domain),
      title: "TrustLens Seed Website",
      description: "Synthetic metadata for development UI scenarios.",
      screenshotUrl: null,
      faviconUrl: null,
      statusCode: scenario.status === "FAILED" ? null : 200,
      redirects: { seedData: true },
      externalDomains: [],
      technologies: ["DEMO_TECHNOLOGY"],
      htmlHash: `seed-${scenario.id}`,
    })),
  });

  await prisma.finding.createMany({
    data: [
      {
        scanId: "seed_scan_established",
        type: "ESTABLISHED_DOMAIN",
        severity: "LOW" as const,
        title: "Established domain",
        description: "Synthetic evidence represents a long-established domain.",
        source: "DOMAIN_ANALYSIS",
        evidence: { seedData: true },
      },
      {
        scanId: "seed_scan_established",
        type: "VALID_TLS",
        severity: "LOW" as const,
        title: "Valid TLS",
        description:
          "Synthetic evidence represents a valid matching certificate.",
        source: "TLS_ANALYSIS",
        evidence: { seedData: true },
      },
      {
        scanId: "seed_scan_low_risk",
        type: "NO_THREAT_MATCH",
        severity: "LOW" as const,
        title: "No threat match",
        description: "The demo threat provider has no match for this scenario.",
        source: "THREAT_INTELLIGENCE",
        evidence: { provider: "DEMO_THREAT_PROVIDER", seedData: true },
      },
      {
        scanId: "seed_scan_caution",
        type: "YOUNG_DOMAIN",
        severity: "MEDIUM" as const,
        title: "Young domain",
        description:
          "Synthetic evidence represents a recently registered domain.",
        source: "DOMAIN_ANALYSIS",
        evidence: { domainAgeDays: 12, seedData: true },
      },
      {
        scanId: "seed_scan_caution",
        type: "NO_DNSSEC",
        severity: "LOW" as const,
        title: "DNSSEC unavailable",
        description: "Synthetic evidence represents DNSSEC not being detected.",
        source: "DNS_ANALYSIS",
        evidence: { seedData: true },
      },
      {
        scanId: "seed_scan_suspicious",
        type: "SUSPICIOUS_LOGIN_PAGE",
        severity: "HIGH" as const,
        title: "Suspicious login page",
        description:
          "Synthetic evidence represents a credential collection form.",
        source: "WEBSITE_ANALYSIS",
        evidence: { seedData: true },
      },
      {
        scanId: "seed_scan_suspicious",
        type: "SUSPICIOUS_REDIRECT",
        severity: "HIGH" as const,
        title: "Suspicious redirect",
        description: "Synthetic evidence represents an unexpected redirect.",
        source: "WEBSITE_ANALYSIS",
        evidence: { seedData: true },
      },
      {
        scanId: "seed_scan_high_risk",
        type: "THREAT_PROVIDER_MATCH",
        severity: "HIGH" as const,
        title: "Simulated threat match",
        description:
          "The fictional demo provider simulated a social-engineering match.",
        source: "THREAT_INTELLIGENCE",
        evidence: { provider: "DEMO_THREAT_PROVIDER", seedData: true },
      },
      {
        scanId: "seed_scan_impersonation",
        type: "BRAND_IMPERSONATION",
        severity: "CRITICAL" as const,
        title: "Possible PayPal impersonation",
        description:
          "Synthetic evidence represents a fictional brand-impersonation scenario.",
        source: "BRAND_ANALYSIS",
        evidence: {
          brand: "PayPal",
          officialDomain: "paypal.com",
          seedData: true,
        },
      },
      {
        scanId: "seed_scan_impersonation",
        type: "TYPOSQUATTING",
        severity: "HIGH" as const,
        title: "Typosquatting pattern",
        description:
          "The fictional domain substitutes a character in a brand-related hostname.",
        source: "DOMAIN_SIMILARITY",
        evidence: { seedData: true },
      },
      {
        scanId: "seed_scan_malicious",
        type: "PHISHING_DETECTED",
        severity: "CRITICAL" as const,
        title: "Simulated phishing detection",
        description:
          "Synthetic evidence exercises the known-malicious UI state.",
        source: "THREAT_INTELLIGENCE",
        evidence: { provider: "DEMO_THREAT_PROVIDER", seedData: true },
      },
      {
        scanId: "seed_scan_malicious",
        type: "MALICIOUS_INFRASTRUCTURE",
        severity: "CRITICAL" as const,
        title: "Simulated malicious infrastructure",
        description:
          "Synthetic development evidence only; no live provider was called.",
        source: "THREAT_INTELLIGENCE",
        evidence: { provider: "DEMO_THREAT_PROVIDER", seedData: true },
      },
      {
        scanId: "seed_scan_insufficient",
        type: "LIMITED_REPUTATION",
        severity: "LOW" as const,
        title: "Limited evidence",
        description:
          "Insufficient synthetic evidence is available for a stronger assessment.",
        source: "RISK_ENGINE",
        evidence: { seedData: true },
      },
    ].map((finding) => {
      const scenario = scenarios.find(({ id }) => id === finding.scanId);
      if (!scenario) throw new Error("Missing finding seed scenario");
      return {
        ...finding,
        evidenceReference: `seed:prisma/seed.ts:${finding.scanId}:${finding.type}`,
        createdAt: new Date(scenario.createdAt),
      };
    }),
  });

  await prisma.threatResult.createMany({
    data: [
      {
        scanId: "seed_scan_established",
        provider: "DEMO_THREAT_PROVIDER",
        detected: false,
        status: "NO_MATCH",
        categories: [],
        confidence: 96,
        retrievedAt: new Date("2026-09-10T08:00:10Z"),
        rawData: { seedData: true },
      },
      {
        scanId: "seed_scan_high_risk",
        provider: "DEMO_THREAT_PROVIDER",
        detected: true,
        status: "MATCH",
        categories: ["SOCIAL_ENGINEERING"],
        confidence: 90,
        retrievedAt: new Date("2026-09-14T12:00:12Z"),
        rawData: { seedData: true },
      },
      {
        scanId: "seed_scan_malicious",
        provider: "DEMO_THREAT_PROVIDER",
        detected: true,
        status: "MATCH",
        categories: ["PHISHING", "MALWARE"],
        confidence: 99,
        retrievedAt: new Date("2026-09-16T14:00:10Z"),
        rawData: { seedData: true },
      },
    ],
  });

  await prisma.brandCandidate.create({
    data: {
      scanId: "seed_scan_impersonation",
      brandName: "PayPal",
      officialDomain: "paypal.com",
      officialUrl: "https://www.paypal.com",
      confidence: 96,
      domainSimilarity: 94,
      textualSimilarity: 91,
      visualSimilarity: 89,
      evidence: { seedData: true, characterSubstitutionDetected: true },
    },
  });
}

async function main() {
  const demoUser = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { name: "TrustLens Demo", emailVerified: true, role: "USER" },
    create: {
      email: DEMO_EMAIL,
      name: "TrustLens Demo",
      emailVerified: true,
      role: "USER",
    },
  });

  await removeSeedRecords();
  await createScans(demoUser.id);
  await createEvidence();

  console.log(`Seeded ${scenarios.length} TrustLens development scenarios.`);
}

main()
  .catch((error: unknown) => {
    console.error(
      "Seed failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
