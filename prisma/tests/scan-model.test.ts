import "dotenv/config";

import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";

import { prisma } from "../../src/lib/db/prisma";

test("scan defaults, evidence metadata, and ownership constraints", async () => {
  assert.notEqual(process.env.NODE_ENV, "production");
  const rollback = new Error("Rollback scan-model test fixtures");

  try {
    await assert.rejects(prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name: "Scan model test", email: `${randomUUID()}@example.test` },
      });
      const scan = await tx.scan.create({
        data: {
          userId: user.id,
          submittedUrl: "https://example.test/path",
          normalizedUrl: "https://example.test/path",
          normalizedDomain: "example.test",
          hostname: "example.test",
        },
      });
      assert.equal(scan.status, "QUEUED");
      assert.equal(scan.stage, "VALIDATION");
      for (const value of [scan.riskScore, scan.confidence, scan.verdict,
        scan.completedAt, scan.failureCode, scan.failureMessage, scan.failedStage]) {
        assert.equal(value, null);
      }

      await tx.$executeRaw`SAVEPOINT ownership_check`;
      await assert.rejects(tx.user.delete({ where: { id: user.id } }), { code: "P2003" });
      await tx.$executeRaw`ROLLBACK TO SAVEPOINT ownership_check`;
      assert.equal(await tx.scan.count({ where: { id: scan.id, userId: user.id } }), 1);

      await tx.$executeRaw`SAVEPOINT null_owner_check`;
      await assert.rejects(tx.$executeRaw`UPDATE "Scan" SET "userId" = NULL WHERE id = ${scan.id}`);
      await tx.$executeRaw`ROLLBACK TO SAVEPOINT null_owner_check`;

      await tx.$executeRaw`SAVEPOINT missing_owner_check`;
      await assert.rejects(tx.scan.update({ where: { id: scan.id }, data: { userId: randomUUID() } }), { code: "P2003" });
      await tx.$executeRaw`ROLLBACK TO SAVEPOINT missing_owner_check`;

      await tx.$executeRaw`SAVEPOINT invalid_stage_check`;
      await assert.rejects(tx.$executeRaw`UPDATE "Scan" SET stage = 'INVALID_STAGE' WHERE id = ${scan.id}`);
      await tx.$executeRaw`ROLLBACK TO SAVEPOINT invalid_stage_check`;

      const failed = await tx.scan.update({
        where: { id: scan.id },
        data: { status: "FAILED", stage: "TLS_ANALYSIS", failedStage: "TLS_ANALYSIS",
          failureCode: "TLS_CHECK_FAILED", failureMessage: "The connection could not be verified." },
      });
      assert.equal(failed.failedStage, "TLS_ANALYSIS");
      assert.equal(failed.failureCode, "TLS_CHECK_FAILED");
      assert.equal(failed.riskScore, null);

      await tx.$executeRaw`SAVEPOINT message_length_check`;
      await assert.rejects(tx.scan.update({ where: { id: scan.id }, data: { failureMessage: "x".repeat(257) } }), { code: "P2000" });
      await tx.$executeRaw`ROLLBACK TO SAVEPOINT message_length_check`;

      const completed = await tx.scan.update({
        where: { id: scan.id },
        data: { status: "COMPLETED", stage: "REPORT_GENERATION", riskScore: 20,
          confidence: 80, verdict: "LOW_RISK", completedAt: new Date(),
          failureCode: null, failureMessage: null, failedStage: null },
      });
      assert.equal(completed.riskScore, 20);
      assert.equal(completed.confidence, 80);
      assert.equal(completed.verdict, "LOW_RISK");
      assert.ok(completed.completedAt);
      throw rollback;
    }, { timeout: 30_000 }), (error: unknown) => error === rollback);
  } finally {
    await prisma.$disconnect();
  }
});
