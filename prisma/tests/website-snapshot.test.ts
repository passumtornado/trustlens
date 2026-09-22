import "dotenv/config";

import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";

import { prisma } from "../../src/lib/db/prisma";

test("artifact metadata is complete and ownership resolves through the scan", async () => {
  assert.notEqual(process.env.NODE_ENV, "production");
  const rollback = new Error("Rollback snapshot test fixtures");

  try {
    await assert.rejects(prisma.$transaction(async (tx) => {
      const owner = await tx.user.create({ data: {
        name: "Snapshot test", email: `${randomUUID()}@example.test`,
      } });
      const scan = await tx.scan.create({ data: {
        userId: owner.id, submittedUrl: "https://example.test/",
        normalizedUrl: "https://example.test/", normalizedDomain: "example.test",
        hostname: "example.test",
      } });
      const base = { scanId: scan.id, requestedUrl: scan.submittedUrl };
      const legacy = await tx.websiteSnapshot.create({ data: base });
      assert.equal(legacy.r2ObjectKey, null);
      assert.equal(legacy.artifactType, null);
      const data = {
        ...base, artifactType: "SCREENSHOT" as const,
        r2ObjectKey: `test-artifacts/${randomUUID()}.png`, mimeType: "image/png",
        sizeBytes: 4096n, width: 1280, height: 720,
        createdAt: new Date("2026-09-22T12:00:00Z"),
        expiresAt: new Date("2026-10-22T12:00:00Z"),
      };
      const screenshot = await tx.websiteSnapshot.create({ data });
      const html = await tx.websiteSnapshot.create({ data: {
        ...base, artifactType: "HTML_CAPTURE", r2ObjectKey: `test-artifacts/${randomUUID()}.html`,
        mimeType: "text/html", sizeBytes: 3_000_000_000n,
      } });
      assert.equal(html.sizeBytes, 3_000_000_000n);
      assert.equal(html.width, null);
      assert.equal(html.expiresAt, null);
      const owned = await tx.websiteSnapshot.findFirstOrThrow({
        where: { id: screenshot.id, scan: { userId: owner.id } },
        include: { scan: { select: { userId: true } } },
      });
      assert.equal(owned.scan.userId, owner.id);
      assert.equal(owned.r2ObjectKey, data.r2ObjectKey);
      assert.equal(owned.sizeBytes, 4096n);
      assert.deepEqual(owned.expiresAt, data.expiresAt);
      assert.equal(await tx.websiteSnapshot.findFirst({
        where: { id: screenshot.id, scan: { userId: randomUUID() } },
      }), null);
      assert.equal(await tx.websiteSnapshot.count({ where: { scanId: scan.id } }), 3);

      async function rejectInvalid(write: () => Promise<unknown>) {
        await tx.$executeRaw`SAVEPOINT invalid_metadata`;
        await assert.rejects(write);
        await tx.$executeRaw`ROLLBACK TO SAVEPOINT invalid_metadata`;
        await tx.$executeRaw`RELEASE SAVEPOINT invalid_metadata`;
      }
      await rejectInvalid(() => tx.websiteSnapshot.create({ data: { ...base, r2ObjectKey: "test/partial" } }));
      await rejectInvalid(() => tx.websiteSnapshot.create({ data: { ...data, sizeBytes: -1n } }));
      await rejectInvalid(() => tx.websiteSnapshot.create({ data: { ...data, width: 0 } }));
      await rejectInvalid(() => tx.websiteSnapshot.create({ data: { ...data, height: null } }));
      await rejectInvalid(() => tx.websiteSnapshot.create({ data: { ...data, r2ObjectKey: "data:image/png;base64,AAAA" } }));
      await rejectInvalid(() => tx.websiteSnapshot.create({ data: { ...data, r2ObjectKey: "https://example.test/file.png" } }));
      await rejectInvalid(() => tx.websiteSnapshot.create({ data: { ...data, mimeType: "invalid" } }));
      await rejectInvalid(() => tx.websiteSnapshot.create({ data: { ...data, expiresAt: data.createdAt } }));
      await rejectInvalid(() => tx.websiteSnapshot.create({ data: { ...data, scanId: randomUUID() } }));

      const expiring = await tx.websiteSnapshot.findMany({ where: {
        scanId: scan.id, expiresAt: { lte: new Date("2026-10-23T00:00:00Z") },
      } });
      assert.deepEqual(expiring.map(({ id }) => id), [screenshot.id]);
      await tx.scan.delete({ where: { id: scan.id } });
      assert.equal(await tx.websiteSnapshot.count({ where: { scanId: scan.id } }), 0);
      throw rollback;
    }, { timeout: 30_000 }), (error: unknown) => error === rollback);
  } finally {
    await prisma.$disconnect();
  }
});
