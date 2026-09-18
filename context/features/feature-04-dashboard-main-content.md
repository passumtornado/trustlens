# Feature 4 — Dashboard Main Content

## Overview

Build the TrustLens dashboard home-page content inside the shared dashboard shell created in Feature 3.

## Requirements
- Add metric cards for:
  - Total Scans
  - High Risk
  - Safe
  - Impersonations
- Add a scans-over-time chart.
- Add a risk-distribution visualization.
- Add a Recent Scans table.
- Use mock data from the project's mock-data source or a dedicated typed mock-data module.
- Keep chart/data components reusable.
- Use semantic risk labels and icons.
- Ensure risk is never communicated by color alone.
- Add loading/empty-state placeholders even if mock data is currently used.
- Match the approved TrustLens dashboard design.
- Keep all data display frontend-only for this feature unless backend data integration is explicitly requested.

## Acceptance Criteria

- Dashboard content matches the TrustLens design.
- Metric cards display correctly.
- Charts render responsively.
- Recent Scans table is usable on smaller screens.
- Empty/loading states exist.
- Components are split by responsibility.
- `npm run build` passes.

## Out of Scope

- Real scan data
- Analytics backend
- Notification backend

## References

- `@context/screenshots/dashboard_ui.png`
- `@context/trustlens-project-overview.md`
- `@context/trustlens-coding-standards.md`
- `@context/trustlens-ai-interaction-guidelines.md`
