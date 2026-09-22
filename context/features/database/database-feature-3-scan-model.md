# Database Feature 3 --- Scan Model

## Overview

Create the central TrustLens `Scan` persistence model using **Prisma 7**
and **Neon PostgreSQL**.

The Scan model represents a website investigation submitted by an
authenticated user and tracks the scan from submission through
completion or failure.

## Requirements

-   Create the `Scan` model in `prisma/schema.prisma`.
-   Relate each scan to the Better Auth `User`.
-   Use Prisma enums for type-safe scan status and stage values.
-   Create a Prisma migration for all schema changes.
-   Keep large scanner artifacts outside PostgreSQL.

### Scan Fields

Include fields such as:

-   `id`
-   `userId`
-   `submittedUrl`
-   `normalizedUrl`
-   `normalizedDomain`
-   `status`
-   `stage`
-   `riskScore`
-   `confidence`
-   `verdict`
-   `createdAt`
-   `updatedAt`
-   `completedAt`
-   safe failure metadata

Risk score, confidence, verdict, and completion fields should be
nullable while a scan is still running.

### User Relationship

A scan must belong to an authenticated Better Auth user.

``` text
User
 └── Scan[]
```

Use an explicit Prisma relation and foreign key.

### Status

Use a Prisma enum for scan lifecycle status.

Support values appropriate to the current TrustLens workflow, such as:

-   `QUEUED`
-   `IN_PROGRESS`
-   `COMPLETED`
-   `FAILED`

Do not use arbitrary status strings.

### Stage

Use a typed stage enum to represent the current scanner pipeline step.

Stages should align with the current TrustLens scanner workflow, for
example:

-   validation
-   DNS/security checks
-   domain analysis
-   TLS analysis
-   threat intelligence
-   website analysis
-   brand analysis
-   risk analysis
-   report generation

Use project-standard enum naming in the Prisma schema.

### Verdict

Use the current TrustLens verdict vocabulary:

-   `LIKELY_SAFE`
-   `LOW_RISK`
-   `CAUTION`
-   `SUSPICIOUS`
-   `HIGH_RISK`
-   `KNOWN_MALICIOUS`
-   `IMPERSONATION`
-   `INSUFFICIENT_EVIDENCE`

Keep confidence separate from risk score.

### Failure Metadata

Store only safe failure information needed by the application.

Examples:

-   failure code
-   user-safe failure message
-   failed stage

Do not store secrets, raw stack traces, credentials, or sensitive
scanner internals in client-facing scan records.

### Indexes

Add indexes for common TrustLens queries, including:

-   user + creation time
-   scan status
-   scan stage where useful
-   normalized domain where useful

The user/history index should support the Scan History page efficiently.

Avoid unnecessary or duplicate indexes.

### Scanner Artifacts

Do not store large artifacts directly in the Scan model.

Large artifacts such as:

-   screenshots
-   raw HTML
-   browser captures
-   large scanner files

belong in **Cloudflare R2**.

PostgreSQL should store only references and structured metadata when
needed.

### Related Scan Data

Keep detailed scan evidence in dedicated relational models rather than
adding everything to `Scan`.

The current architecture may associate a Scan with:

``` text
Scan
├── DomainProfile
├── DnsResult[]
├── TlsResult
├── ThreatResult[]
├── WebsiteSnapshot[]
├── BrandCandidate[]
├── Finding[]
├── AiAnalysis
└── Report
```

Those models are implemented in their respective database features.

### Migration Workflow

After updating the Prisma schema:

``` bash
pnpm prisma format
pnpm prisma validate
pnpm prisma migrate dev --name add-scan-model
pnpm prisma generate
```

Use the Neon development database/branch for development migrations.

Do not use `prisma db push` as the normal schema workflow.

## Acceptance Criteria

-   `Scan` exists as a Prisma model.
-   Scan records are stored in Neon PostgreSQL.
-   Each Scan is related to a Better Auth User.
-   Scan status is type-safe.
-   Scan stage is type-safe.
-   TrustLens verdict values are type-safe.
-   Risk score and confidence are modeled separately.
-   Running scans can have nullable result fields.
-   Safe failure metadata can be stored.
-   Scan History queries are appropriately indexed.
-   Large artifacts are not stored directly in the Scan model.
-   Prisma migration exists for the schema change.
-   `pnpm prisma validate` passes.
-   `pnpm prisma generate` passes.
-   Project build passes.

## Out of Scope

-   Findings implementation
-   Report implementation
-   Screenshot storage implementation
-   Domain/DNS/TLS result models
-   Threat intelligence result models
-   Brand analysis models
-   AI analysis models
-   Scanner execution logic
-   BullMQ job implementation
-   Risk scoring logic


## References
-   `@context/trustlens-project-overview.md`
-   `@context/trustlens-coding-standards.md`
-   `@context/ai-interaction-guidelines.md`
-   `@context/current-feature.md`
-   `@prisma/schema.prisma`
-   `@prisma.config.ts`
