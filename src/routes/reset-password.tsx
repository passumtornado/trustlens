import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { AuthShell } from "../components/auth/auth-shell";
import { ResetPasswordForm } from "../components/auth/reset-password-form";

const searchSchema = z.object({
  token: z.string().optional().default(""),
});

export const Route = createFileRoute("/reset-password")({
  validateSearch: searchSchema,
  component: ResetPassword,
});

function ResetPassword() {
  const { token } = Route.useSearch();

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Choose a new password"
      description="Enter and confirm a new password for your TrustLens account."
      footerText="Remember your password?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
    >
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
