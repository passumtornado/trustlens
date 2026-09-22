# Current Feature: Database Feature 5 — Threat Results and Findings

## Status

Complete

## Goals

- Use Prisma 7 + Neon PostgreSQL to persist external threat intelligence results and explainable TrustLens findings.
- Adapt the existing ThreatResult and Finding models with explicit Scan relations supporting multiple results and findings per scan.
- Store normalized threat provider results: provider, verdict/status, matched threats/categories, source/reference where appropriate, and retrievedAt.
- Store finding type, typed severity and other stable values where appropriate, title, description, evidence source, optional score contribution, and createdAt.
- Make each finding traceable to the evidence that produced it and keep score contributions explicit where used.
- Add appropriate indexes for scan/provider results and findings without duplicating existing indexes.
- Create and apply a reviewed Prisma migration to the Neon development database; pass Prisma validation/generation and the project build.

## Notes

- Branch: `feature/threat-results-findings`.
- Provider status is `MATCH`, `NO_MATCH`, `UNKNOWN`, or `ERROR`, separate from the final scan verdict. Keep the existing detected flag consistent (null for unknown/error); a database check enforces this invariant.
- Map `retrievedAt` to the existing `checkedAt` column and finding `type` to `code`, preserving stored data. Finding type remains an extensible code; severity retains the existing enum.
- Existing finding creation times and score contributions remain null rather than fabricated. New findings default to the current creation time; score contributions are optional signed integers supplied by future deterministic scoring logic.
- Findings retain source and minimal supporting evidence, plus an optional source-specific evidence reference. Synthetic seed references point to the generating scenario in `prisma/seed.ts`. No provider integrations or risk calculations are introduced.
- Database checks reject contradictory provider status/detection values and require a nonblank finding source plus either a nonblank evidence reference or a nonempty evidence object. These checks enforce metadata presence, not the truth or safety of external evidence; future provider inputs still need validation.
- Existing `(scanId, provider)` and `(scanId, severity)` indexes support the required queries; no duplicate indexes were added.
- Validation passed: Prisma format/validate/generate, TypeScript, production build, all three transaction-rollback database tests, migration preservation checks, and diff checks. Existing 3 threat results and 13 findings were preserved. Seed changes were type-checked but the seed was not rerun over existing data.
- Tests: `pnpm exec tsx --test prisma/tests/scan-model.test.ts prisma/tests/domain-dns-tls.test.ts prisma/tests/threat-results-findings.test.ts` against the development database. Restart the dev server after Prisma regeneration to clear a cached client.

- Specification: [Database Feature 5 — Threat Results and Findings](features/database/database-feature-5-threat-results-findings.md).
- Review existing ThreatResult/Finding fields, persisted evidence, and seed consumers before changing the schema; preserve existing records and provenance.
- Keep raw provider payloads minimal; do not store unnecessary full provider responses.
- Records will feed the future risk engine, AI explanation, and reports. This feature stores evidence and score contributions; it does not calculate risk or generate AI conclusions.
- Migration workflow: `pnpm prisma format` → `pnpm prisma validate` → `pnpm prisma migrate dev --name add-threat-results-findings` → `pnpm prisma generate`; then run `pnpm run build`.
- Use the Neon development database/branch and the existing migration-based schema workflow.
- Out of scope: threat provider API integration, risk calculation logic, AI explanation, and reports.

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
- 2026-09-22: Completed Database Feature 4 — Domain, DNS, and TLS Evidence with reusable domain snapshots, provenance/retrieval metadata, migration preservation checks, and passing database tests. Committed as 7c554f1 together with the prerequisite scan-model work, merged into main, and deleted the local evidence feature branch. Reset the current-feature template while preserving history.
- 2026-09-22: Implemented Database Feature 5 on `feature/threat-results-findings`: typed provider outcomes, mapped retrieval timestamps/finding types, provider/evidence references, optional signed score contributions, and creation timestamps for new findings. Added database checks for detection consistency and provenance presence; retained existing scan/provider and scan/severity indexes.
- 2026-09-22: Applied `20260922130000_add_threat_results_findings` to the development database and verified all 3 existing threat results and 13 findings were preserved. Prisma checks, TypeScript, build, three transaction-rollback database tests, preservation checks, and diff checks passed. Status set to Complete; no commit, push, or merge performed.
