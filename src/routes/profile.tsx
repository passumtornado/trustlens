import { createFileRoute } from "@tanstack/react-router";
import {
  BadgeCheck,
  Camera,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  UserRound,
} from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

import { DashboardShell } from "../components/dashboard/dashboard-shell";
import { Button } from "../components/ui/button";
import {
  changePasswordSchema,
  profileInfoSchema,
} from "../lib/profile-schemas";
import { getProfileData, type ProfileData } from "../lib/server/profile-data";

export const Route = createFileRoute("/profile")({
  loader: () => getProfileData(),
  component: Profile,
});

function formatMemberSince(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate));
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase());
  return initials.join("") || "?";
}

type ProfileFormErrors = Partial<Record<"name" | "email", string>>;

type PasswordFormErrors = Partial<
  Record<"currentPassword" | "newPassword" | "confirmPassword", string>
>;

function Profile() {
  const initialProfile = Route.useLoaderData();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-6">
          <h1 className="text-4xl font-bold tracking-[-0.03em] text-foreground sm:text-5xl">
            Profile
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Manage your account information and preferences.
          </p>
        </div>

        <div className="space-y-6">
          <ProfileInformationCard initialProfile={initialProfile} />
          <ChangePasswordCard />
        </div>
      </div>
    </DashboardShell>
  );
}

function ProfileInformationCard({
  initialProfile,
}: {
  initialProfile: ProfileData;
}) {
  const [name, setName] = useState(initialProfile.name);
  const [email, setEmail] = useState(initialProfile.email);
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = profileInfoSchema.safeParse({ name, email });

    if (!result.success) {
      const fieldErrors: ProfileFormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (field === "name" || field === "email") {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      setStatus("error");
      return;
    }

    setErrors({});
    setStatus("saving");

    // No profile update API exists yet; simulate persistence for the demo flow.
    window.setTimeout(() => {
      setStatus("saved");
    }, 600);
  }

  return (
    <Card
      icon={<UserRound className="size-5" />}
      title="Profile Information"
      subtitle=""
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
            {getInitials(name)}
          </div>
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 gap-2 rounded-lg px-3 text-sm font-medium"
              onClick={() =>
                window.alert("Avatar upload is not available in this demo.")
              }
            >
              <Camera size={15} />
              Change Photo
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Full name" error={errors.name}>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
              aria-invalid={Boolean(errors.name)}
            />
          </Field>

          <Field label="Email address" error={errors.email}>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 pr-24 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
                aria-invalid={Boolean(errors.email)}
              />
              {initialProfile.emailVerified && (
                <span className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-full bg-risk-safe/10 px-2 py-1 text-xs font-medium text-risk-safe">
                  <BadgeCheck size={12} />
                  Verified
                </span>
              )}
            </div>
          </Field>

          <Field label="Role">
            <input
              value={initialProfile.role}
              disabled
              className="h-11 w-full cursor-not-allowed rounded-lg border border-input bg-muted/40 px-3 text-sm text-muted-foreground outline-none"
            />
          </Field>

          <Field label="Member since">
            <input
              value={formatMemberSince(initialProfile.memberSince)}
              disabled
              className="h-11 w-full cursor-not-allowed rounded-lg border border-input bg-muted/40 px-3 text-sm text-muted-foreground outline-none"
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-3">
          {status === "saved" && (
            <p className="text-sm font-medium text-risk-safe">Saved.</p>
          )}
          <Button
            type="submit"
            disabled={status === "saving"}
            className="h-10 rounded-lg px-5 text-sm font-medium"
          >
            {status === "saving" ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function ChangePasswordCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<PasswordFormErrors>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: PasswordFormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (
          (field === "currentPassword" ||
            field === "newPassword" ||
            field === "confirmPassword") &&
          !fieldErrors[field]
        ) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      setStatus("error");
      return;
    }

    setErrors({});
    setStatus("saving");

    // No password-change backend exists yet; simulate the update for the demo flow.
    window.setTimeout(() => {
      setStatus("saved");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 600);
  }

  return (
    <Card
      icon={<KeyRound className="size-5" />}
      title="Change Password"
      subtitle=""
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-3">
          <PasswordField
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
            visible={showCurrent}
            onToggleVisible={() => setShowCurrent((value) => !value)}
            error={errors.currentPassword}
            autoComplete="current-password"
          />
          <PasswordField
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            visible={showNew}
            onToggleVisible={() => setShowNew((value) => !value)}
            error={errors.newPassword}
            autoComplete="new-password"
          />
          <PasswordField
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            visible={showConfirm}
            onToggleVisible={() => setShowConfirm((value) => !value)}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          {status === "saved" && (
            <p className="text-sm font-medium text-risk-safe">
              Password updated.
            </p>
          )}
          <Button
            type="submit"
            disabled={status === "saving"}
            className="h-10 rounded-lg px-5 text-sm font-medium"
          >
            {status === "saving" ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

type PasswordFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggleVisible: () => void;
  error?: string;
  autoComplete: string;
};

function PasswordField({
  label,
  value,
  onChange,
  visible,
  onToggleVisible,
  error,
  autoComplete,
}: PasswordFieldProps) {
  return (
    <Field label={label} error={error}>
      <div className="relative">
        <Lock
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          className="h-11 w-full rounded-lg border border-input bg-background pl-9 pr-10 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
          aria-invalid={Boolean(error)}
        />
        <button
          type="button"
          onClick={onToggleVisible}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={
            visible
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </Field>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Card({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#eaf1ff] text-primary dark:bg-[#1d2a3a] dark:text-[#9fc4ff]">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
