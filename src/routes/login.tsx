import { createFileRoute } from "@tanstack/react-router";

import { AuthForm } from "../components/auth/auth-form";
import { AuthShell } from "../components/auth/auth-shell";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Welcome back"
      description="Sign in to your TrustLens account"
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkTo="/register"
    >
      <AuthForm mode="login" />
    </AuthShell>
  );
}
