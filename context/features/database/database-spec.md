# TrustLens Database — Prisma + Neon PostgreSQL Setup

## Overview

Set up the initial TrustLens persistence layer using:

- PostgreSQL
- Neon
- Prisma ORM 7

This feature establishes the database foundation for TrustLens.

The initial Prisma schema should be based on the core data models defined in:

`@context/trustlens-project-overview.md`
`@context/trustlens-coding-standards.md`
- Prisma docs: https://prisma.io/docs (Prisma 7 has breaking changes - fetch latest)


The schema is expected to evolve as authentication, scanning, reporting,
threat intelligence, and other TrustLens features are implemented.

This feature must follow the project's database and security standards.

---

## Requirements

### 1. Prisma ORM 7

Use **Prisma ORM 7**.

Do not use Prisma 6 configuration patterns when they conflict with
Prisma 7.

Install the required Prisma packages and the appropriate Neon driver
adapter.

Use the Prisma 7 `prisma-client` generator.

The Prisma Client generator must define an explicit output directory.

Example:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}



## Notes

We will have a development branch that we work on that will be in DATABASE_URL and then we will have a production branch. So we ALWAYS create migrations and never push directly unless specified.

IMPORTANT! Use Prisma 7, which has some breaking changes. Read the entire upgrade guide at https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7 to get a good idea of the changes.

You can also look at the setup guide here - https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres