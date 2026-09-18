import { createServerFn } from "@tanstack/react-start";

import { prisma } from "../db/prisma";

const DEMO_USER_EMAIL = "demo@trustlens.dev";

const riskGroups = [
  { key: "safe", label: "Safe", color: "#16a34a" },
  { key: "caution", label: "Caution", color: "#f59e0b" },
  { key: "high", label: "High risk", color: "#f97316" },
  { key: "critical", label: "Critical", color: "#dc2626" },
] as const;

export type DashboardData = {
  hasUser: boolean;
  metrics: {
    totalScans: number;
    highRisk: number;
    safe: number;
    impersonations: number;
  };
  scansOverTime: Array<{ label: string; count: number }>;
  riskDistribution: Array<{
    key: string;
    label: string;
    color: string;
    count: number;
  }>;
  recentScans: Array<{
    id: string;
    domain: string;
    riskScore: number | null;
    confidence: number | null;
    verdict: string | null;
    status: string;
    createdAt: string;
  }>;
};

export const getDashboardData = createServerFn({ method: "GET" }).handler(
  async (): Promise<DashboardData> => {
    const user = await prisma.user.findUnique({
      where: { email: DEMO_USER_EMAIL },
      select: { id: true },
    });

    if (!user) {
      return {
        hasUser: false,
        metrics: { totalScans: 0, highRisk: 0, safe: 0, impersonations: 0 },
        scansOverTime: [],
        riskDistribution: riskGroups.map(({ key, label, color }) => ({
          key,
          label,
          color,
          count: 0,
        })),
        recentScans: [],
      };
    }

    const scans = await prisma.scan.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rootDomain: true,
        riskScore: true,
        confidence: true,
        verdict: true,
        status: true,
        createdAt: true,
      },
    });

    const counts = {
      totalScans: scans.length,
      highRisk: scans.filter((scan) => (scan.riskScore ?? 0) >= 60).length,
      safe: scans.filter(
        (scan) => scan.verdict === "LIKELY_SAFE" || scan.verdict === "LOW_RISK",
      ).length,
      impersonations: scans.filter((scan) => scan.verdict === "IMPERSONATION")
        .length,
    };

    const distribution = riskGroups.map(({ key, label, color }) => ({
      key,
      label,
      color,
      count: scans.filter((scan) => {
        const score = scan.riskScore;
        if (key === "safe") return score !== null && score < 40;
        if (key === "caution")
          return score !== null && score >= 40 && score < 60;
        if (key === "high") return score !== null && score >= 60 && score < 80;
        return score !== null && score >= 80;
      }).length,
    }));

    const dayCounts = new Map<string, number>();
    for (const scan of scans) {
      const key = scan.createdAt.toISOString().slice(0, 10);
      dayCounts.set(key, (dayCounts.get(key) ?? 0) + 1);
    }
    const scansOverTime = Array.from(dayCounts.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .slice(-7)
      .map(([label, count]) => ({ label: label.slice(5), count }));

    return {
      hasUser: true,
      metrics: counts,
      scansOverTime,
      riskDistribution: distribution,
      recentScans: scans.slice(0, 8).map((scan) => ({
        id: scan.id,
        domain: scan.rootDomain,
        riskScore: scan.riskScore,
        confidence: scan.confidence,
        verdict: scan.verdict,
        status: scan.status,
        createdAt: scan.createdAt.toISOString(),
      })),
    };
  },
);
