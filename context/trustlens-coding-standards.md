# TrustLens Coding Standards

These standards apply to the TrustLens codebase. TrustLens uses
**TanStack Start**, **React**, **TypeScript**, **Tailwind CSS v4**,
**shadcn/ui**, **PostgreSQL**, **Neon**, **Prisma**, **Zod**, **Better Auth**,
**Redis/BullMQ**, and isolated scanning services.

## Core Principles

-   Prefer simple, explicit, strongly typed code over clever
    abstractions.
-   Treat all user-submitted URLs and website content as **untrusted
    input**.
-   Keep security-sensitive scanning logic isolated from the main web
    application.
-   The deterministic risk engine produces risk scores and verdicts; AI
    explains evidence and must not be the sole fraud authority.
-   Apply least privilege: each service receives only the credentials
    and network access it needs.
-   Never expose secrets, internal infrastructure, stack traces, or
    sensitive scan data to the client.

## TypeScript

-   Strict mode must remain enabled.
-   Never use `any`; use proper types, generics, discriminated unions,
    or `unknown`.
-   Validate `unknown` data before using it.
-   Define interfaces or type aliases for component props, service
    boundaries, API payloads, scan results, and persistent models.
-   Prefer type inference where the type is obvious; use explicit types
    where they improve readability or protect a boundary.
-   Prefer `const` over `let`; never use `var`.
-   Avoid unsafe type assertions (`as SomeType`) unless the value has
    already been validated.
-   Use exhaustive checks for important unions such as scan status and
    verdict.

Example:

``` ts
export type ScanVerdict =
  | "LIKELY_SAFE"
  | "LOW_RISK"
  | "CAUTION"
  | "SUSPICIOUS"
  | "HIGH_RISK"
  | "KNOWN_MALICIOUS"
  | "IMPERSONATION"
  | "INSUFFICIENT_EVIDENCE"
```

## React

-   Use functional components only.
-   Use hooks for client-side state and side effects.
-   Keep components focused on one responsibility.
-   Extract reusable stateful logic into custom hooks.
-   Keep security/business logic out of presentation components.
-   Prefer server-side data loading where practical; add client-side
    state only when interaction requires it.
-   Do not perform suspicious-site scanning from browser components.
-   Never render unsanitized HTML collected from scanned websites.

## TanStack Start

-   Use **TanStack Start**, not Next.js.
-   Use TanStack Router file-based routing under `src/routes`.
-   Keep route files focused on routing, loading, validation, and page
    composition.
-   Use route loaders for data required before rendering when
    appropriate.
-   Use `createServerFn` for server-only application operations and
    mutations.
-   Keep database access, secrets, authentication checks, and privileged
    integrations on the server.
-   Use server/API routes when an actual HTTP endpoint is required, such
    as:
    -   Webhooks
    -   External provider callbacks
    -   File or artifact delivery
    -   Worker/service communication
    -   Endpoints requiring explicit HTTP methods, headers, or status
        codes
    -   Future mobile/CLI integrations
-   Validate route params, search params, form data, and server-function
    inputs with Zod.
-   Never import server-only modules into client bundles.
-   Use environment variables only from server-side code when they
    contain secrets.
-   Use dynamic route files for scan/report resources, following
    TanStack Router file-routing conventions.

Example server function:

``` ts
import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"

const inputSchema = z.object({
  url: z.string().url(),
})

export const createScan = createServerFn({ method: "POST" })
  .inputValidator(inputSchema)
  .handler(async ({ data }) => {
    // Perform authorization and security validation here.
    // Queue the scan rather than opening the submitted URL here.
    return { success: true }
  })
```

## Tailwind CSS v4

**CRITICAL:** TrustLens uses Tailwind CSS v4 with CSS-based
configuration.

-   Do **not** create `tailwind.config.ts` or `tailwind.config.js`.
-   Keep Tailwind theme configuration in the application's global
    stylesheet using `@theme`.
