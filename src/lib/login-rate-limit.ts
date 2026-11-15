import "server-only";

import { createHmac, randomInt } from "node:crypto";
import { db } from "@/lib/db";

export const LOGIN_WINDOW_MS = 15 * 60 * 1000;
export const MAX_FAILURES_PER_CLIENT = 5;
// Caps distributed guessing from many IPs; the family may be locked out for up to 15 minutes
// while an attack is ongoing, which is preferable to the shared password being guessed.
export const MAX_FAILURES_GLOBAL = 30;

type HeaderReader = Pick<Headers, "get">;

export function clientIp(headerList: HeaderReader) {
  const forwarded = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headerList.get("x-real-ip")?.trim() || "unknown";
}

// Keyed hash: an unsalted SHA-256 of an IPv4 address is trivially reversible.
export function loginAttemptKey(ip: string) {
  const secret = process.env.APP_PASSWORD ?? "";
  return createHmac("sha256", `login-attempt:${secret}`).update(ip).digest("hex");
}

export async function isLoginRateLimited(keyHash: string, now = new Date()) {
  const since = new Date(now.getTime() - LOGIN_WINDOW_MS);
  const [clientFailures, totalFailures] = await Promise.all([
    db.loginAttempt.count({ where: { keyHash, createdAt: { gte: since } } }),
    db.loginAttempt.count({ where: { createdAt: { gte: since } } }),
  ]);
  return clientFailures >= MAX_FAILURES_PER_CLIENT || totalFailures >= MAX_FAILURES_GLOBAL;
}

export async function recordLoginFailure(keyHash: string) {
  await db.loginAttempt.create({ data: { keyHash } });
}

export async function clearLoginFailures(keyHash: string) {
  await db.loginAttempt.deleteMany({ where: { keyHash } });
}

// Small random delay on failed/blocked attempts slows scripted guessing and blurs timing.
export function loginFailureDelay(minMs = 300, maxMs = 900) {
  return new Promise<void>((resolve) => setTimeout(resolve, randomInt(minMs, maxMs)));
}
