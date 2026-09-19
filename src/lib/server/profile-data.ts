import { createServerFn } from "@tanstack/react-start";

import { prisma } from "../db/prisma";

const DEMO_USER_EMAIL = "demo@trustlens.dev";

const roleLabels: Record<string, string> = {
  USER: "Standard User",
  ADMIN: "Administrator",
};

export type ProfileData = {
  name: string;
  email: string;
  emailVerified: boolean;
  role: string;
  memberSince: string;
};

export const getProfileData = createServerFn({ method: "GET" }).handler(
  async (): Promise<ProfileData> => {
    const user = await prisma.user.findUnique({
      where: { email: DEMO_USER_EMAIL },
      select: {
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      name: user?.name ?? "TrustLens Demo",
      email: user?.email ?? DEMO_USER_EMAIL,
      emailVerified: user?.emailVerified ?? false,
      role: roleLabels[user?.role ?? "USER"] ?? "Standard User",
      memberSince: (user?.createdAt ?? new Date()).toISOString(),
    };
  },
);
