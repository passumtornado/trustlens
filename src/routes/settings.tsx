import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  Check,
  Monitor,
  Moon,
  Shield,
  Sun,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { DashboardShell } from "../components/dashboard/dashboard-shell";
import { Button } from "../components/ui/button";
import {
  getSettingsData,
  type SettingsData,
} from "../lib/server/settings-data";
import {
  applyTheme,
  readStoredTheme,
  setStoredTheme,
  subscribeToThemeChanges,
  type Theme,
} from "../lib/theme";

const themeOptions: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export const Route = createFileRoute("/settings")({
  loader: () => getSettingsData(),
  component: Settings,
});

function Settings() {
  const initialProfile = Route.useLoaderData();
  const [theme, setTheme] = useState<Theme>("system");
  const [profile, setProfile] = useState<SettingsData>(initialProfile);
  const [draftName, setDraftName] = useState(initialProfile.name);
  const [draftEmail, setDraftEmail] = useState(initialProfile.email);
  const [editingField, setEditingField] = useState<"name" | "email" | null>(
    null,
  );
  const [scanCompleted, setScanCompleted] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [retention, setRetention] = useState("1 year");

  useEffect(() => {
    const nextTheme = readStoredTheme();
    setTheme(nextTheme);
    applyTheme(nextTheme);

    return subscribeToThemeChanges(setTheme);
  }, []);

  useEffect(() => {
    setProfile(initialProfile);
    setDraftName(initialProfile.name);
    setDraftEmail(initialProfile.email);
  }, [initialProfile]);

  function selectTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    setStoredTheme(nextTheme);
  }

  function beginEditing(field: "name" | "email") {
    setEditingField(field);
    if (field === "name") {
      setDraftName(profile.name);
      return;
    }
    setDraftEmail(profile.email);
  }

  function cancelEditing() {
    setEditingField(null);
    setDraftName(profile.name);
    setDraftEmail(profile.email);
  }

  function saveField(field: "name" | "email") {
    const trimmedName = field === "name" ? draftName.trim() : profile.name;
    const trimmedEmail = field === "email" ? draftEmail.trim() : profile.email;

    if (field === "name" && trimmedName.length === 0) {
      return;
    }

    if (field === "email" && trimmedEmail.length === 0) {
      return;
    }

    setProfile((current) => ({
      ...current,
      ...(field === "name" ? { name: trimmedName } : { email: trimmedEmail }),
    }));

    setEditingField(null);
  }

  function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Permanently delete your account and all data.",
    );

    if (confirmed) {
      window.alert("Account deletion was not performed in this demo flow.");
    }
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            Settings
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-[-0.05em] text-foreground sm:text-[3.15rem]">
            Settings
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Manage your account and preferences.
          </p>
        </div>

        <section className="space-y-4">
          <SettingsCard
            icon={<User className="size-5" />}
            title="Account"
            subtitle="Your personal information and account details."
            content={
              <div className="grid gap-4 py-1 md:grid-cols-[1fr_auto] md:items-center">
                <div className="grid gap-4 md:grid-cols-[0.7fr_1.1fr_0.6fr] md:items-center">
                  <div className="text-sm font-medium text-muted-foreground">
                    Name
                  </div>
                  {editingField === "name" ? (
                    <>
                      <input
                        value={draftName}
                        onChange={(event) => setDraftName(event.target.value)}
                        className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
                        aria-label="Edit display name"
                      />
                      <div className="flex gap-2 md:justify-end">
                        <Button
                          variant="default"
                          size="sm"
                          className="h-9 rounded-lg px-3 text-xs"
                          onClick={() => saveField("name")}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 rounded-lg px-3 text-xs"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-base font-medium text-foreground">
                        {profile.name}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-full justify-center rounded-lg border-border bg-transparent px-3 text-sm font-medium text-foreground md:w-[84px]"
                        onClick={() => beginEditing("name")}
                      >
                        Edit
                      </Button>
                    </>
                  )}

                  <div className="text-sm font-medium text-muted-foreground">
                    Email
                  </div>
                  {editingField === "email" ? (
                    <>
                      <input
                        type="email"
                        value={draftEmail}
                        onChange={(event) => setDraftEmail(event.target.value)}
                        className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
                        aria-label="Edit email address"
                      />
                      <div className="flex gap-2 md:justify-end">
                        <Button
                          variant="default"
                          size="sm"
                          className="h-9 rounded-lg px-3 text-xs"
                          onClick={() => saveField("email")}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 rounded-lg px-3 text-xs"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-base font-medium text-foreground">
                        {profile.email}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-full justify-center rounded-lg border-border bg-transparent px-3 text-sm font-medium text-foreground md:w-[84px]"
                        onClick={() => beginEditing("email")}
                      >
                        Edit
                      </Button>
                    </>
                  )}

                  <div className="text-sm font-medium text-muted-foreground">
                    Plan
                  </div>
                  <div className="text-base font-medium text-foreground">
                    {profile.plan}
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="h-9 w-full justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground md:w-[95px]"
                  >
                    Upgrade
                  </Button>
                </div>
              </div>
            }
          />

          <SettingsCard
            icon={<Monitor className="size-5" />}
            title="Appearance"
            subtitle="Choose how the app looks."
            content={
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-1">
                  {themeOptions.map(({ value, label, icon: Icon }) => {
                    const selected = theme === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => selectTheme(value)}
                        className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                          selected
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-transparent bg-transparent text-muted-foreground hover:text-foreground"
                        }`}
                        aria-pressed={selected}
                      >
                        <Icon size={16} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            }
          />

          <SettingsCard
            icon={<Bell className="size-5" />}
            title="Notifications"
            subtitle="Manage what you're notified about."
            content={
              <div className="space-y-3 py-1">
                <ToggleRow
                  label="Scan completed"
                  description="Get notified when a scan is finished"
                  enabled={scanCompleted}
                  onChange={setScanCompleted}
                />
                <ToggleRow
                  label="Security alerts"
                  description="Get notified about critical security findings"
                  enabled={securityAlerts}
                  onChange={setSecurityAlerts}
                />
                <ToggleRow
                  label="Product updates"
                  description="Get the latest news and features"
                  enabled={productUpdates}
                  onChange={setProductUpdates}
                />
              </div>
            }
          />

          <SettingsCard
            icon={<Shield className="size-5" />}
            title="Privacy"
            subtitle="Manage your data and privacy settings."
            content={
              <div className="flex flex-col gap-5 py-1 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-[210px]">
                      <p className="mb-1 text-sm font-medium text-foreground">
                        Data retention
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Keep my scan history
                      </p>
                    </div>

                    <div className="relative w-full max-w-[270px]">
                      <select
                        value={retention}
                        onChange={(event) => setRetention(event.target.value)}
                        className="h-11 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-10 text-sm text-foreground outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20"
                        aria-label="Data retention selection"
                      >
                        <option value="30 days">30 days</option>
                        <option value="90 days">90 days</option>
                        <option value="6 months">6 months</option>
                        <option value="1 year">1 year</option>
                        <option value="Keep until I delete it">
                          Keep until I delete it
                        </option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
                        <Check className="size-3.5 rotate-180" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end md:pt-2">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 size={15} />
                    Delete Account
                  </button>
                </div>
              </div>
            }
          />
        </section>
      </div>
    </DashboardShell>
  );
}

type SettingsCardProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  content: ReactNode;
};

function SettingsCard({ icon, title, subtitle, content }: SettingsCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:gap-8">
        <div className="flex w-full max-w-[320px] items-start gap-4 md:min-w-[290px]">
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#eaf1ff] text-primary shadow-inner dark:bg-[#1d2a3a] dark:text-[#9fc4ff]">
            {icon}
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <div className="flex-1">{content}</div>
      </div>
    </div>
  );
}

type ToggleRowProps = {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
};

function ToggleRow({ label, description, enabled, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl py-1">
      <div className="min-w-0 flex-1 pr-4">
        <p className="text-base font-medium text-foreground">{label}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        aria-pressed={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full border transition-colors ${
          enabled
            ? "border-sky-300 bg-sky-500"
            : "border-border bg-muted-foreground/30"
        }`}
      >
        <span
          className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
