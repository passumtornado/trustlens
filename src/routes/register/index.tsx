import { createFileRoute } from "@tanstack/react-router";

import { AuthForm } from "../../components/auth/auth-form";
import { AuthShell } from "../../components/auth/auth-shell";

export const Route = createFileRoute("/register/")({ component: Register });

function Register() {
  return (
    <AuthShell
      eyebrow="Start with clarity"
      title="Create your account"
      description="Build a safer browsing habit with one place to investigate the links that matter."
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}
