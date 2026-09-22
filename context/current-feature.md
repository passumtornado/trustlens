# Current Feature: Database Feature 4 — Domain, DNS, and TLS Evidence

## Status

Complete

## Goals

- Use Prisma 7 + Neon PostgreSQL to persist structured domain, DNS, and TLS evidence linked to the existing Scan model.
- Adapt the existing DomainProfile, DnsResult, and TlsResult models with explicit relations compatible with later Findings and Reports.
- Store normalized domain, registrar, registration/expiration dates, evidence source, and retrieval timestamps for domain profiles.
- Store structured DNS record types, values/results, sources, and retrieval timestamps.
- Store TLS certificate validity, issuer, subject/domain, validity dates, source where applicable, and retrieval timestamps.
- Reuse or refresh domain-level data where appropriate to avoid unnecessary duplication; add only useful domain-lookup and freshness indexes.
- Create and apply a reviewed Prisma migration to the Neon development database; pass Prisma validation/generation and the project build.

## Notes

- Implementation branch: `feature/domain-dns-tls-evidence`; existing uncommitted Feature 3 work is preserved as a prerequisite.
- DomainProfile becomes a reusable domain/source/retrieval-time snapshot referenced by scans. Refreshes create new snapshots rather than rewriting prior evidence. Deleting a scan does not delete a shared profile; deleting a referenced profile is restricted.
- Legacy retrieval times remain null because they were not recorded. Missing legacy DNS/TLS sources are marked `LEGACY_UNKNOWN`; no provider or observation time is fabricated. New evidence should supply explicit source and retrieval time.
- Reuse a snapshot through Prisma `connectOrCreate` on `(normalizedDomain, source, retrievedAt)`. Freshness queries must filter by domain/source and a non-null retrieval-time range; unknown legacy times are not fresh evidence. The compound unique index supports those lookups; DNS indexing now includes retrieval time after scan/record type.
- Run focused validation with `pnpm exec tsx --test prisma/tests/scan-model.test.ts prisma/tests/domain-dns-tls.test.ts` against the development database. Tests roll back fixtures, including deletion/constraint checks.
- Validation passed: Prisma format/validate/generate, TypeScript, production build, both database tests, migration preservation checks, and diff checks. Seed changes were type-checked but the seed was not rerun over existing data. Restart a running dev server after client regeneration to clear any cached Prisma instance.

