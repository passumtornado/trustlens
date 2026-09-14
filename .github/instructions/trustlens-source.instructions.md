---
name: TrustLens Copilot Instructions
description: "Core project-wide instructions for implementing, reviewing, and modifying TrustLens features."
applyTo: "**/*"
---

# TrustLens Copilot Instructions

TrustLens is a website trust, scam, phishing, fraud, and impersonation analysis platform.

## Source of Truth

Before implementing or significantly modifying a feature, read the relevant project context in this order:

1. `context/current-feature.md`
2. `context/trustlens-project-overview.md`
3. `context/trustlens-coding-standards.md`
4. `context/trustlens-ai-interaction-guidelines.md`

Treat these files as the source of truth for TrustLens architecture, security boundaries, coding standards, and feature scope.

If the current feature specification conflicts with architecture, coding standards, or security requirements, stop and explain the conflict before implementing it.

Do not silently change architecture to resolve a conflict.

## Technology Stack

Use the approved TrustLens stack:

- **Framework:** TanStack Start
- **Frontend:** React
- **Language:** TypeScript with strict mode
- **Routing:** TanStack Router
- **Styling:** Tailwind CSS v4
- **UI:** shadcn/ui
- **Forms:** TanStack Form
- **Validation:** Zod
- **Server State:** TanStack Query
- **Database:** PostgreSQL
- **Database Hosting:** Neon
- **ORM:** Prisma
- **Authentication:** Better Auth
- **Cache / Queue Backend:** Redis / Upstash
- **Background Jobs:** BullMQ
- **Browser Scanner:** Playwright + Chromium
- **Artifact Storage:** Cloudflare R2
- **AI:** OpenAI
- **Logging:** Pino
- **Monitoring:** Sentry
- **Unit / Integration Testing:** Vitest
- **E2E Testing:** Playwright

Do not replace an approved technology with an alternative unless explicitly requested.

## Architecture Boundaries

Maintain the following high-level architecture:

```text
User
  ↓
TanStack Start
  ├── Better Auth
  │
  ├── Prisma
  │     ↓
  │   Neon PostgreSQL
  │
  └── Redis / Upstash
          ↓
        BullMQ
          ↓
    Isolated Scanner
          ↓
 Playwright + Chromium
          ↓
 Potentially Hostile Site



