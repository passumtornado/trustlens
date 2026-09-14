# Current Feature: Forgot Password

<!-- Feature Name -->

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

<!-- Goals & requirements -->

- Add a focused Forgot Password route that reuses the shared authentication layout.
- Include a page title, explanatory text, email address field, submit/reset button, and back-to-login link.
- Validate email input with Zod.
- Provide loading, success, and error UI states.
- Use generic security-conscious success feedback that does not reveal whether an account exists.
- Use shadcn/ui form components and match TrustLens colors, spacing, typography, and responsive behavior.

## Notes

<!-- Any extra notes -->

- Feature specification: [context/features/feature-02-forgot-password.md](features/feature-02-forgot-password.md).
- Keep reset-password token pages, email provider configuration, and backend email delivery out of scope.

## History

- 2026-09-14: Login and register UI phase started; status set to In Progress.
- 2026-09-14: Implemented responsive `/login` and `/register` routes with shared authentication layout.
- 2026-09-14: Added shadcn/ui primitives, Tailwind CSS v4 styling, Lucide icons, TrustLens logo assets, and authentication background imagery.
- 2026-09-14: Validated desktop/mobile layouts, no-scroll behavior, route rendering, type diagnostics, production build, and whitespace checks; status set to Completed.
- 2026-09-14: Forgot Password feature started; status set to In Progress.
