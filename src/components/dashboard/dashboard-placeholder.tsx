import { DashboardShell } from "./dashboard-shell";

type DashboardPlaceholderProps = { title: string; description: string };

export function DashboardPlaceholder({ title, description }: DashboardPlaceholderProps) {
  return (
    <DashboardShell>
      <section className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">TrustLens</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{title}</h1>
        <div className="mt-8 rounded-xl border border-dashed border-border bg-card p-8 text-sm text-muted-foreground shadow-sm">{description}</div>
      </section>
    </DashboardShell>
  );
}