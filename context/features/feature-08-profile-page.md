# Feature 8 — Profile Page

## Overview

Build the TrustLens profile-management page using the approved profile design.

## Requirements

- Create the Profile dashboard route.
- Reuse the dashboard shell.
- Add Profile Information card with:
  - Avatar
  - Change Photo button
  - Full name
  - Email
  - Verification badge
  - Role
  - Member since
  - Save Changes button
- Add Change Password card with:
  - Current password
  - New password
  - Confirm new password
  - Password visibility controls
  - Update Password button
- Validate editable fields using Zod.
- Include loading, saving, success, and error states.
- Use secure wording for password updates.
- Do not expose or prefill passwords.
- If backend/profile APIs do not yet exist, use mock data and clearly isolate placeholder handlers.

## Acceptance Criteria

- Profile form renders correctly.
- Editable values validate.
- Password fields are never prefilled.
- Save/update actions have loading states.
- Mobile layout works.
- `npm run build` passes.

## Out of Scope

- Real avatar upload storage
- Production password-change backend if not already implemented
- Account deletion

## References

-   `@context/screenshot/profile.png`
-   `@context/project-overview.md`
-   `@context/coding-standards.md`
-   `@context/ai-interaction-guidelines.md`