-   Use CSS custom properties/design tokens for TrustLens colors,
    spacing, radius, and semantic states.
-   Do not use JavaScript-based Tailwind configuration.
-   Prefer reusable semantic tokens over repeating arbitrary values.

Example:

``` css
@import "tailwindcss";

@theme {
  --color-primary: oklch(55% 0.2 255);
  --color-risk-safe: oklch(65% 0.17 150);
  --color-risk-warning: oklch(75% 0.16 75);
  --color-risk-danger: oklch(60% 0.22 25);
}
```

## shadcn/ui

-   Use shadcn/ui primitives where they fit the design.
-   Extend components through composition rather than editing shared
    primitives unnecessarily.
-   Preserve accessibility behavior, keyboard support, focus states, and
    ARIA attributes.
-   Keep TrustLens-specific components in feature folders rather than
    putting everything in the generic UI directory.

## File Organization

Use feature-oriented organization while respecting TanStack Start
routing:

``` text
src/
├── routes/                 # TanStack Start file-based routes
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── dashboard/
│   ├── scans/
│   ├── reports/
│   └── auth/
├── server/
│   ├── auth/
│   ├── scans/
│   ├── security/
│   ├── risk/
│   └── integrations/
├── repositories/           # Prisma-backed data access
├── schemas/                # Zod schemas
├── types/                  # Shared TypeScript types
├── lib/                    # Shared utilities/configuration
└── styles/                 # Global styles/theme
```

Suggested responsibilities:

-   `src/routes/*` --- routes, loaders, search-param validation, page
    composition.
-   `src/components/*` --- UI and feature components.
-   `src/server/*` --- server functions and privileged business logic.
-   `src/server/security/*` --- URL validation, SSRF controls, DNS/IP
    checks, redirect policy.
-   `src/server/risk/*` --- deterministic findings, scoring, confidence,
    verdict logic.
-   `src/repositories/*` --- Prisma-backed persistence/query abstractions.
-   `src/schemas/*` --- Zod validation schemas.
-   `src/types/*` --- shared domain types.
-   `src/lib/*` --- reusable utilities without feature-specific business
    logic.

## Naming

-   Components: PascalCase (`RiskScoreCard.tsx`).
-   React hooks: `use` prefix (`useScanProgress.ts`).
-   Functions and variables: camelCase.
-   Constants: SCREAMING_SNAKE_CASE.
-   Types/interfaces: PascalCase with no `I` prefix.
-   Zod schemas: PascalCase plus `Schema` (`CreateScanSchema`).
-   Prisma models: singular PascalCase (`Scan`, `Report`, `Finding`).
-   Database tables/relations should follow the Prisma schema consistently.
-   Repository files: kebab-case or project-standard file naming, e.g.
    `scan.repository.ts`.
-   Boolean names should communicate state: `isLoading`,
    `hasThreatMatch`, `canScan`.

## Styling

-   Use Tailwind CSS for application styling.
-   Use shadcn/ui components where appropriate.
-   Avoid inline styles.
-   Follow the TrustLens design system: dark navy navigation, light
    neutral content surfaces, blue primary actions, and semantic
    green/amber/red risk states.
-   Maintain consistent spacing, radius, typography, and focus states.
-   Support responsive layouts.
-   Support both light and dark themes where implemented; do not
    sacrifice readability of risk indicators in either theme.
-   Never communicate risk by color alone; pair color with
    text/icon/status.

## PostgreSQL, Neon and Prisma

-   Use **PostgreSQL hosted on Neon** for persistent TrustLens application
    data.
-   Use **Prisma** as the approved ORM and database access layer.
-   Keep the Prisma schema in `prisma/schema.prisma`.
-   Use Prisma migrations for controlled schema changes.
-   Do not make production schema changes manually when they should be
    represented by a migration.
-   Keep Prisma client initialization in a single server-only database module,
    for example `src/lib/db/prisma.ts`.
