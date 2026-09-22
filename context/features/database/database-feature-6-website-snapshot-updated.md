# Database Feature 6 — Website Snapshot and Artifact Metadata

## Overview

Store metadata for website screenshots and scanner artifacts using **Prisma 7 + Neon PostgreSQL**, while keeping the actual files in **Cloudflare R2**.

## Requirements

- Add a `WebsiteSnapshot` Prisma model related to `Scan`.
- Store:
  - `scanId`
  - artifact type
  - R2 object key
  - MIME type
  - file size
  - dimensions where applicable
  - `createdAt`
  - expiry/retention metadata when needed
- Never store screenshot binaries, base64 data, raw HTML, or other large artifacts in PostgreSQL.
- Resolve artifact ownership through `User → Scan → WebsiteSnapshot`.

### Relationship

```text
User
└── Scan
    └── WebsiteSnapshot[]
```

### Migration

```bash
pnpm prisma format
pnpm prisma validate
pnpm prisma migrate dev --name add-website-snapshots
pnpm prisma generate
```

Use the Neon development database/branch.

## Acceptance Criteria

- Artifact metadata can be saved and retrieved.
- Metadata belongs to the correct Scan.
- R2 object references are stored instead of binary content.
- Ownership resolves through Scan and User.
- Prisma migration is created.
- Prisma validation and generation pass.
- Project build passes.

## Out of Scope

- R2 upload implementation
- Signed URL generation
- Screenshot capture logic
- Artifact delivery/download

## References

-   `@context/trustlens-project-overview.md`
-   `@context/trustlens-coding-standards.md`
-   `@context/trustlens-ai-interaction-guidelines.md`
-   `@prisma/schema.prisma`
-   `@prisma.config.ts`
