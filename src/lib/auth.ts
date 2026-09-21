import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { prisma } from "./db/prisma";

// Server-only Better Auth instance. Never import this module from client code.
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    // No transactional email provider is configured yet; log the reset link
    // server-side so the flow is testable in development.
    sendResetPassword: async ({ user, url }) => {
      console.log(`[dev] Password reset link for ${user.email}: ${url}`);
    },
  },
  plugins: [tanstackStartCookies()],
});