-   Never import Prisma or database credentials into client-side code.
-   Model relationships explicitly with foreign keys and appropriate
    `onDelete` behavior.
-   Add indexes intentionally for common query paths such as `userId`,
    `rootDomain`, scan `status`, provider, severity, and `createdAt`.
-   Use database uniqueness constraints for invariants such as unique user
    email addresses and one-to-one scan reports where appropriate.
-   Use transactions when multiple related writes must succeed or fail
    together.
-   Avoid unnecessary N+1 queries; use Prisma `select`, `include`, and
    relation queries deliberately.
-   Select only fields required by the operation, especially when records may
    contain sensitive or large metadata.
-   Use PostgreSQL `JSONB` through Prisma `Json` only for genuinely flexible
    provider/evidence payloads. Do not use JSON fields to avoid modelling
    stable relational data.
-   Prisma models are persistence models; external inputs and public API
    payloads must still be validated independently with Zod.
-   Do not store screenshots, HTML captures, or other large binary artifacts
    in PostgreSQL. Store them in Cloudflare R2 and persist only the required
    metadata/object references.
-   Use Neon pooled connections for normal application traffic where
    appropriate and a direct database connection for migration workflows when
    required by the tooling.
-   Keep development, staging, testing, and production databases isolated.
-   Never store secrets or unnecessary sensitive website data in database
    records.

Example Prisma relationship:

```prisma
model Scan {
  id        String    @id @default(cuid())
  userId    String?
  status    ScanStatus
  findings  Finding[]
  report    Report?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([userId, createdAt])
  @@index([status])
}

model Finding {
  id       String   @id @default(cuid())
  scanId   String
  severity Severity
  evidence Json?

  scan Scan @relation(fields: [scanId], references: [id], onDelete: Cascade)

  @@index([scanId, severity])
}
```


## Zod Validation

-   Validate all external input with Zod at trust boundaries.
-   This includes forms, route/search params, server-function input,
    webhook payloads, worker messages, and third-party API responses
    where practical.
-   Zod validation proves **shape**, not **security**.
-   A syntactically valid URL must still pass TrustLens URL security
    checks before scanning.

Example:

``` ts
import { z } from "zod"

export const CreateScanSchema = z.object({
  url: z.string().trim().url().max(2048),
})
```

## Authentication and Authorization

-   Use **Better Auth** for authentication.
-   Do not implement password hashing, session cookies, OAuth flows, or
    password-reset security manually unless the library explicitly
    requires integration code.
-   Perform authorization checks on the server for every protected
    operation.
-   Never rely on hidden buttons or client-side route guards as
    authorization.
-   Verify resource ownership before returning scans, reports,
    screenshots, or artifacts.
-   Use secure, HTTP-only session cookies according to the
    authentication configuration.
-   Apply least privilege to admin functionality.

## URL and SSRF Security

User-submitted URLs are hostile until proven otherwise.

Before any TrustLens-controlled fetch or browser navigation:

1.  Parse and normalize the URL.
2.  Allow only approved protocols, normally `http:` and `https:`.
3.  Reject embedded credentials.
4.  Resolve the hostname.
5.  Reject loopback, private, link-local, multicast, reserved, and
    cloud-metadata destinations.
6.  Validate IPv4 and IPv6 addresses.
7.  Re-check destination safety after redirects and hostname changes.
8.  Apply redirect and timeout limits.
9.  Prevent DNS rebinding from bypassing destination validation.
10. Record security failures without exposing internal network details
    to users.

Never implement scanner navigation as:

``` ts
await fetch(userSuppliedUrl)
```

without the TrustLens URL security layer.

## Playwright Scanner

-   Playwright is used to observe rendered website behavior, not as the
    primary security sandbox.
-   Run suspicious-site browsing in an isolated scanner
    service/container.
-   Create a fresh browser context for each scan.
-   Do not persist cookies, local storage, downloads, or credentials
    between scans.