- Specification: [Database Feature 4 — Domain, DNS, and TLS Evidence](features/database/database-feature-4-domain-dns-tls.md).
- Existing evidence models and seeded records must be considered before changing schema fields, relationships, or domain-data reuse behavior.
- Keep raw provider payloads and large artifacts out of primary database tables; persist structured evidence only.
- Migration workflow: `pnpm prisma format` → `pnpm prisma validate` → `pnpm prisma migrate dev --name add-domain-dns-tls-evidence` → `pnpm prisma generate`; then run `pnpm run build`.
- Use the Neon development database/branch. Do not use `prisma db push` as the normal schema workflow.
- Out of scope: threat intelligence, screenshots/raw browser artifacts, brand analysis, findings, risk scoring, and reports.

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
- 2026-09-18: Dashboard Main Content feature started; status set to In Progress.
- 2026-09-18: Replaced the dashboard placeholder with Postgres-backed metrics, scans-over-time and risk-distribution visualizations, Recent Scans table, loading state, and empty state; validated against seeded Neon data and passed diagnostics, `npm run build`, and `git diff --check`; status set to Completed.
- 2026-09-18: New Scan Page feature started; status set to In Progress. The page will provide the dashboard-shell website trust investigation entry point, URL validation, example domains, safe-isolation messaging, and frontend-only queued/error states without browsing submitted targets.
- 2026-09-18: Added the responsive `/scan/new` page inside the shared dashboard shell with the top bar, sidebar, website-check card, URL input, Start Scan action, example domain chips, investigation capability grid, and safety/isolation banner.
- 2026-09-18: Added Zod client-side URL validation, blocked empty/whitespace submissions, added loading/queued/error states, and ensured the browser never fetches or navigates to the submitted URL.
- 2026-09-18: Validated the route with diagnostics, `npm run build`, `git diff --check`, and browser checks for form validation, example-chip population, loading state, responsive layout, and dashboard shell rendering.
- 2026-09-18: Feature 6 — Scan History Page started; status set to In Progress.
- 2026-09-18: Implemented the `/scans` route with the shared dashboard shell, Postgres-backed scan history loading, responsive search/filter controls, risk and status badges, mobile-friendly cards, empty/loading/error states, and report action links.
- 2026-09-18: Fixed the filter row alignment and spacing, improved select chevron positioning, and verified the page builds successfully with `npm run build`; status set to Completed.
- 2026-09-18: Feature 7 — Settings Page started; status set to In Progress.
- 2026-09-18: Implemented the `/settings` route with the shared dashboard shell, Postgres-backed account info, editable name/email fields, appearance theme controls, notification toggles, data retention selector, and confirmation-gated delete account section.
- 2026-09-19: Fixed a client-bundle crash caused by importing the server-only Prisma client directly in `settings.tsx` by moving the query into a `createServerFn` in `src/lib/server/settings-data.ts`, and synchronized the Appearance section with the top navigation theme toggle via a shared `src/lib/theme.ts` module; verified with `npm run build` and browser checks; status set to Completed.
- 2026-09-19: Feature 8 — Profile Page added to the roadmap; status set to Not Started.
- 2026-09-19: Feature 8 — Profile Page started on `feat/profile-page`; status set to In Progress. Implemented the `/profile` route with the shared dashboard shell, a Postgres-backed Profile Information card (avatar initials, Zod-validated full name/email, read-only role and member-since fields, verified badge, mock Change Photo/Save Changes placeholders), and a Change Password card with Zod validation, current/new/confirm fields, per-field visibility toggles, and a mock Update Password placeholder since no auth backend exists yet; verified with `npm run build` and browser checks for validation, theme parity, and light/dark rendering.
- 2026-09-19: Database Feature 2 — User and Authentication Data added to the roadmap; status set to Not Started.
- 2026-09-21: Implemented Database Feature 2 with Better Auth's Prisma/PostgreSQL adapter, authentication models, role/plan enums, migrations, and login/register/password-recovery integration. Corrected the password-reset request API, regenerated routes, and removed the unused Settings export to restore route code splitting.
- 2026-09-21: Applied all three existing migrations to the newly configured empty development database and ran the seed; verified the demo user, 10 scans, and 7 consistent reports. Restored local DIRECT_URL and aligned BETTER_AUTH_URL with the development app origin.
- 2026-09-21: Audit passed Prisma validation/generation, TypeScript, production build, client-bundle secret checks, and migration checksum verification. Outstanding follow-ups: remove token-bearing reset URL logging and reconcile nullable User.name with Better Auth's required name field. Better Auth CLI generation provenance and end-to-end authentication remain unverified; full feature completion is pending these follow-ups.
- 2026-09-21: Committed the implementation as eb64019, merged feat/better-auth-db into local main, and deleted the feature branch with user approval. Reset the current-feature fields to the default template; retained outstanding audit items in history.
- 2026-09-21: Database Feature 3 — Scan Model set as the current feature, referencing `context/features/database-feature-3-scan-model.md`; status set to Not Started.
- 2026-09-21: Implemented Database Feature 3 on `feature/scan-model` with user-approved required ownership and restricted user deletion, typed pipeline stages, bounded failure metadata, and mapped submitted URL/normalized domain fields. Updated dashboard/history queries and seed data while preserving existing status values and indexes.
- 2026-09-21: Applied `20260921170000_add_scan_model` with `pnpm prisma migrate dev`; verified all 10 existing scans retained their ownership, URLs, statuses, scores, confidence, and verdicts. Unknown legacy stages remain null. Prisma format/validate/generate, TypeScript, production build, focused transaction-rollback database tests, and diff checks passed; status set to Completed. No commit or merge performed.
- 2026-09-22: Implemented Database Feature 4 on `feature/domain-dns-tls-evidence`: domain/source/retrieval-time snapshots reusable across scans, DNS/TLS provenance and retrieval times, freshness indexes, and seed compatibility. Prior uncommitted Feature 3 work was preserved.
- 2026-09-22: Applied `20260922100000_add_domain_dns_tls_evidence` to the development database. Verified all 10 domain profiles, 40 DNS results, 10 TLS results, and their scan links were preserved; unknown legacy metadata remains explicit. Prisma validation/generation, TypeScript, build, two transaction-rollback database tests, and diff checks passed. Status set to Complete; no commit, push, or merge performed.
