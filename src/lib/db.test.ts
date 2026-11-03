import { afterEach, describe, expect, it, vi } from "vitest";

const runtime = vi.hoisted(() => ({ schema: "before-journal", created: 0 }));
vi.mock("@prisma/client", () => ({
  Prisma: {
    prismaVersion: { client: "test" },
    get dmmf() { return { datamodel: runtime.schema }; },
  },
  PrismaClient: class {
    instance = ++runtime.created;
    pregnancyJournalEntry = { findMany: vi.fn().mockResolvedValue([]) };
    $disconnect = vi.fn().mockResolvedValue(undefined);
  },
}));

const cache = globalThis as unknown as { prisma?: { $disconnect: ReturnType<typeof vi.fn> }; prismaSchema?: string };
afterEach(() => {
  delete cache.prisma;
  delete cache.prismaSchema;
  runtime.schema = "before-journal";
  vi.resetModules();
});

describe("Prisma during development hot reload", () => {
  it("reuses the pool across reloads when the generated schema has not changed", async () => {
    const first = (await import("./db")).db;
    vi.resetModules();
    expect((await import("./db")).db).toBe(first);
  });

  it("replaces a legacy global client missing the journal delegate", async () => {
    const legacy = { $disconnect: vi.fn().mockResolvedValue(undefined) };
    cache.prisma = legacy;
    const { db } = await import("./db");
    await expect(db.pregnancyJournalEntry.findMany()).resolves.toEqual([]);
    expect(legacy.$disconnect).toHaveBeenCalledOnce();
  });

  it("replaces the cached client after regenerating a different schema", async () => {
    const first = (await import("./db")).db;
    runtime.schema = "with-journal";
    vi.resetModules();
    const second = (await import("./db")).db;
    expect(second).not.toBe(first);
    expect(first.$disconnect).toHaveBeenCalledOnce();
  });
});