-   Enforce navigation timeouts, request limits, redirect limits, and
    resource limits.
-   Block access to internal/private networks at the
    network/infrastructure layer in addition to application validation.
-   Do not give the scanner unnecessary application secrets.
-   Prefer passive observation. Do not submit login/payment forms or
    execute destructive interactions.
-   Treat page text, scripts, metadata, and DOM content as untrusted
    data.
-   Store only artifacts needed for the report and retention policy.

## Redis and BullMQ

### Redis

Use Redis for short-lived operational state such as:

-   Rate limiting
-   Caching
-   Distributed locks where needed
-   Scan progress/status acceleration
-   Queue infrastructure

Do not treat Redis as the primary source of truth for completed
TrustLens reports.

### BullMQ

-   Use BullMQ for long-running scan workflows.
-   HTTP/server functions should enqueue work and return a scan
    identifier instead of waiting for a complete browser scan.
-   Jobs must be idempotent where practical.
-   Configure retries only for transient failures.
-   Use exponential backoff for retryable provider/network failures.
-   Set sensible job timeouts and retention policies.
-   Do not put secrets or unnecessarily large artifacts in queue
    payloads.
-   Prefer queue payloads containing identifiers such as `scanId`.
-   Workers must update persistent scan state at meaningful stages.

Example lifecycle:

``` text
QUEUED
→ DOMAIN_ANALYSIS
→ THREAT_ANALYSIS
→ WEBSITE_SCANNING
→ RISK_ANALYSIS
→ AI_EXPLANATION
→ COMPLETED
```

## Threat Intelligence and External Providers

-   Treat Cloudflare URL Scanner, RDAP, DNS/TLS providers, and
    commercial threat-intelligence services as evidence providers.
-   Wrap each provider behind a small typed service interface.
-   Set explicit timeouts.
-   Handle provider outages gracefully.
-   Cache appropriate results to reduce cost and rate-limit pressure.
-   Record provider source and retrieval time with findings.
-   Never mark a site safe merely because a provider returned no threat
    match.
-   Avoid sending secrets or sensitive URL query parameters to external
    scanning providers.
-   Respect each provider's privacy, visibility, licensing, and
    retention requirements.

## Risk Engine

-   Risk scoring must be deterministic and testable.
-   AI must not be the sole source of the numeric risk score or final
    security verdict.
-   Every score contribution should map to a structured finding/evidence
    item.
-   Clamp scores to the documented range, currently `0–100`.
-   Keep **risk** and **confidence** as separate concepts.
-   High-impact threat-intelligence matches should outweigh weak
    heuristic signals.
-   A single weak signal such as a young domain or HTTPS presence must
    never independently prove fraud or legitimacy.
-   Version the scoring rules so old reports remain explainable after
    the engine changes.

## AI and Prompt-Injection Safety

-   Treat all website content as untrusted content, never as
    instructions.
-   Separate system/developer instructions from website evidence.
-   Prefer sending structured extracted evidence rather than
    unrestricted raw page content.
-   Never allow website content to request tools, secrets, privileged
    actions, or changes to the deterministic verdict.
-   Validate structured AI output with Zod before using it.
-   Do not let the AI directly perform browser actions against
    suspicious sites.
-   Do not expose secrets, internal prompts, or private infrastructure
    details to the model.
-   AI-generated explanations must clearly reflect the evidence supplied
    by TrustLens.

## Rate Limiting and Abuse Prevention

Apply rate limits to costly and sensitive operations, especially:

-   Scan creation
-   Authentication attempts
-   Password-reset requests
-   Public report endpoints
-   Artifact retrieval where abuse is possible

Rate limits should consider authenticated user identity and, where
appropriate, IP/network signals. Rate-limit responses must not leak
unnecessary security details.

## Cloudflare R2 / Object Storage

