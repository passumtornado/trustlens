# Database Feature 4 --- Domain, DNS, and TLS Evidence

## Overview

Add Prisma models for structured domain, DNS, and TLS evidence collected
during TrustLens scans.

## Requirements

-   Use **Prisma 7 + Neon PostgreSQL**.
-   Relate evidence to the existing `Scan` model.
-   Add:
    -   `DomainProfile`
    -   `DnsResult`
    -   `TlsResult`
-   Store evidence source and `retrievedAt` where applicable.
-   Keep raw provider payloads and large artifacts out of primary
    database tables.
-   Add only useful indexes for domain lookup and freshness queries.

### Domain Profile

Store relevant RDAP/domain information such as:

-   normalized domain
-   registrar
-   registration/expiration dates
-   retrieval timestamp
-   source

Reuse or refresh domain-level information where appropriate instead of
unnecessarily duplicating it.

### DNS Results

Store structured DNS observations such as:

-   record type
-   value/result
-   source
-   retrieval timestamp

### TLS Results

Store structured certificate/security observations such as:

-   certificate validity
-   issuer
-   subject/domain
-   valid-from / valid-to dates
-   retrieval timestamp

### Relationships

``` text
Scan
├── DomainProfile
├── DnsResult[]
└── TlsResult
```

Keep relations explicit and compatible with later Findings and Reports.

### Migration

``` bash
pnpm prisma format
pnpm prisma validate
pnpm prisma migrate dev --name add-domain-dns-tls-evidence
pnpm prisma generate
```

Use the Neon development database/branch. Do not use `prisma db push` as
the normal workflow.

## Acceptance Criteria

-   Domain, DNS, and TLS evidence can be persisted with Prisma.
-   Evidence is linked to the correct Scan.
-   Source and retrieval timestamps are stored.
-   Reusable domain data avoids unnecessary duplication.
-   Appropriate indexes exist.
-   Prisma migration is created.
-   `pnpm prisma validate` passes.
-   `pnpm prisma generate` passes.
-   Project build passes.

## Out of Scope

-   Threat intelligence
-   Screenshots/raw browser artifacts
-   Brand analysis
-   Findings
-   Risk scoring
-   Reports

## References

-   `@context/trustlens-project-overview.md`
-   `@context/trustlens-coding-standards.md`
-   `@context/architecture.md`
-   `@context/trustlens-ai-interaction-guidelines.md`
-   `@prisma/schema.prisma`
-   `@prisma.config.ts`
