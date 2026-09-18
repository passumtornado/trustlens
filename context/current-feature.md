# Current Feature: Seed Development Data

<!-- Feature Name -->

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

- Create `prisma/seed.ts` using the existing Prisma 7 schema; do not add new models solely for seeding.
- Seed only the intended Neon development database; never target production, and never log connection strings or secrets.
- Use or locate a deterministic Better Auth development user (`demo@trustlens.dev`, name "TrustLens Demo", role USER, emailVerified true) without implementing custom password/session/OAuth logic.
- Seed ten representative scan scenarios: established low-risk, low-risk, caution, suspicious, high-risk, brand impersonation, known-malicious simulation, insufficient-evidence, active, and failed — using fictional/reserved domains (e.g. `.test`) for suspicious examples.
- Seed representative `DomainProfile`, DNS, TLS, `ThreatResult` (via `DEMO_THREAT_PROVIDER`), `Finding`, `BrandCandidate`, website snapshot metadata (no binaries/HTML), and `Report` data where the current schema supports it.
- Keep completed `Report` records consistent with their parent `Scan` (riskScore/confidence/verdict), using deterministic versions (`riskEngineVersion: 1.0.0`, `scannerVersion: 1.0.0`, `modelVersion: seed-data-v1`).
- Make seed execution idempotent via deterministic IDs and/or targeted upserts; cleanup must only affect seed-owned records.
- Do not perform live scanning, network/RDAP/DNS/TLS calls, threat-provider/OpenAI calls, Playwright, BullMQ, or R2 uploads.

## Notes

<!-- Any extra notes -->

- Feature specification: [context/features/seed-spec.md](features/seed-spec.md).
- The existing `prisma/seed.ts` may be overwritten as part of this feature.
- If a model/relation/enum/field described in the spec doesn't exist in `prisma/schema.prisma`, seed what the schema currently supports and document the omission rather than changing the schema to fit the seed.
- Validate with `pnpm prisma validate`, `pnpm prisma db seed`, and `npm run build`.

## History

- 2026-09-14: Login and register UI phase started; status set to In Progress.
- 2026-09-14: Implemented responsive `/login` and `/register` routes with shared authentication layout.
- 2026-09-14: Added shadcn/ui primitives, Tailwind CSS v4 styling, Lucide icons, TrustLens logo assets, and authentication background imagery.
- 2026-09-14: Validated desktop/mobile layouts, no-scroll behavior, route rendering, type diagnostics, production build, and whitespace checks; status set to Completed.
- 2026-09-14: Forgot Password feature started; status set to In Progress.
- 2026-09-14: Implemented `/forgot-password` with Zod email validation, loading, generic success, error, and back-to-login states.
- 2026-09-14: Wired the login Forgot Password link, generated route types, validated responsive behavior, and passed the production build; status set to Completed.
- 2026-09-14: Dashboard sidebar/navigation and dark/light mode feature started; status set to In Progress.
- 2026-09-14: Implemented the reusable dashboard shell, responsive sidebar/drawer navigation, placeholder dashboard routes, Free Plan usage card, and persisted light/dark/system theme controls; status set to Completed.
- 2026-09-18: Neon Postgres + Prisma ORM 7 setup feature started; status set to In Progress.
- 2026-09-18: Installed Prisma 7, `@prisma/adapter-neon`, and the Neon serverless driver; added `prisma.config.ts`, the initial `prisma/schema.prisma` (User, UserSettings, Scan, DomainProfile, DnsResult, TlsResult, ThreatResult, WebsiteSnapshot, BrandCandidate, Finding, AiAnalysis, Report), and a server-only client at `src/lib/db/prisma.ts`.
- 2026-09-18: Configured `DATABASE_URL`/`DIRECT_URL`, generated the Prisma Client, ran the initial migration against the Neon dev database, and verified runtime connectivity via the Neon adapter; `npm run build` passes; status set to Completed.
- 2026-09-18: Seed development data feature started; status set to In Progress.
- 2026-09-18: Replaced `prisma/seed.ts` with an idempotent Prisma 7 seed for ten demo scan scenarios, Better Auth-compatible demo user data, representative evidence/findings, and consistent completed reports; `pnpm prisma validate`, repeated `pnpm prisma db seed`, count checks, `npm run build`, and `git diff --check` passed; status set to Completed.