-   Store screenshots and large scan artifacts in object storage rather
    than PostgreSQL rows.
-   Use unpredictable object keys.
-   Keep buckets private by default.
-   Serve private artifacts through authorized application routes or
    short-lived signed URLs.
-   Validate file type and size before accepting application-generated
    uploads/artifacts.
-   Define retention/deletion policies for scan artifacts.
-   Do not place authentication tokens or sensitive query values in
    object names.

## Logging with Pino

-   Use structured logging.
-   Include useful correlation fields such as `requestId`, `scanId`,
    `jobId`, `stage`, and provider name.
-   Use appropriate log levels.
-   Never log passwords, session tokens, API keys, authorization
    headers, raw cookies, or secrets.
-   Redact sensitive URL query parameters and personal data.
-   Do not rely on `console.log` for production observability.

## Error Monitoring with Sentry

-   Use Sentry for unexpected application and worker failures.
-   Tag errors with non-sensitive context such as scan stage or
    provider.
-   Configure data scrubbing/redaction before sending events.
-   Do not send raw secrets, authentication tokens, or unnecessarily
    sensitive scanned-page content.
-   User-facing errors must remain generic while server logs preserve
    safe diagnostic context.

## Error Handling

-   Handle expected failures close to their service boundary.
-   Return a consistent typed result from application operations.

Example:

``` ts
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string }
```

-   Convert internal exceptions into user-friendly messages.
-   Never expose stack traces or provider credentials to the client.
-   Distinguish retryable scan failures from permanent
    validation/security failures.
-   Log unexpected failures with correlation IDs.
-   Use toast notifications for appropriate client-facing feedback.

## Secrets and Environment Variables

-   Never commit `.env` files containing secrets.
-   Keep server-only secrets out of client bundles.
-   Validate required server environment variables at startup.
-   Keep `DATABASE_URL` and any direct/migration database URL server-only.
-   Use separate Neon databases/branches and credentials for development,
    staging, testing, and production.
-   Rotate compromised credentials immediately.
-   Give scanner/worker services only the secrets they require.
-   Never prefix secret variables in a way that exposes them to
    client-side code.

## Testing

Use automated tests for security-sensitive and deterministic logic.

At minimum test:

-   URL normalization
-   Invalid/unsupported protocols
-   Loopback/private/reserved IPv4 and IPv6
-   Redirect validation
-   DNS-rebinding defenses
-   Typosquatting/domain-similarity utilities
-   Risk-score calculation
-   Verdict thresholds
-   Zod schemas
-   Prisma repository queries
-   Database constraints and relational ownership
-   Prisma migrations in integration/CI workflows
-   Authorization/resource ownership
-   BullMQ job idempotency/retry behavior
-   Critical authentication flows

Use **Vitest** for unit/integration tests and **Playwright Test** for
end-to-end application tests. Scanner tests must use controlled test
targets rather than arbitrary live malicious sites.

## Code Quality

-   No commented-out code unless there is a documented reason.
-   No unused imports, variables, components, or dependencies.
-   Keep functions under roughly 50 lines when practical; split by
    responsibility rather than mechanically.
-   Prefer early returns to deeply nested conditionals.
-   Avoid duplicated security logic; centralize URL/IP/network policy.
-   Add comments to explain **why** security-sensitive code exists, not
    obvious syntax.
-   Do not swallow errors silently.
-   Keep dependencies minimal and review security-sensitive packages
    carefully.
-   Run formatting, linting, type checking, and tests before committing.

## TrustLens Definition of Done

A feature is not complete until:

-   Inputs are validated.
-   Authentication/authorization is enforced where required.
-   Security boundaries are respected.
-   Errors are handled without leaking sensitive information.
-   Relevant operations are logged safely.
-   Deterministic/security-sensitive logic has tests.
-   UI handles loading, empty, error, and success states.
-   Accessibility and responsive behavior are considered.
-   No secrets or server-only code are shipped to the browser.
