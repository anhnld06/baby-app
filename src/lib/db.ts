import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaSchema?: string;
};

// Fast Refresh preserves globalThis even after regenerating Prisma Client.
// Reuse a connection pool only when it belongs to the current generated schema.
const schema = JSON.stringify([Prisma.prismaVersion.client, Prisma.dmmf.datamodel]);
const cached = globalForPrisma.prisma;
const compatible = cached && globalForPrisma.prismaSchema === schema;

export const db = compatible ? cached : new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
  globalForPrisma.prismaSchema = schema;
  if (cached && cached !== db) void cached.$disconnect().catch(() => undefined);
}
