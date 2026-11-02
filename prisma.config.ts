import { defineConfig } from "prisma/config";

// Local PostgreSQL needs no pooler; hosted migrations use the direct Neon URL.
process.env.DATABASE_URL_UNPOOLED ??= process.env.DATABASE_URL;

export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
});
