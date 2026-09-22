import { createServerFn } from "@tanstack/react-start";

import { prisma } from "../db/prisma";

const DEMO_USER_EMAIL = "demo@trustlens.dev";

export type ScanHistoryItem = {
  id: string;
  domain: string;
  inputUrl: string;
  riskScore: number | null;
  confidence: number | null;
  verdict: string | null;
  status: string;
  createdAt: string;
  completedAt: string | null;
  brandName: string | null;
  brandConfidence: number | null;
};

export type ScanHistoryData = {
  hasUser: boolean;
  scans: ScanHistoryItem[];
};

export const getScanHistoryData = createServerFn({ method: "GET" }).handler(
  async (): Promise<ScanHistoryData> => {
    const user = await prisma.user.findUnique({
      where: { email: DEMO_USER_EMAIL },
      select: { id: true },
    });

    if (!user) {
      return { hasUser: false, scans: [] };
    }

    const scans = await prisma.scan.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        submittedUrl: true,
        normalizedDomain: true,
        riskScore: true,
        confidence: true,
        verdict: true,
        status: true,
        createdAt: true,
        completedAt: true,
        brandCandidates: {
          orderBy: { confidence: "desc" },
          take: 1,
          select: {
            brandName: true,
            confidence: true,
          },
        },
      },
    });

    return {
      hasUser: true,
      scans: scans.map((scan) => {
        const leadingBrand = scan.brandCandidates[0] ?? null;

        return {
          id: scan.id,
          domain: scan.normalizedDomain,
          inputUrl: scan.submittedUrl,
          riskScore: scan.riskScore,
          confidence: scan.confidence,
          verdict: scan.verdict,
          status: scan.status,
          createdAt: scan.createdAt.toISOString(),
          completedAt: scan.completedAt ? scan.completedAt.toISOString() : null,
          brandName: leadingBrand?.brandName ?? null,
          brandConfidence: leadingBrand?.confidence ?? null,
        };
      }),
    };
  },
);
