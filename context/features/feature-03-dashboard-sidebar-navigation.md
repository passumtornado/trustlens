# Feature 3 — Dashboard Sidebar / Navigation + Dark / Light Mode

## Overview

Create the reusable TrustLens dashboard shell navigation. This feature establishes the persistent sidebar and theme behavior used by all dashboard pages.

## Requirements

- Create the authenticated dashboard layout.
- Add a persistent left sidebar with:
  - TrustLens logo
  - Tagline
  - Dashboard/Home
  - New Scan
  - Scan History
  - Reports
  - Profile
  - Settings
- Highlight the active route.
- Add the Free Plan usage card at the bottom of the sidebar.
- Include usage text and progress bar as display-only mock data for now.
- Implement responsive behavior:
  - Full sidebar on desktop
  - Collapsible/drawer navigation on smaller screens
- Add dark/light/system theme support.
- Persist the selected theme in a sensible client-side manner.
- Ensure semantic colors remain readable in both themes.
- Create shared dashboard shell components so later features do not duplicate layout logic.
- Use TanStack Router links and active-state behavior.
- Use shadcn/ui components where useful.
- Do not build the main dashboard content yet beyond a placeholder.

## Acceptance Criteria

- Sidebar appears on dashboard routes.
- All navigation items point to the intended routes.
- Active navigation is visually distinct.
- Mobile navigation works.
- Theme can switch between light/dark/system.
- Theme selection persists across reloads where supported.
- No duplicated sidebar markup across dashboard pages.
- `npm run build` passes.

## Out of Scope

- Dashboard charts/cards
- Scan history table content
- Report details

## References
- `@context/screenshot/dashboard_ui.png `
- `@context/project-overview.md`

