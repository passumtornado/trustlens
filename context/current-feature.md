# Current Feature: Dashboard Sidebar / Navigation + Dark / Light Mode

<!-- Feature Name -->

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

- Create a reusable authenticated dashboard shell with a persistent sidebar.
- Add TrustLens branding and navigation for Dashboard/Home, New Scan, Scan History, Reports, Profile, and Settings.
- Highlight the active route and include a display-only Free Plan usage card with progress.
- Support a full desktop sidebar and collapsible/drawer navigation on smaller screens.
- Add light, dark, and system theme modes with persisted client-side selection.
- Keep semantic colors readable across themes and use shadcn/ui components where useful.
- Provide a placeholder dashboard page only; keep dashboard content, charts, history tables, and report details out of scope.

## Notes

<!-- Any extra notes -->

- Feature specification: [context/features/feature-03-dashboard-sidebar-navigation.md](features/feature-03-dashboard-sidebar-navigation.md).
- Reuse TanStack Router links and active-state behavior; avoid duplicating sidebar markup across dashboard routes.

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
