# Database Feature 5 --- Threat Results and Findings

## Overview

Add Prisma models for external threat intelligence results and TrustLens
findings produced during a scan.

## Requirements

-   Use **Prisma 7 + Neon PostgreSQL**.
-   Relate threat results and findings to the existing `Scan`.
-   Add:
    -   `ThreatResult`
    -   `Finding`
-   Support multiple threat results and findings per scan.
-   Keep raw provider payloads minimal.

### ThreatResult

Store normalized provider results such as:

-   provider
-   verdict/status
-   matched threat/category where available
-   source/reference where appropriate
-   `retrievedAt`

Do not store unnecessary full provider responses.

### Finding

Store explainable TrustLens findings with:

-   type
-   severity
-   title
-   description
-   evidence source
-   score contribution when applicable
-   `createdAt`

Use typed enums for severity and other stable values where appropriate.

Each finding must be traceable to the evidence that produced it.

### Relationships

``` text
Scan
├── ThreatResult[]
└── Finding[]
```

These records will later feed the risk engine, AI explanation, and
report.

### Migration

``` bash
pnpm prisma format
pnpm prisma validate
pnpm prisma migrate dev --name add-threat-results-findings
pnpm prisma generate
```

Use the Neon development database/branch.

## Acceptance Criteria

-   Threat results can be stored per scan/provider.
-   Multiple findings can be stored per scan.
-   Findings retain evidence provenance.
-   Score contributions are explicit where used.
-   Appropriate Prisma relations and indexes exist.
-   Prisma migration is created.
-   `pnpm prisma validate` passes.
-   `pnpm prisma generate` passes.
-   Project build passes.

## Out of Scope

-   Threat provider API integration
-   Risk calculation logic
-   AI explanation
-   Reports

## References

-   `@context/trustlens-project-overview.md`
-   `@context/trustlens-coding-standards.md`
-   `@context/trustlens-ai-interaction-guidelines.md`
-   `@prisma/schema.prisma`
-   `@prisma.config.ts`
