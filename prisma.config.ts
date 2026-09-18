import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Prisma CLI (migrate/introspect/studio) always uses the direct,
    // non-pooled connection. The pooled DATABASE_URL is used by the
    // Neon driver adapter at runtime (see src/lib/db/prisma.ts).
    url: env("DIRECT_URL"),
  },
});
