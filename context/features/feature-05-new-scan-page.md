# Feature 5 — New Scan Page

## Overview

Build the TrustLens New Scan page where a user can enter a website URL to begin a future security investigation.

## Requirements

- Create `/dashboard/new-scan` or the project-approved equivalent route.
- Reuse the dashboard shell/sidebar.
- Include:
  - Page heading and subtitle
  - Main website-check card
  - URL input
  - Start Scan button
  - Example domain chips
  - Feature explanation grid
  - Safety/isolation information banner
- Validate user input with Zod.
- Client-side validation is for UX only; do not claim the URL is safe.
- Do not fetch or navigate to the submitted URL directly from the browser.
- For this frontend feature, the Start Scan action may:
  - call a placeholder handler, or
  - connect to an already-existing server function if one exists.
- Include loading, validation, success/queued, and error states.
- Keep wording consistent with TrustLens:
  - safe investigation
  - isolated environment
  - website trust analysis
- Ensure example chips can populate the input.

## Acceptance Criteria

- URL input and example chips work.
- Invalid URL input shows clear validation.
- Start Scan has loading/disabled state.
- No client-side browser navigation to suspicious targets occurs.
- Page is responsive.
- `npm run build` passes.

## Out of Scope

- Playwright scanning
- SSRF implementation
- BullMQ worker implementation
- Threat-intelligence integrations

## References

- `@context/features/newscan.png`
- `@context/trustlens-project-overview.md`
- `@context/trustlens-coding-standards.md`
- `@context/trustlens-ai-interaction-guidelines.md`
