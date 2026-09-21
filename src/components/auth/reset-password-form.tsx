import { useState } from "react";

import { ArrowLeft, CheckCircle2, LoaderCircle } from "lucide-react";

import { Link, useNavigate } from "@tanstack/react-router";

import { passwordSchema } from "../../lib/auth-schemas";
import { authClient } from "../../lib/auth-client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type RequestState = "idle" | "loading" | "success" | "error";

const inputClassName =
  "h-10 rounded-[10px] border-[#cfdae2] bg-white px-4 text-sm text-[#30445f] placeholder:text-[#72808a] focus-visible:border-[#0b63f6] focus-visible:ring-[#0b63f6]/20 sm:h-12 sm:text-base";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState<RequestState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setState("error");
      setErrorMessage("This reset link is invalid or has expired.");
      return;
    }

    const result = passwordSchema.safeParse(password);
    if (!result.success) {
      setState("error");
      setErrorMessage(
        result.error.issues[0]?.message ?? "Enter a new password.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setState("error");
      setErrorMessage("Passwords do not match.");
      return;
    }

    setState("loading");
    setErrorMessage("");

    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });

    if (error) {
      setState("error");
      setErrorMessage(
        error.message ?? "This reset link is invalid or has expired.",
      );
      return;
    }

    setState("success");
    window.setTimeout(() => navigate({ to: "/login" }), 1500);
  }

  if (state === "success") {
    return (
      <div className="space-y-5" role="status" aria-live="polite">
        <div className="rounded-lg border border-[#bfe6d1] bg-[#effaf3] p-4 text-[#17694f]">
          <CheckCircle2 className="mb-3 text-risk-safe" size={27} />
          <p className="text-sm font-bold">Password updated</p>
          <p className="mt-1 text-sm leading-6">
            Redirecting you to sign in with your new password.
          </p>
        </div>
      </div>
    );
  }

  const isLoading = state === "loading";

  return (
    <form className="space-y-3 sm:space-y-5" onSubmit={handleSubmit} noValidate>
      <div>
        <Label htmlFor="new-password" className="sr-only">
          New password
        </Label>
        <Input
          id="new-password"
          name="newPassword"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="New password"
          autoComplete="new-password"
          className={inputClassName}
          disabled={isLoading}
          required
        />
      </div>
      <div>
        <Label htmlFor="confirm-password" className="sr-only">
          Confirm new password
        </Label>
        <Input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="Confirm new password"
          autoComplete="new-password"
          className={inputClassName}
          disabled={isLoading}
          required
        />
      </div>
      {state === "error" && (
        <p className="text-xs font-medium text-risk-danger" role="alert">
          {errorMessage}
        </p>
      )}
      <Button
        type="submit"
        disabled={isLoading}
        className="h-10 w-full bg-[#1478f2] text-base text-white hover:bg-[#0868dc] sm:h-12"
      >
        {isLoading ? (
          <>
            <LoaderCircle className="animate-spin" size={17} />
            Updating password...
          </>
        ) : (
          "Update password"
        )}
      </Button>
      <Link
        to="/login"
        className="flex items-center justify-center gap-2 pt-1 text-sm font-semibold text-[#63759d] hover:text-trust-blue hover:underline"
      >
        <ArrowLeft size={16} />
        Back to sign in
      </Link>
    </form>
  );
}
