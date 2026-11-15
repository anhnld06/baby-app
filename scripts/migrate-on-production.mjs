// Runs `prisma migrate deploy` only for Vercel production builds.
// Preview deployments (other branches) must never change the production database.
// If a migration fails, the build fails and Vercel keeps serving the previous deployment.
import { spawnSync } from "node:child_process";

const environment = process.env.VERCEL_ENV;

if (environment !== "production") {
  console.log(`[migrate] VERCEL_ENV=${environment ?? "(unset)"}: skipping prisma migrate deploy.`);
  process.exit(0);
}

if (!process.env.DATABASE_URL) {
  console.error("[migrate] DATABASE_URL is missing; refusing to build production without migrations.");
  process.exit(1);
}

console.log("[migrate] Production build: applying pending Prisma migrations…");
const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
process.exit(result.status ?? 1);
