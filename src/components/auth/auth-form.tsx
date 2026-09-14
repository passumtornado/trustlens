import { useState } from "react";

import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

type AuthFormProps = {
  mode: "login" | "register";
};

const inputClassName =
  "h-10 rounded-[10px] border-[#cfdae2] bg-white px-4 text-sm text-[#30445f] placeholder:text-[#72808a] focus-visible:border-[#0b63f6] focus-visible:ring-[#0b63f6]/20 sm:h-12 sm:text-base";

export function AuthForm({ mode }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isRegister = mode === "register";

  return (
    <form
      className="space-y-2 sm:space-y-5"
      onSubmit={(event) => event.preventDefault()}
    >
      {isRegister && (
        <div>
          <Label htmlFor="name" className="sr-only">
            Full name
          </Label>
          <div className="relative">
            <UserRound
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa8aa]"
              size={17}
            />
            <Input
              id="name"
              name="name"
              placeholder="Your name"
              autoComplete="name"
              className={`${inputClassName} pl-11`}
              required
            />
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="email" className="sr-only">
          Email address
        </Label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa8aa]"
            size={17}
          />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={`${inputClassName} pl-11`}
            required
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label htmlFor="password" className="sr-only mb-0">
            Password
          </Label>
        </div>
        <div className="relative">
          <LockKeyhole
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa8aa]"
            size={17}
          />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            className={`${inputClassName} pl-11 pr-12`}
            minLength={8}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#8c9a9d] hover:text-trust-ink focus-visible:outline-2 focus-visible:outline-trust-blue"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>

      {isRegister ? (
        <label className="flex items-start gap-3 text-xs leading-5 text-[#738185]">
          <Checkbox name="terms" className="mt-0.5" required />
          <span>
            I agree to the{" "}
            <a
              href="#terms"
              className="font-semibold text-trust-blue hover:underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#privacy"
              className="font-semibold text-trust-blue hover:underline"
            >
              Privacy Policy
            </a>
            .
          </span>
        </label>
      ) : (
        <div className="flex items-center justify-between gap-4 text-xs text-[#738185]">
          <label className="flex min-w-0 items-center gap-3">
            <Checkbox name="remember" defaultChecked />
            Remember me on this device
          </label>
          <a
            href="#forgot-password"
            className="shrink-0 font-semibold text-trust-blue hover:underline"
          >
            Forgot password?
          </a>
        </div>
      )}

      <Button
        type="submit"
        className="h-10 w-full bg-[#1478f2] text-base text-white hover:bg-[#0868dc] sm:h-12"
      >
        {isRegister ? "Create your account" : "Sign in"}
      </Button>

      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 py-1 sm:gap-4">
        <Separator className="w-auto" />
        <span className="whitespace-nowrap text-xs text-[#8a98a1]">
          or continue with
        </span>
        <Separator className="w-auto" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-10 w-full rounded-[10px] border-[#cfdae2] bg-white text-sm text-[#0a2a5e] hover:bg-[#f5f8fb] sm:h-12 sm:text-base"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt=""
          className="size-4"
        />
        Continue with Google
      </Button>
    </form>
  );
}
