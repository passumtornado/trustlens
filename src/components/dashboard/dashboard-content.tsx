import {
  AlertTriangle,
  CheckCircle2,
  FileWarning,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

import type { DashboardData } from "../../lib/server/dashboard-data";

const metricCards = [
  {
    key: "totalScans",
    label: "Total scans",
    icon: TrendingUp,
    accent: "text-primary",
    format: (value: number) => value.toLocaleString(),
  },
  {
    key: "highRisk",
    label: "High risk",
    icon: AlertTriangle,
    accent: "text-risk-danger",
    format: (value: number) => value.toLocaleString(),
  },
  {
    key: "safe",
    label: "Safe",
    icon: CheckCircle2,
    accent: "text-risk-safe",
    format: (value: number) => value.toLocaleString(),
  },
  {
    key: "impersonations",
    label: "Impersonations",
    icon: ShieldAlert,
    accent: "text-risk-warning",
    format: (value: number) => value.toLocaleString(),
  },
] as const;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

function riskLabel(verdict: string | null) {
  return verdict?.replaceAll("_", " ") ?? "In progress";
}

function riskClass(verdict: string | null) {
  if (verdict === "LIKELY_SAFE" || verdict === "LOW_RISK")
    return "text-risk-safe bg-risk-safe/10";
  if (verdict === "CAUTION") return "text-risk-warning bg-risk-warning/10";
  if (verdict === "SUSPICIOUS" || verdict === "HIGH_RISK")
    return "text-orange-700 bg-orange-500/10 dark:text-orange-300";
  if (verdict === "IMPERSONATION" || verdict === "KNOWN_MALICIOUS")
    return "text-risk-danger bg-risk-danger/10";
  return "text-muted-foreground bg-muted";
}

export function DashboardContent({ data }: { data: DashboardData }) {
  if (!data.hasUser || data.recentScans.length === 0) return <DashboardEmpty />;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          Overview
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          A live view of your website investigations.
        </p>
      </header>

      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Scan metrics"
      >
        {metricCards.map(({ key, label, icon: Icon, accent, format }) => (
          <article
            key={key}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {label}
              </p>
              <Icon className={accent} size={20} />
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight">
              {format(data.metrics[key])}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              From saved investigations
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <ScansOverTimeChart data={data.scansOverTime} />
        <RiskDistribution data={data.riskDistribution} />
      </section>

      <RecentScansTable scans={data.recentScans} />
    </div>
  );
}

function ScansOverTimeChart({
  data,
}: {
  data: DashboardData["scansOverTime"];
}) {
  const max = Math.max(...data.map((item) => item.count), 1);
  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold">Scans over time</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Saved investigations by day
          </p>
        </div>
        <TrendingUp className="text-primary" size={20} />
      </div>
      <div className="mt-6 flex h-48 items-end gap-3 border-b border-border px-1 pb-0 sm:gap-5">
        {data.map((item) => (
          <div
            key={item.label}
            className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
          >
            <span className="text-xs font-semibold text-foreground opacity-0 transition-opacity group-hover:opacity-100">
              {item.count}
            </span>
            <div
              className="w-full max-w-10 rounded-t-md bg-primary/80 transition-colors group-hover:bg-primary"
              style={{ height: `${Math.max((item.count / max) * 75, 8)}%` }}
              aria-label={`${item.count} scans on ${item.label}`}
            />
            <span className="text-[10px] text-muted-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

function RiskDistribution({
  data,
}: {
  data: DashboardData["riskDistribution"];
}) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div>
        <h2 className="font-semibold">Risk distribution</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Every result has a label and count
        </p>
      </div>
      <div className="mt-7 flex items-center gap-6">
        <div
          className="relative flex size-36 shrink-0 items-center justify-center rounded-full"
          style={{ background: conicGradient(data, total) }}
          role="img"
          aria-label="Risk distribution chart"
        >
          <div className="flex size-24 flex-col items-center justify-center rounded-full bg-card">
            <span className="text-2xl font-bold">{total}</span>
            <span className="text-xs text-muted-foreground">scans</span>
          </div>
        </div>
        <ul className="min-w-0 space-y-3 text-sm">
          {data.map((item) => (
            <li
              key={item.key}
              className="flex items-center justify-between gap-4"
            >
              <span className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </span>
              <strong>{item.count}</strong>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function conicGradient(data: DashboardData["riskDistribution"], total: number) {
  if (total === 0) return "conic-gradient(var(--color-muted) 0 100%)";
  let cursor = 0;
  const stops = data.map((item) => {
    const start = cursor;
    cursor += (item.count / total) * 100;
    return `${item.color} ${start}% ${cursor}%`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

function RecentScansTable({ scans }: { scans: DashboardData["recentScans"] }) {
  return (
    <article className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="font-semibold">Recent scans</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Latest saved investigations
          </p>
        </div>
        <FileWarning className="text-muted-foreground" size={20} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-162.5 text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Website</th>
              <th className="px-5 py-3 font-medium">Risk</th>
              <th className="px-5 py-3 font-medium">Confidence</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {scans.map((scan) => (
              <tr key={scan.id} className="hover:bg-muted/30">
                <td className="px-5 py-4 font-medium">{scan.domain}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${riskClass(scan.verdict)}`}
                  >
                    {riskLabel(scan.verdict)}
                  </span>
                  {scan.riskScore !== null && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      {scan.riskScore}/100
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {scan.confidence !== null ? `${scan.confidence}%` : "—"}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {scan.status.toLowerCase()}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {dateFormatter.format(new Date(scan.createdAt))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function DashboardEmpty() {
  return (
    <section className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <ShieldAlert size={26} />
      </div>
      <h1 className="mt-4 text-xl font-semibold">No scans yet</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Your dashboard will populate after your first website investigation.
      </p>
    </section>
  );
}

export function DashboardLoading() {
  return (
    <section className="space-y-6" aria-busy="true">
      <div className="h-10 w-48 animate-pulse rounded bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-xl bg-muted" />
    </section>
  );
}
