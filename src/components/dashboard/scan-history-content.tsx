import {
  ArrowRight,
  ChevronDown,
  Filter,
  Search,
  ShieldAlert,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import type {
  ScanHistoryData,
  ScanHistoryItem,
} from "../../lib/server/scan-history-data";

const statusOptions = [
  "all",
  "PENDING",
  "QUEUED",
  "RUNNING",
  "COMPLETED",
  "FAILED",
] as const;

type StatusFilter = (typeof statusOptions)[number];

type RiskFilter =
  "all" | "safe" | "caution" | "high-risk" | "impersonation" | "unknown";

type SortValue = "newest" | "oldest" | "riskHigh" | "riskLow" | "domain";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function getRiskGroup(verdict: string | null): RiskFilter {
  if (verdict === "LIKELY_SAFE" || verdict === "LOW_RISK") return "safe";
  if (verdict === "CAUTION") return "caution";
  if (verdict === "SUSPICIOUS" || verdict === "HIGH_RISK") return "high-risk";
  if (verdict === "IMPERSONATION") return "impersonation";
  return "unknown";
}

function verdictLabel(verdict: string | null) {
  if (!verdict) return "In progress";
  return verdict.replaceAll("_", " ").toLowerCase();
}

function verdictClass(verdict: string | null) {
  const riskGroup = getRiskGroup(verdict);

  if (riskGroup === "safe") return "text-risk-safe bg-risk-safe/10";
  if (riskGroup === "caution") return "text-risk-warning bg-risk-warning/10";
  if (riskGroup === "high-risk")
    return "text-orange-700 bg-orange-500/10 dark:text-orange-300";
  if (riskGroup === "impersonation")
    return "text-risk-danger bg-risk-danger/10";
  return "text-muted-foreground bg-muted";
}

function statusProgress(status: string) {
  switch (status) {
    case "COMPLETED":
      return 100;
    case "RUNNING":
      return 72;
    case "QUEUED":
      return 40;
    case "PENDING":
      return 20;
    case "FAILED":
      return 0;
    default:
      return 0;
  }
}

function statusClass(status: string) {
  switch (status) {
    case "COMPLETED":
      return "text-risk-safe bg-risk-safe/10";
    case "RUNNING":
      return "text-primary bg-primary/10";
    case "QUEUED":
    case "PENDING":
      return "text-risk-warning bg-risk-warning/10";
    case "FAILED":
      return "text-risk-danger bg-risk-danger/10";
    default:
      return "text-muted-foreground bg-muted";
  }
}

function reviewLabel(scan: ScanHistoryItem) {
  if (scan.verdict) return verdictLabel(scan.verdict);
  return scan.status.toLowerCase();
}

export function ScanHistoryContent({ data }: { data: ScanHistoryData }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [sortBy, setSortBy] = useState<SortValue>("newest");

  const filteredScans = useMemo(() => {
    const term = search.trim().toLowerCase();

    return [...data.scans]
      .filter((scan) => {
        const matchesSearch =
          term.length === 0 ||
          scan.domain.toLowerCase().includes(term) ||
          scan.inputUrl.toLowerCase().includes(term) ||
          (scan.brandName ?? "").toLowerCase().includes(term);

        const matchesStatus =
          statusFilter === "all" || scan.status === statusFilter;

        const matchesRisk =
          riskFilter === "all" || getRiskGroup(scan.verdict) === riskFilter;

        return matchesSearch && matchesStatus && matchesRisk;
      })
      .sort((left, right) => {
        if (sortBy === "oldest") {
          return (
            new Date(left.createdAt).getTime() -
            new Date(right.createdAt).getTime()
          );
        }
        if (sortBy === "riskHigh") {
          const leftScore = left.riskScore ?? -1;
          const rightScore = right.riskScore ?? -1;
          return rightScore - leftScore;
        }
        if (sortBy === "riskLow") {
          const leftScore = left.riskScore ?? Number.MAX_SAFE_INTEGER;
          const rightScore = right.riskScore ?? Number.MAX_SAFE_INTEGER;
          return leftScore - rightScore;
        }
        if (sortBy === "domain") {
          return left.domain.localeCompare(right.domain);
        }
        return (
          new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime()
        );
      });
  }, [data.scans, riskFilter, search, sortBy, statusFilter]);

  if (!data.hasUser) {
    return <ScanHistoryEmpty />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            Investigations
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Scan History
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review recent website checks, verdicts, and associated brand
            signals.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm">
          {filteredScans.length} saved scan
          {filteredScans.length === 1 ? "" : "s"}
        </div>
      </header>

      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-4">
          <label className="relative block min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              aria-label="Search scan history"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search domains, brands, or URLs"
              className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20"
            />
          </label>

          <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[30rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <label className="relative block min-w-0">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </span>
              <div className="relative">
                <Filter
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={15}
                />
                <select
                  aria-label="Filter by scan status"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as StatusFilter)
                  }
                  className="h-11 w-full appearance-none rounded-lg border border-input bg-background pl-9 pr-10 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === "all" ? "All statuses" : option}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={15}
                />
              </div>
            </label>

            <label className="relative block min-w-0">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Risk
              </span>
              <div className="relative">
                <select
                  aria-label="Filter by risk level"
                  value={riskFilter}
                  onChange={(event) =>
                    setRiskFilter(event.target.value as RiskFilter)
                  }
                  className="h-11 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-10 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20"
                >
                  <option value="all">All risk levels</option>
                  <option value="safe">Safe</option>
                  <option value="caution">Caution</option>
                  <option value="high-risk">High risk</option>
                  <option value="impersonation">Impersonation</option>
                  <option value="unknown">Unknown</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={15}
                />
              </div>
            </label>

            <label className="relative block min-w-0">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Sort
              </span>
              <div className="relative">
                <select
                  aria-label="Sort scans"
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value as SortValue)
                  }
                  className="h-11 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-10 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="riskHigh">Risk: high to low</option>
                  <option value="riskLow">Risk: low to high</option>
                  <option value="domain">Domain A–Z</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={15}
                />
              </div>
            </label>
          </div>
        </div>
      </section>

      {filteredScans.length === 0 ? (
        <ScanHistoryEmptyState />
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-border bg-card shadow-sm md:block">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Website</th>
                  <th className="px-5 py-3 font-medium">Scan date</th>
                  <th className="px-5 py-3 font-medium">Risk</th>
                  <th className="px-5 py-3 font-medium">Brand</th>
                  <th className="px-5 py-3 font-medium">Progress</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredScans.map((scan) => (
                  <tr key={scan.id} className="align-middle hover:bg-muted/30">
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">
                          {scan.domain}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {scan.inputUrl}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {dateFormatter.format(new Date(scan.createdAt))}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${verdictClass(scan.verdict)}`}
                        >
                          {reviewLabel(scan)}
                        </span>
                        {scan.riskScore !== null && (
                          <span className="text-xs text-muted-foreground">
                            Risk score: {scan.riskScore}/100
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {scan.brandName ? (
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">
                            {scan.brandName}
                          </p>
                          {scan.brandConfidence !== null && (
                            <p className="text-xs text-muted-foreground">
                              Confidence {scan.brandConfidence}%
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          Not detected
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex min-w-[170px] items-center gap-3">
                        <div className="h-2.5 w-20 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full ${scan.status === "COMPLETED" ? "bg-risk-safe" : scan.status === "FAILED" ? "bg-risk-danger" : "bg-primary"}`}
                            style={{ width: `${statusProgress(scan.status)}%` }}
                          />
                        </div>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusClass(scan.status)}`}
                        >
                          {scan.status.toLowerCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        to="/reports"
                        search={{ scanId: scan.id }}
                        className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
                      >
                        View report
                        <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 md:hidden">
            {filteredScans.map((scan) => (
              <article
                key={scan.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      {scan.domain}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {scan.inputUrl}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold capitalize ${verdictClass(scan.verdict)}`}
                  >
                    {reviewLabel(scan)}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between gap-3">
                    <span>Scan date</span>
                    <span className="font-medium text-foreground">
                      {dateFormatter.format(new Date(scan.createdAt))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Brand</span>
                    <span className="font-medium text-foreground">
                      {scan.brandName ?? "Not detected"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Risk score</span>
                    <span className="font-medium text-foreground">
                      {scan.riskScore !== null ? `${scan.riskScore}/100` : "—"}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span className="font-medium text-foreground">
                      {scan.status}
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${scan.status === "COMPLETED" ? "bg-risk-safe" : scan.status === "FAILED" ? "bg-risk-danger" : "bg-primary"}`}
                      style={{ width: `${statusProgress(scan.status)}%` }}
                    />
                  </div>
                </div>

                <Link
                  to="/reports"
                  search={{ scanId: scan.id }}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  View report
                  <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
            <button
              type="button"
              className="rounded-md border border-border px-3 py-1.5 opacity-50"
            >
              Previous
            </button>
            <span className="font-medium text-foreground">Page 1</span>
            <button
              type="button"
              className="rounded-md border border-border px-3 py-1.5"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ScanHistoryEmpty() {
  return (
    <section className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <ShieldAlert size={26} />
      </div>
      <h1 className="mt-4 text-xl font-semibold">No scan history</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        There are no saved investigations for the demo account yet.
      </p>
    </section>
  );
}

function ScanHistoryEmptyState() {
  return (
    <section className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Search size={26} />
      </div>
      <h2 className="mt-4 text-xl font-semibold">No matches found</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Try clearing one of the filters or searching for a different domain or
        brand.
      </p>
    </section>
  );
}

export function ScanHistoryLoading() {
  return (
    <section className="mx-auto max-w-7xl space-y-6" aria-busy="true">
      <div className="h-10 w-52 animate-pulse rounded bg-muted" />
      <div className="h-20 animate-pulse rounded-2xl bg-muted" />
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-2xl bg-muted"
          />
        ))}
      </div>
    </section>
  );
}

export function ScanHistoryError({ error }: { error: Error }) {
  return (
    <section className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-risk-danger/10 text-risk-danger">
        <ShieldAlert size={26} />
      </div>
      <h1 className="mt-4 text-xl font-semibold">Scan history unavailable</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {error.message ||
          "The scan history service is temporarily unavailable."}
      </p>
    </section>
  );
}
