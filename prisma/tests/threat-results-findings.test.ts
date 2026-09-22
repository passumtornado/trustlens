import "dotenv/config";

import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";

import { prisma } from "../../src/lib/db/prisma";

test("provider outcomes and findings preserve provenance without calculating risk", async () => {
  assert.notEqual(process.env.NODE_ENV, "production");
  const rollback = new Error("Rollback threat-result test fixtures");

  try {
    await assert.rejects(prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name: "Threat evidence test", email: `${randomUUID()}@example.test` },
      });
      const scan = await tx.scan.create({ data: {
        userId: user.id, submittedUrl: "https://example.test/",
        normalizedUrl: "https://example.test/", normalizedDomain: "example.test",
        hostname: "example.test",
      } });
      const retrievedAt = new Date("2026-09-22T12:00:00Z");
      const match = await tx.threatResult.create({ data: {
        scanId: scan.id, provider: "TEST_PROVIDER", status: "MATCH", detected: true,
        categories: ["PHISHING"], reference: "test-provider:observation-1", retrievedAt,
      } });
      await tx.threatResult.createMany({ data: [
        { scanId: scan.id, provider: "TEST_PROVIDER", status: "NO_MATCH", detected: false, retrievedAt },
        { scanId: scan.id, provider: "TEST_PROVIDER_2", status: "ERROR", retrievedAt },
      ] });
      const unknown = await tx.threatResult.create({ data: {
        scanId: scan.id, provider: "TEST_PROVIDER_3", retrievedAt,
      } });
      assert.equal(unknown.status, "UNKNOWN");
      assert.equal(unknown.detected, null);
      assert.equal(unknown.rawData, null);

      await tx.$executeRaw`SAVEPOINT contradictory_outcome`;
      await assert.rejects(tx.threatResult.create({ data: {
        scanId: scan.id, provider: "TEST_PROVIDER", status: "MATCH", detected: false, retrievedAt,
      } }));
      await tx.$executeRaw`ROLLBACK TO SAVEPOINT contradictory_outcome`;

      await tx.$executeRaw`SAVEPOINT unknown_detection`;
      await assert.rejects(tx.threatResult.create({ data: {
        scanId: scan.id, provider: "TEST_PROVIDER", status: "UNKNOWN", detected: true, retrievedAt,
      } }));
      await tx.$executeRaw`ROLLBACK TO SAVEPOINT unknown_detection`;

      const finding = await tx.finding.create({ data: {
        scanId: scan.id, type: "THREAT_PROVIDER_MATCH", severity: "HIGH",
        title: "Test threat match", description: "Synthetic evidence only.",
        source: "TEST_PROVIDER", evidenceReference: match.reference,
        evidence: { threatResultId: match.id, category: "PHISHING" },
        scoreContribution: 12,
      } });
      const informational = await tx.finding.create({ data: {
        scanId: scan.id, type: "LIMITED_EVIDENCE", severity: "LOW",
        title: "Unknown provider result", description: "The provider did not supply a verdict.",
        source: unknown.provider, evidence: { threatResultId: unknown.id },
      } });
      await tx.finding.create({ data: {
        scanId: scan.id, type: "TEST_TRUST_SIGNAL", severity: "LOW",
        title: "Test trust signal", description: "Synthetic score contribution.",
        source: "TEST_DOMAIN", evidenceReference: "test:domain-observation", scoreContribution: -5,
      } });
      assert.ok(finding.createdAt);
      assert.equal(finding.scoreContribution, 12);
      assert.equal(informational.scoreContribution, null);
      assert.equal(finding.evidenceReference, match.reference);
      assert.deepEqual(finding.evidence, { threatResultId: match.id, category: "PHISHING" });

      await tx.$executeRaw`SAVEPOINT missing_provenance`;
      await assert.rejects(tx.finding.create({ data: {
        scanId: scan.id, type: "TEST", severity: "LOW", title: "Test",
        description: "No supporting evidence", source: "TEST", evidence: {},
      } }));
      await tx.$executeRaw`ROLLBACK TO SAVEPOINT missing_provenance`;

      await tx.$executeRaw`SAVEPOINT blank_source`;
      await assert.rejects(tx.finding.create({ data: {
        scanId: scan.id, type: "TEST", severity: "LOW", title: "Test",
        description: "No source", source: " ", evidenceReference: "test:observation",
      } }));
      await tx.$executeRaw`ROLLBACK TO SAVEPOINT blank_source`;

      const saved = await tx.scan.findUniqueOrThrow({ where: { id: scan.id }, include: {
        threatResults: true, findings: true,
      } });
      assert.equal(saved.threatResults.length, 4);
      assert.equal(saved.findings.length, 3);
      assert.equal(saved.riskScore, null);
      assert.equal(saved.verdict, null);
      assert.deepEqual(saved.threatResults.find(({ id }) => id === match.id)?.retrievedAt, retrievedAt);

      await tx.$executeRaw`SAVEPOINT missing_threat_scan`;
      await assert.rejects(tx.threatResult.create({ data: {
        scanId: randomUUID(), provider: "TEST_PROVIDER", retrievedAt,
      } }), { code: "P2003" });
      await tx.$executeRaw`ROLLBACK TO SAVEPOINT missing_threat_scan`;
      await tx.$executeRaw`SAVEPOINT missing_finding_scan`;
      await assert.rejects(tx.finding.create({ data: {
        scanId: randomUUID(), type: "TEST", severity: "LOW", title: "Test",
        description: "Test", source: "TEST", evidenceReference: "test:evidence",
      } }), { code: "P2003" });
      await tx.$executeRaw`ROLLBACK TO SAVEPOINT missing_finding_scan`;

      await tx.scan.delete({ where: { id: scan.id } });
      assert.equal(await tx.threatResult.count({ where: { scanId: scan.id } }), 0);
      assert.equal(await tx.finding.count({ where: { scanId: scan.id } }), 0);
      throw rollback;
    }, { timeout: 30_000 }), (error: unknown) => error === rollback);
  } finally {
    await prisma.$disconnect();
  }
});
