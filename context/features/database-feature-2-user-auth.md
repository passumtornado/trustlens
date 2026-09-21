# Database Feature 2 --- User and Authentication Data

## Overview

Set up TrustLens user and authentication persistence using **Better
Auth**, **Prisma 7**, and **Neon PostgreSQL**.

Better Auth owns authentication data such as users, accounts, sessions,
and verification records. TrustLens-specific profile/application fields
should extend or relate to the authenticated user without creating a
separate authentication system.

## Requirements

-   Use the existing Prisma 7 + Neon PostgreSQL setup.
-   Configure Better Auth with the Prisma adapter and shared server-side
    Prisma Client.
-   Use PostgreSQL as the Better Auth database provider.
-   Generate Better Auth's required Prisma schema using the Better Auth
    CLI.
-   Create and review a Prisma migration for authentication schema
    changes.
-   Use migrations for schema evolution; do not use `prisma db push` as
    the normal workflow.
-   Keep authentication and database access server-side.

### Better Auth Models

Support the core models required by the current Better Auth
configuration:

-   User
-   Session
-   Account
-   Verification

Do not introduce NextAuth/Auth.js-specific models such as
`VerificationToken` unless an explicitly installed feature requires
them.

Let the current Better Auth CLI generate the schema required by the
installed Better Auth version and plugins instead of copying an old
schema manually.

### User Data

The Better Auth user should contain the core identity fields required by
Better Auth, including:

-   id
-   name
-   email
-   emailVerified
-   image
-   createdAt
-   updatedAt

Add only TrustLens-specific fields genuinely required by the
application, such as:

-   role
-   plan

Use stable enums where appropriate, for example `USER` / `ADMIN` and
`FREE` / `PRO`.

Do not store passwords, password hashes, session tokens, OAuth
credentials, or verification data in custom TrustLens profile fields.

### TrustLens Relationships

The authenticated user must be able to own TrustLens application data.

At minimum:

``` text
User
 └── Scan[]
```

Other current/future relations may include Reports,
Settings/preferences, and subscription/plan data.

Use explicit Prisma relations and appropriate foreign keys.

### Account and Session Data

Better Auth remains responsible for:

-   credential accounts
-   OAuth/provider accounts
-   sessions and session tokens
-   verification records
-   password/credential handling

Do not implement custom session tables, password hashing, authentication
tokens, or parallel authentication logic.

### Constraints and Indexes

Use constraints required by Better Auth and the TrustLens schema.

Ensure fields requiring uniqueness remain unique, including user email,
session token, and provider/account identifiers where required.

Add indexes only for actual query patterns. Avoid redundant indexes when
PostgreSQL uniqueness constraints already provide the needed lookup
support.

### Cascade Behavior

Configure deletion behavior deliberately and keep it compatible with
Better Auth.

Do not automatically cascade-delete TrustLens scans/reports without
considering the project's data-retention policy.

Future account deletion must coordinate Better Auth deletion with
TrustLens data-retention requirements.

### Server-Side Access

Use the existing shared Prisma Client and Better Auth configuration.

``` text
TanStack Start
      ↓
Better Auth
      ↓
Prisma Adapter
      ↓
Prisma 7
      ↓
Neon PostgreSQL
```

Never import Prisma database access into browser/client components.

### Schema and Migration Workflow

Use the Better Auth CLI to generate/update the Prisma authentication
schema, then use Prisma for migrations.

Typical development workflow:

``` bash
npx auth@latest generate
pnpm prisma format
pnpm prisma validate
pnpm prisma migrate dev --name add-better-auth
pnpm prisma generate
```

Review schema changes and generated migration SQL before considering the
feature complete.

All development migrations must target the Neon development
branch/database.

### Security

-   Never store plaintext passwords.
-   Never expose password hashes or session tokens.
-   Never expose Neon credentials or Better Auth secrets.
-   Never log passwords, tokens, OAuth secrets, or connection strings.
-   Keep authorization checks separate from authentication.
-   Validate external application input with Zod where appropriate.
-   Return only required user fields to client-facing code.

## Acceptance Criteria

-   Better Auth uses the existing Prisma 7 + Neon PostgreSQL persistence
    layer.
-   Better Auth Prisma adapter is configured.
-   Required Better Auth models exist in `prisma/schema.prisma`.
-   TrustLens User data integrates cleanly with Better Auth.
-   A User can own TrustLens Scan records.
-   TrustLens-specific fields do not duplicate authentication secrets.
-   No custom password/session/token system exists.
-   Appropriate relations, unique constraints, and indexes exist.
-   Schema changes have a Prisma migration.
-   Migration is applied to the Neon development database.
-   `pnpm prisma validate` passes.
-   `pnpm prisma generate` passes.
-   Project build passes.

## Out of Scope

-   Login/Register UI
-   Forgot Password UI
-   Google OAuth provider configuration
-   Email verification UI
-   Account deletion implementation
-   Billing/payment integration
-   Notification preferences
-   Admin user-management UI

## References

-   `@context/trustlens-project-overview.md`
-   `@context/trustlens-coding-standards.md`
-   `@context/ai-interaction-guidelines.md`
-   `@context/current-feature.md`
-   `@prisma/schema.prisma`
-   `@prisma.config.ts`
