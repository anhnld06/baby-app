import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ user: vi.fn(), baby: vi.fn(), create: vi.fn(), remove: vi.fn() }));
vi.mock("@/lib/auth", () => ({ requireUser: mocks.user }));
vi.mock("@/lib/db", () => ({ db: { baby: { findFirst: mocks.baby }, babyMemory: { create: mocks.create, deleteMany: mocks.remove } } }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
import { saveMemoryAction, deleteMemoryAction } from "./memory-actions";
function form(extra: Record<string, string> = {}) {
  const data = new FormData();
  Object.entries({ babyId: "baby-1", title: "Nụ cười đầu tiên", letter: "Con yêu!", frame: "blossom", occurredAt: "2026-01-01T08:00", ...extra }).forEach(([k,v]) => data.set(k,v));
  return data;
}
beforeEach(() => { vi.resetAllMocks(); mocks.user.mockResolvedValue({ id: "user-1", timezone: "Asia/Ho_Chi_Minh" }); mocks.baby.mockResolvedValue({ id: "baby-1" }); });
describe("private baby mailbox", () => {
  it("checks baby ownership before writing", async () => {
    mocks.baby.mockResolvedValue(null);
    expect(await saveMemoryAction({}, form())).toHaveProperty("error");
    expect(mocks.baby).toHaveBeenCalledWith({ where: { id: "baby-1", userId: "user-1" }, select: { id: true } });
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it("saves letter-only stamps using account timezone", async () => {
    expect(await saveMemoryAction({}, form())).toEqual({ saved: true });
    expect(mocks.create).toHaveBeenCalledWith({ data: expect.objectContaining({ babyId: "baby-1", occurredAt: new Date("2026-01-01T01:00Z"), mediaData: null }) });
  });
  it("rejects invalid dates, empty memories, unknown frames and disguised media", async () => {
    for (const extra of ([{ occurredAt: "2026-02-30T08:00" }, { occurredAt: "2099-01-01T08:00" }, { frame: "unknown" }, { letter: "" }] as Record<string, string>[])) expect(await saveMemoryAction({}, form(extra))).toHaveProperty("error");
    const data = form(); data.set("media", new File(["<svg>"], "fake.jpg", { type: "image/jpeg" }));
    expect(await saveMemoryAction({}, data)).toHaveProperty("error");
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it("scopes deletion to the authenticated family", async () => {
    await deleteMemoryAction(form({ id: "other-memory" }));
    expect(mocks.remove).toHaveBeenCalledWith({ where: { id: "other-memory", baby: { userId: "user-1" } } });
  });
});
