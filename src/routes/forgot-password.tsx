import { createFileRoute } from "@tanstack/react-router";

import { ForgotPasswordForm } from "../components/auth/forgot-password-form";
import { AuthShell } from "../components/auth/auth-shell";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Forgot your password?"
      description="Enter your email and we’ll help you get back into your TrustLens account."
      footerText="Remember your password?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
