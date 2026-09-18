# Current Feature: Neon Postgres + Prisma ORM 7 Setup

<!-- Feature Name -->

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

- Set up the initial TrustLens persistence layer using PostgreSQL, Neon, and Prisma ORM 7.
- Use the Prisma 7 `prisma-client` generator with an explicit output directory (e.g. `../src/generated/prisma`).
- Install the required Prisma packages and the appropriate Neon driver adapter.
- Do not use Prisma 6 configuration patterns that conflict with Prisma 7; consult the official Prisma 7 upgrade guide first.
- Base the initial schema on the core data models defined in `context/trustlens-project-overview.md` and `context/trustlens-coding-standards.md`.
- Maintain a development database (via `DATABASE_URL`) separate from the production branch.
- Always create and apply migrations; never push schema changes directly unless explicitly specified.
- Follow the project's database and security standards (server-only Prisma client, no secrets in client code).

## Notes

<!-- Any extra notes -->

- Feature specification: [context/features/database-spec.md](features/database-spec.md).
- Reference docs: Prisma upgrade guide (https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7) and Prisma Postgres quickstart (https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres).
- Schema is expected to evolve as authentication, scanning, reporting, and threat intelligence features are implemented.
- The `User` model mirrors Better Auth's default core schema (id/name/email/emailVerified/image/timestamps) so a future Better Auth setup can extend it via `npx auth@latest generate` without conflicts; Session/Account/Verification tables are intentionally deferred to that feature.

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
