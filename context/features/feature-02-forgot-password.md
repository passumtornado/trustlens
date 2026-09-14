# Feature 2 — Forgot Password

## Overview

Build the TrustLens forgot-password experience as a focused authentication feature that visually matches the login/register pages.

## Requirements

- Add a forgot-password route.
- Reuse the shared authentication layout from Feature 1.
- Include:
  - Page title
  - Short explanatory text
  - Email address field
  - Submit/reset button
  - Back to login link
- Validate email with Zod.
- Include loading, success, and error UI states.
- Success state should clearly explain that reset instructions have been requested without exposing whether an account exists for that email.
- Keep wording security-conscious and avoid account-enumeration behavior.
- Use shadcn/ui form components where appropriate.
- Match TrustLens colors, spacing, typography, and responsive behavior.

## Acceptance Criteria

- Forgot-password route is reachable from Login.
- Invalid email input is blocked with a clear message.
- Submission has a visible loading state.
- Success feedback is generic and security-safe.
- Back-to-login navigation works.
- `npm run build` passes.

## Out of Scope

- Reset-password token page unless explicitly requested
- Email provider configuration
- Backend email delivery

## References
- `context/screenshots/authentication_ui/login_register_ui.png`
- `@context/project-overview.md`
- `@context/coding-standards.md`
- `@context/ai-interaction-guidelines.md`
