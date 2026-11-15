import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ count: vi.fn(), create: vi.fn(), deleteMany: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({
  db: { loginAttempt: { count: mocks.count, create: mocks.create, deleteMany: mocks.deleteMany } },
}));
import {
  LOGIN_WINDOW_MS,
  clearLoginFailures,
  clientIp,
  isLoginRateLimited,
  loginAttemptKey,
  recordLoginFailure,
} from "./login-rate-limit";

function counts(client: number, total: number) {
  mocks.count.mockImplementation(async ({ where }: { where: { keyHash?: string } }) => (where.keyHash ? client : total));
}

beforeEach(() => {
  vi.resetAllMocks();
  process.env.APP_PASSWORD = "secret";
});

describe("client identification", () => {
  it("uses the first x-forwarded-for address, then x-real-ip", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": " 203.0.113.5 , 10.0.0.1", "x-real-ip": "198.51.100.2" }))).toBe("203.0.113.5");
    expect(clientIp(new Headers({ "x-real-ip": "198.51.100.2" }))).toBe("198.51.100.2");
    expect(clientIp(new Headers())).toBe("unknown");
  });
  it("stores a keyed hash instead of the raw IP", () => {
    const key = loginAttemptKey("203.0.113.5");
    expect(key).toMatch(/^[0-9a-f]{64}$/);
    expect(key).not.toContain("203.0.113.5");
    expect(loginAttemptKey("203.0.113.5")).toBe(key);
    expect(loginAttemptKey("203.0.113.6")).not.toBe(key);
  });
});

describe("login rate limit", () => {
  it("allows attempts below both limits", async () => {
    counts(4, 29);
    await expect(isLoginRateLimited("key")).resolves.toBe(false);
  });
  it("blocks after 5 failures from the same client", async () => {
    counts(5, 5);
    await expect(isLoginRateLimited("key")).resolves.toBe(true);
  });
  it("blocks every client after 30 failures in total", async () => {
    counts(0, 30);
    await expect(isLoginRateLimited("key")).resolves.toBe(true);
  });
  it("only counts failures inside the 15 minute window", async () => {
    counts(0, 0);
    const now = new Date("2026-11-09T10:00:00Z");
    await isLoginRateLimited("key", now);
    const since = new Date(now.getTime() - LOGIN_WINDOW_MS);
    expect(mocks.count).toHaveBeenCalledWith({ where: { keyHash: "key", createdAt: { gte: since } } });
    expect(mocks.count).toHaveBeenCalledWith({ where: { createdAt: { gte: since } } });
  });
  it("records and clears failures for one client", async () => {
    await recordLoginFailure("key");
    await clearLoginFailures("key");
    expect(mocks.create).toHaveBeenCalledWith({ data: { keyHash: "key" } });
    expect(mocks.deleteMany).toHaveBeenCalledWith({ where: { keyHash: "key" } });
  });
});
