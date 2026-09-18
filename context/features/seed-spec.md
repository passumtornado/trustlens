# TrustLens Seed Data Specification

## Overview

Create `prisma/seed.ts` to populate the TrustLens Neon PostgreSQL
development database with realistic development/demo data for the
Dashboard, Scan History, Scan Progress, Verification Reports, findings,
domain intelligence, threat intelligence, and impersonation UI.

The seed must use the existing Prisma 7 schema. It must not introduce
database models solely for seed purposes. Suspicious examples must use
fictional/reserved domains such as `.test`.

## Requirements

### Development Safety

-   Seed only the intended Neon development database.
-   Never intentionally seed production.
-   Never log database URLs, passwords, authentication secrets, OAuth
    secrets, or API keys.
-   Do not delete unrelated developer data.
-   Seed execution must be idempotent.

### Prisma 7 + Neon

Use the project's existing Prisma ORM 7 configuration, Neon PostgreSQL
database, generated Prisma Client, Neon driver adapter, and
`prisma.config.ts`.

The seed must run with:

``` bash
pnpm prisma db seed
```

### Better Auth User

TrustLens uses Better Auth. Use or locate a deterministic development
user:

``` text
Email: demo@trustlens.dev
Name: TrustLens Demo
Role: USER
Email Verified: true
```

Do not manually implement password hashing, sessions, cookies, OAuth
tokens, or verification tokens in the seed. Prefer an existing Better
Auth development user or an approved Better Auth creation flow.

## Seed Scenarios

  Scenario                           Risk   Confidence Verdict / Status
  ---------------------------- ---------- ------------ -----------------------
  Established low-risk site             8          96% LIKELY_SAFE
  Low-risk site                        27          88% LOW_RISK
  Caution site                         52          72% CAUTION
  Suspicious site                      71          86% SUSPICIOUS
  High-risk site                       87          93% HIGH_RISK
  Brand impersonation                  92          96% IMPERSONATION
  Known-malicious simulation           98          99% KNOWN_MALICIOUS
  Insufficient evidence          nullable          25% INSUFFICIENT_EVIDENCE
  Active scan                    nullable     nullable THREAT_ANALYSIS
  Failed scan                    nullable     nullable FAILED

Suggested domains:

``` text
example.com
example.org
new-demo-store.test
account-security-demo.test
unknown-shop.test
paypa1-secure-login.test
malicious-demo.test
limited-evidence.test
shop-under-review.test
unreachable-demo.test
```

## Evidence Requirements

Where supported by the current Prisma schema, seed representative:

-   `DomainProfile` data including registrar, dates, domain age,
    nameservers and DNSSEC.
-   DNS results for A, AAAA, CNAME, MX, TXT and NS as useful.
-   TLS results covering valid and problematic certificate states.
-   `ThreatResult` data using `DEMO_THREAT_PROVIDER` for simulated
    malicious detections.
-   `Finding` records using INFO, LOW, MEDIUM, HIGH and CRITICAL
    severities.
-   `BrandCandidate` data for the impersonation scenario.
-   Website snapshot metadata, but never screenshot binaries or raw
    HTML.
-   Final `Report` records for completed scans.
-   `AiAnalysis` records only if the schema supports them; AI text must
    explain existing evidence and never invent findings.

Representative finding codes include:

``` text
ESTABLISHED_DOMAIN
VALID_TLS
NO_THREAT_MATCH
YOUNG_DOMAIN
NO_DNSSEC
LIMITED_REPUTATION
SUSPICIOUS_REDIRECT
SUSPICIOUS_LOGIN_PAGE
EXTERNAL_FORM_DESTINATION
TYPOSQUATTING
BRAND_IMPERSONATION
THREAT_PROVIDER_MATCH
PHISHING_DETECTED
MALICIOUS_INFRASTRUCTURE
```

## Impersonation Scenario

Use:

``` text
Submitted: paypa1-secure-login.test
Detected brand: PayPal
Official-domain candidate: paypal.com
Risk: 92
Confidence: 96
Verdict: IMPERSONATION
```

This is development/demo evidence only. Do not claim a real threat
provider classified the fictional site.

## Reports and Versioning

Completed reports must remain consistent with their parent scan:

``` text
Scan.riskScore == Report.riskScore
Scan.confidence == Report.confidence
Scan.verdict == Report.verdict
```

Use deterministic versions:

``` text
riskEngineVersion: 1.0.0
scannerVersion: 1.0.0
modelVersion: seed-data-v1
```

Do not create successful reports for active or failed scans.

## Idempotency

Use deterministic seed scan IDs and/or targeted upserts/deletion.
Re-running the seed must not continuously duplicate records.

Cleanup must affect only seed-owned records. Never use unrestricted
deletion of all users or scans merely to simplify seeding.

Use deterministic timestamps where practical so sorting, tests, and
screenshots remain reproducible.

## Security

The seed must not contain real passwords, production credentials, API
keys, session tokens, OAuth tokens, private user information, or
executable malicious payloads.

The seed must not browse websites, perform RDAP/DNS/TLS requests, call
threat providers/OpenAI, run Playwright, enqueue BullMQ jobs, or upload
to R2. It represents results those systems may eventually produce.

## Implementation Guidance

The actual `prisma/schema.prisma` is the source of truth. If a model,
relation, enum, or field described here does not exist, do not change
the schema merely to make seed data compile. Seed what the current
schema supports and document omissions.

A single `prisma/seed.ts` is sufficient initially.

## Acceptance Criteria

-   [ ] `prisma/seed.ts` exists.
-   [ ] Existing Prisma 7 configuration is used.
-   [ ] Seed targets the intended Neon development database.
-   [ ] Seed data is associated with a Better Auth development user.
-   [ ] No custom password/session authentication system is introduced.
-   [ ] Ten representative scan scenarios are included where supported.
-   [ ] Safe, caution, suspicious, high-risk, impersonation, malicious
    simulation, insufficient-evidence, active, and failed states exist.
-   [ ] Representative evidence/findings exist.
-   [ ] Completed reports are consistent with parent scans.
-   [ ] Large artifacts are not stored in PostgreSQL.
-   [ ] Suspicious examples use fictional/reserved domains.
-   [ ] Real providers are not falsely credited with seeded malicious
    detections.
-   [ ] Seed execution is idempotent.
-   [ ] Cleanup affects seed records only.
-   [ ] `pnpm prisma db seed` succeeds.
-   [ ] `pnpm prisma validate` succeeds.
-   [ ] Application build still succeeds.
-   [ ] No secrets are committed.

## Out of Scope

Do not implement live scanning, Playwright execution, BullMQ/Redis work,
RDAP/DNS/TLS network calls, threat-provider calls, OpenAI calls,
screenshot capture, R2 uploads, OAuth flows, or production migrations as
part of seeding.

## References

-   `@context/project-overview.md`
-   `@context/architecture.md`
-   `@context/coding-standards.md`
-   `@context/ai-interaction-guidelines.md`
-   `@context/current-feature.md`
-   `@prisma/schema.prisma`
-   `@prisma.config.ts`
