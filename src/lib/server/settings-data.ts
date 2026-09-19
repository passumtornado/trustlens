import { createServerFn } from "@tanstack/react-start";

import { prisma } from "../db/prisma";

const DEMO_USER_EMAIL = "demo@trustlens.dev";

export type SettingsData = {
  name: string;
  email: string;
  plan: string;
};

export const getSettingsData = createServerFn({ method: "GET" }).handler(
  async (): Promise<SettingsData> => {
    const user = await prisma.user.findUnique({
      where: { email: DEMO_USER_EMAIL },
      select: { name: true, email: true },
    });

    return {
      name: user?.name ?? "TrustLens Demo",
      email: user?.email ?? DEMO_USER_EMAIL,
      plan: "Free Plan",
    };
  },
);
