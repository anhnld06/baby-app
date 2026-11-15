import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  limited: vi.fn(),
  record: vi.fn(),
  clear: vi.fn(),
  delay: vi.fn(),
  upsert: vi.fn(),
  createSession: vi.fn(),
  deleteAllSessions: vi.fn(),
  requireUser: vi.fn(),
  redirect: vi.fn(),
}));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ "x-forwarded-for": "203.0.113.5" }) }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect, RedirectType: { replace: "replace" } }));
vi.mock("@/lib/auth", () => ({
  createSession: mocks.createSession,
  deleteSession: vi.fn(),
  deleteAllSessions: mocks.deleteAllSessions,
  requireUser: mocks.requireUser,
}));
vi.mock("@/lib/db", () => ({ db: { user: { upsert: mocks.upsert } } }));
vi.mock("@/lib/login-rate-limit", () => ({
  clientIp: (headerList: Headers) => headerList.get("x-forwarded-for"),
  loginAttemptKey: (ip: string) => `hash:${ip}`,
  isLoginRateLimited: mocks.limited,
  recordLoginFailure: mocks.record,
  clearLoginFailures: mocks.clear,
  loginFailureDelay: mocks.delay,
}));
import { loginAction, logoutAllDevicesAction } from "./auth-actions";

function form(username: string, password: string) {
  const data = new FormData();
  data.set("username", username);
  data.set("password", password);
  return data;
}

beforeEach(() => {
  vi.resetAllMocks();
  process.env.APP_USERNAME = "family";
  process.env.APP_PASSWORD = "correct-horse";
  mocks.limited.mockResolvedValue(false);
  mocks.upsert.mockResolvedValue({ id: "user-1" });
  mocks.requireUser.mockResolvedValue({ id: "user-1" });
});

describe("loginAction rate limiting", () => {
  it("records a failure with a delay for a wrong password", async () => {
    const result = await loginAction(undefined, form("family", "wrong"));
    expect(result).toEqual({ error: "Tên đăng nhập hoặc mật khẩu không đúng." });
    expect(mocks.record).toHaveBeenCalledWith("hash:203.0.113.5");
    expect(mocks.delay).toHaveBeenCalled();
    expect(mocks.createSession).not.toHaveBeenCalled();
  });
  it("refuses without checking the password while limited", async () => {
    mocks.limited.mockResolvedValue(true);
    const result = await loginAction(undefined, form("family", "correct-horse"));
    expect(result?.error).toContain("Thử lại sau ít phút");
    expect(mocks.record).not.toHaveBeenCalled();
    expect(mocks.createSession).not.toHaveBeenCalled();
  });
  it("clears this client's failures after a successful login", async () => {
    await loginAction(undefined, form("Family", "correct-horse"));
    expect(mocks.clear).toHaveBeenCalledWith("hash:203.0.113.5");
    expect(mocks.createSession).toHaveBeenCalledWith("user-1");
    expect(mocks.redirect).toHaveBeenCalledWith("/", "replace");
    expect(mocks.delay).not.toHaveBeenCalled();
  });
});

describe("logoutAllDevicesAction", () => {
  it("deletes every session of the signed-in account", async () => {
    await logoutAllDevicesAction();
    expect(mocks.deleteAllSessions).toHaveBeenCalledWith("user-1");
    expect(mocks.redirect).toHaveBeenCalledWith("/login", "replace");
  });
});
