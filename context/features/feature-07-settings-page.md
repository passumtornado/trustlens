# Feature 9 --- Settings Page

## Overview

Build a simple TrustLens Settings page for managing account details,
appearance, notifications, and privacy preferences.

Reuse the existing dashboard layout and match the provided Settings UI.

## Requirements

-   Create the Settings dashboard route.
-   Reuse the existing dashboard shell.
-   Highlight **Settings** in the sidebar.
-   Add the page title **Settings** with the description:
    -   `Manage your account and preferences.`

### Account

-   Display:
    -   Name
    -   Email
    -   Current plan
-   Add **Edit** actions for name and email.
-   Add an **Upgrade** action for the current plan.
-   Use the current authenticated user data when available.

### Appearance

-   Add theme options:
    -   Light
    -   Dark
    -   System
-   Theme selection must use the existing Feature 3 theme behavior.
-   Keep the selected theme synchronized across the dashboard.

### Notifications

Add toggles for:

-   **Scan completed** --- Get notified when a scan is finished.
-   **Security alerts** --- Get notified about critical security
    findings.
-   **Product updates** --- Get the latest news and features.

Store frontend-only preferences locally unless settings persistence
already exists.

### Privacy

-   Add a **Data retention** selector.
-   Example options:
    -   30 days
    -   90 days
    -   6 months
    -   1 year
    -   Keep until I delete it

### Delete Account

-   Add a **Delete Account** button with destructive/red styling.
-   Display a short warning:
    -   `Permanently delete your account and all data.`
-   Require a confirmation dialog before any deletion action.
-   Do not perform real account deletion in this feature.

### UI

-   Match `@context/screenshot/settings.png`.
-   Use existing TrustLens cards, spacing, typography, icons, and
    semantic colors.
-   Use existing shadcn/ui components where appropriate.
-   Add loading, saving, success, and error states where relevant.
-   Ensure the page works on desktop and mobile.
-   Maintain accessibility and strict TypeScript with no `any`.

## Acceptance Criteria

-   Settings route renders correctly.
-   Existing dashboard shell is reused.
-   Account information is displayed.
-   Light / Dark / System theme selection works.
-   Theme stays synchronized with Feature 3.
-   Notification toggles work.
-   Data retention can be selected.
-   Delete Account requires confirmation.
-   Page matches the provided Settings UI.
-   Responsive layout works.
-   No secrets or database credentials are exposed.
-   Project build passes.

## Out of Scope

-   Actual account deletion
-   Notification delivery backend
-   Billing/payment implementation
-   Data export backend
-   Automated data-retention deletion

## References

-   `@context/screenshot/settings.png`
-   `@context/project-overview.md`
-   `@context/coding-standards.md`
-   `@context/ai-interaction-guidelines.md`
