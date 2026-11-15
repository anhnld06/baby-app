import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ user: vi.fn(), transaction: vi.fn(), findReceipt: vi.fn() }));
vi.mock("@/lib/auth", () => ({ getCurrentUser: mocks.user }));
vi.mock("@/lib/db", () => ({
  db: { $transaction: mocks.transaction, offlineMutationReceipt: { findUnique: mocks.findReceipt } },
}));
import { POST } from "./route";

const mutation = {
  id: "5f0c6a8e-0d3b-4c5e-9a43-3f2f6f1c8b11",
  type: "CREATE_SLEEP",
  payload: { babyId: "baby-1", startTime: "2026-11-09T10:00", type: "NAP" },
  createdAt: "2026-11-09T03:00:00.000Z",
  attempts: 0,
};

function request() {
  return new Request("http://localhost/api/offline/sync", { method: "POST", body: JSON.stringify(mutation) });
}

function uniqueViolation() {
  return new Prisma.PrismaClientKnownRequestError("Unique constraint failed", { code: "P2002", clientVersion: "6.12.0" });
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.user.mockResolvedValue({ id: "user-1", timezone: "Asia/Bangkok" });
});

describe("offline sync conflicts", () => {
  it("answers a concurrent duplicate mutation like the idempotent path", async () => {
    mocks.transaction.mockRejectedValue(uniqueViolation());
    mocks.findReceipt.mockResolvedValue({ id: mutation.id, userId: "user-1", resultId: "sleep-1" });
    const response = await POST(request());
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, resultId: "sleep-1", duplicate: true });
  });
  it("refuses a receipt that belongs to another account", async () => {
    mocks.transaction.mockRejectedValue(uniqueViolation());
    mocks.findReceipt.mockResolvedValue({ id: mutation.id, userId: "user-2", resultId: "sleep-1" });
    expect((await POST(request())).status).toBe(403);
  });
  it("reports a conflict with an already running sleep instead of a server error", async () => {
    mocks.transaction.mockRejectedValue(uniqueViolation());
    mocks.findReceipt.mockResolvedValue(null);
    const response = await POST(request());
    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({ error: expect.stringContaining("giấc ngủ chưa kết thúc") });
  });
  it("keeps returning 500 for unexpected failures", async () => {
    mocks.transaction.mockRejectedValue(new Error("connection lost"));
    expect((await POST(request())).status).toBe(500);
  });
});
