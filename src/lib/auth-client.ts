import { createAuthClient } from "better-auth/react";

// Browser-safe Better Auth client; requests are same-origin against /api/auth.
export const authClient = createAuthClient();
