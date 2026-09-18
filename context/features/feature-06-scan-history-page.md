# Feature 6 — Scan History Page

## Overview

Build the TrustLens Scan History page for browsing previously submitted website scans.

## Requirements

- Create the Scan History dashboard route.
- Reuse the shared dashboard shell.
- Include:
  - Page title and subtitle
  - Search input
  - Status/risk filter
  - Sort control
  - Scan history table/list
- Each scan item should show:
  - Website/domain
  - Scan date/time
  - Risk score
  - Verdict/status
  - Detected/likely brand when available
  - Scan progress/status where appropriate
  - Action to view details/report
- Include semantic badges for safe/caution/high-risk/impersonation states.
- Add pagination or a placeholder pagination control.
- Add empty, loading, and error states.
- Use typed mock data unless real data access already exists.
- Ensure tables degrade gracefully on mobile.

## Acceptance Criteria

- Search/filter/sort UI renders and behaves with mock data.
- Scan statuses are visually clear.
- Users can navigate to the relevant report/details route.
- Responsive layout works.
- Loading/empty/error states are present.
- `npm run build` passes.

## Out of Scope

- Real database queries unless already available
- Background scan processing
- Export functionality

## References
- `@context/screenshot/scan_history.png`
- `@context/trustlens-project-overview.md`
- `@context/trustlens-coding-standards.md`
- `@context/ai-interaction-guidelines.md`
