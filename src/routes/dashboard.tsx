import { createFileRoute } from "@tanstack/react-router";

import { DashboardShell } from "../components/dashboard/dashboard-shell";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  return (
    <DashboardShell>
      <section className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Overview</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Your TrustLens workspace is ready for its first scan.</p>
        <div className="mt-8 rounded-xl border border-dashed border-border bg-card p-8 text-center shadow-sm">
          <ShieldPlaceholder />
          <h2 className="mt-4 text-lg font-semibold">Your dashboard content will appear here</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Use the sidebar to navigate between your scans, reports, and account settings.</p>
        </div>
      </section>
    </DashboardShell>
  );
}

function ShieldPlaceholder() {
  return <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary"><ShieldCheckIcon /></div>;
}

function ShieldCheckIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-7"><path d="M12 3 5 6v5c0 4.5 2.9 8.5 7 10 4.1-1.5 7-5.5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>;
}