import { useState } from "react";

import { ArrowLeft, CheckCircle2, LoaderCircle, Mail } from "lucide-react";

import { Link } from "@tanstack/react-router";

import { forgotPasswordSchema } from "../../lib/auth-schemas";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type RequestState = "idle" | "loading" | "success" | "error";

const inputClassName =
  "h-10 rounded-[10px] border-[#cfdae2] bg-white px-4 text-sm text-[#30445f] placeholder:text-[#72808a] focus-visible:border-[#0b63f6] focus-visible:ring-[#0b63f6]/20 sm:h-12 sm:text-base";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<RequestState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      setState("error");
      setErrorMessage(
        result.error.issues[0]?.message ?? "Enter a valid email address.",
      );
      return;
    }

    setState("loading");
    setErrorMessage("");

    window.setTimeout(() => {
      setState("success");
    }, 700);
  }

  if (state === "success") {
    return (
      <div className="space-y-5" role="status" aria-live="polite">
        <div className="rounded-lg border border-[#bfe6d1] bg-[#effaf3] p-4 text-[#17694f]">
          <CheckCircle2 className="mb-3 text-risk-safe" size={27} />
          <p className="text-sm font-bold">Check your inbox</p>
          <p className="mt-1 text-sm leading-6">
            If an account matches that email, reset instructions have been
            requested. Please check your inbox shortly.
          </p>
        </div>
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-sm font-semibold text-trust-blue hover:underline"
        >
          <ArrowLeft size={16} />
          Back to sign in
        </Link>
      </div>
    );
  }

  const isLoading = state === "loading";

  return (
    <form className="space-y-3 sm:space-y-5" onSubmit={handleSubmit} noValidate>
      <div>
        <Label htmlFor="forgot-email" className="sr-only">
          Email address
        </Label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa8aa]"
            size={17}
          />
          <Input
            id="forgot-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (state === "error") setState("idle");
            }}
            placeholder="you@example.com"
            autoComplete="email"
            className={`${inputClassName} pl-11`}
            aria-invalid={state === "error"}
            aria-describedby={
              state === "error" ? "forgot-email-error" : undefined
            }
            disabled={isLoading}
            required
          />
        </div>
        {state === "error" && (
          <p
            id="forgot-email-error"
            className="mt-2 text-xs font-medium text-risk-danger"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="h-10 w-full bg-[#1478f2] text-base text-white hover:bg-[#0868dc] sm:h-12"
      >
        {isLoading ? (
          <>
            <LoaderCircle className="animate-spin" size={17} />
            Requesting reset link...
          </>
        ) : (
          "Send reset instructions"
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
