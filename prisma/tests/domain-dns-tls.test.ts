import "dotenv/config";

import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";

import { prisma } from "../../src/lib/db/prisma";

test("domain snapshots are reused without changing historical evidence", async () => {
  assert.notEqual(process.env.NODE_ENV, "production");
  const rollback = new Error("Rollback evidence test fixtures");
  const domain = `${randomUUID()}.test`;
  const retrievedAt = new Date("2026-09-22T10:00:00Z");
  const source = "TEST_RDAP";

  try {
    await assert.rejects(prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name: "Evidence test", email: `${randomUUID()}@example.test` },
      });
      const data = {
        user: { connect: { id: user.id } },
        submittedUrl: `https://${domain}/`,
        normalizedUrl: `https://${domain}/`,
        normalizedDomain: domain,
        hostname: domain,
        domainProfile: {
          connectOrCreate: {
            where: { normalizedDomain_source_retrievedAt: { normalizedDomain: domain, source, retrievedAt } },
            create: { normalizedDomain: domain, source, retrievedAt, registrar: "Original registrar" },
          },
        },
      };
      const first = await tx.scan.create({ data });
      const second = await tx.scan.create({ data });
      const third = await tx.scan.create({ data });
      assert.ok(first.domainProfileId);
      assert.equal(first.domainProfileId, second.domainProfileId);
      assert.equal(await tx.domainProfile.count({ where: { normalizedDomain: domain } }), 1);

      const dns = await tx.dnsResult.create({ data: {
        scanId: first.id, recordType: "A", value: "192.0.2.1", ttl: 300,
        source: "TEST_DNS", retrievedAt,
      } });
      const tls = await tx.tlsResult.create({ data: {
        scanId: first.id, valid: true, hostnameMatches: true,
        issuer: "Test issuer", subject: domain, sanEntries: [domain], errors: [],
        validFrom: new Date("2026-01-01T00:00:00Z"),
        validTo: new Date("2027-01-01T00:00:00Z"),
        source: "TEST_TLS", retrievedAt,
      } });
      const evidence = await tx.scan.findUniqueOrThrow({
        where: { id: first.id }, include: { domainProfile: true, dnsResults: true, tlsResult: true },
      });
      assert.equal(evidence.domainProfile?.source, source);
      assert.deepEqual(evidence.domainProfile?.retrievedAt, retrievedAt);
      assert.equal(evidence.dnsResults[0]?.id, dns.id);
      assert.equal(evidence.dnsResults[0]?.source, "TEST_DNS");
      assert.deepEqual(evidence.dnsResults[0]?.retrievedAt, retrievedAt);
      assert.equal(evidence.tlsResult?.id, tls.id);
      assert.equal(evidence.tlsResult?.source, "TEST_TLS");
      assert.deepEqual(evidence.tlsResult?.retrievedAt, retrievedAt);

      const refreshed = await tx.domainProfile.create({ data: {
        normalizedDomain: domain, source, registrar: "New registrar",
        retrievedAt: new Date("2026-09-22T11:00:00Z"),
      } });
      await tx.scan.update({ where: { id: second.id }, data: { domainProfileId: refreshed.id } });
      assert.equal((await tx.domainProfile.findUniqueOrThrow({ where: { id: first.domainProfileId } })).registrar, "Original registrar");
      const latest = await tx.domainProfile.findFirstOrThrow({
        where: { normalizedDomain: domain, source, retrievedAt: { gte: retrievedAt } },
        orderBy: { retrievedAt: "desc" },
      });
      assert.equal(latest.id, refreshed.id);

      await tx.$executeRaw`SAVEPOINT duplicate_snapshot`;
      await assert.rejects(tx.domainProfile.create({ data: { normalizedDomain: domain, source, retrievedAt } }), { code: "P2002" });
      await tx.$executeRaw`ROLLBACK TO SAVEPOINT duplicate_snapshot`;

      await tx.$executeRaw`SAVEPOINT referenced_profile`;
      await assert.rejects(tx.domainProfile.delete({ where: { id: refreshed.id } }), { code: "P2003" });
      await tx.$executeRaw`ROLLBACK TO SAVEPOINT referenced_profile`;

      await tx.$executeRaw`SAVEPOINT invalid_scan`;
      await assert.rejects(tx.dnsResult.create({ data: {
        scanId: randomUUID(), recordType: "A", value: "192.0.2.2", source: "TEST_DNS", retrievedAt,
      } }), { code: "P2003" });
      await tx.$executeRaw`ROLLBACK TO SAVEPOINT invalid_scan`;

      await tx.$executeRaw`SAVEPOINT duplicate_tls`;
      await assert.rejects(tx.tlsResult.create({ data: {
        scanId: first.id, valid: false, source: "TEST_TLS", retrievedAt,
      } }), { code: "P2002" });
      await tx.$executeRaw`ROLLBACK TO SAVEPOINT duplicate_tls`;

      // Deleting a scan removes its private observations, not shared snapshots.
      await tx.scan.delete({ where: { id: first.id } });
      assert.equal(await tx.dnsResult.count({ where: { scanId: first.id } }), 0);
      assert.equal(await tx.tlsResult.count({ where: { scanId: first.id } }), 0);
      assert.equal(await tx.domainProfile.count({ where: { normalizedDomain: domain } }), 2);
      assert.equal((await tx.scan.findUniqueOrThrow({ where: { id: second.id } })).domainProfileId, refreshed.id);
      assert.equal((await tx.scan.findUniqueOrThrow({ where: { id: third.id } })).domainProfileId, first.domainProfileId);
      throw rollback;
    }, { timeout: 30_000 }), (error: unknown) => error === rollback);
  } finally {
    await prisma.$disconnect();
  }
});
