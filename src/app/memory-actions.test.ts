import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ user: vi.fn(), baby: vi.fn(), create: vi.fn(), remove: vi.fn(), update: vi.fn() }));
vi.mock("@/lib/auth", () => ({ requireUser: mocks.user }));
vi.mock("@/lib/db", () => ({ db: { baby: { findFirst: mocks.baby }, babyMemory: { create: mocks.create, deleteMany: mocks.remove, updateMany: mocks.update } } }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
import { saveMemoryAction, deleteMemoryAction, updateMemoryMilestoneAction } from "./memory-actions";
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
  it("rejects media above 4 MB before reading it and stores valid media with its type", async () => {
    const big = form(); const file = new File([new Uint8Array(4_000_001)], "big.mp4", { type: "video/mp4" });
    const read = vi.spyOn(file, "arrayBuffer"); big.set("media", file);
    expect(await saveMemoryAction({}, big)).toEqual({ error: "Tệp tối đa 4 MB. Hãy chọn ảnh nhỏ hơn hoặc video ngắn hơn." });
    expect(read).not.toHaveBeenCalled();
    const ok = form(); ok.set("media", new File([new Uint8Array([255,216,255,224])], "photo.jpg", { type: "image/jpeg" }));
    expect(await saveMemoryAction({}, ok)).toEqual({ saved: true });
    expect(mocks.create).toHaveBeenCalledWith({ data: expect.objectContaining({ mediaMime: "image/jpeg", mediaData: new Uint8Array([255,216,255,224]) }) });
  });
  it("accepts the compressed photos the composer sends and untyped uploads with a valid signature", async () => {
    const jpeg = new Uint8Array(1_400_000); jpeg.set([255,216,255,224]);
    const compressed = form(); compressed.set("media", new File([jpeg], "IMG_0001.jpg", { type: "image/jpeg" }));
    expect(await saveMemoryAction({}, compressed)).toEqual({ saved: true });
    const untyped = form(); untyped.set("media", new File([new Uint8Array([137,80,78,71,13,10,26,10,0])], "photo", { type: "" }));
    expect(await saveMemoryAction({}, untyped)).toEqual({ saved: true });
    expect(mocks.create).toHaveBeenLastCalledWith({ data: expect.objectContaining({ mediaMime: "image/png" }) });
    const fake = form(); fake.set("media", new File(["<html>"], "page", { type: "" }));
    expect(await saveMemoryAction({}, fake)).toHaveProperty("error");
    const heic = form(); heic.set("media", new File(["\0\0\0\x18ftypheic"], "IMG.HEIC", { type: "image/heic" }));
    expect(await saveMemoryAction({}, heic)).toHaveProperty("error");
    expect(mocks.create).toHaveBeenCalledTimes(2);
  });
  it("accepts datetime values with seconds from mobile pickers and allows small clock skew", async () => {
    expect(await saveMemoryAction({}, form({ occurredAt: "2026-01-01T08:00:00" }))).toEqual({ saved: true });
    expect(mocks.create).toHaveBeenLastCalledWith({ data: expect.objectContaining({ occurredAt: new Date("2026-01-01T01:00Z") }) });
    vi.useFakeTimers({ now: new Date("2026-01-01T01:00:30Z"), toFake: ["Date"] });
    try {
      expect(await saveMemoryAction({}, form({ occurredAt: "2026-01-01T08:03" }))).toEqual({ saved: true });
      expect(await saveMemoryAction({}, form({ occurredAt: "2026-01-01T08:30" }))).toHaveProperty("error");
    } finally { vi.useRealTimers(); }
  });
  it("returns a visible error instead of throwing when the database write fails", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.create.mockRejectedValue(new Error("connection reset"));
    expect(await saveMemoryAction({}, form())).toEqual({ error: expect.stringContaining("Chưa lưu được thư") });
    log.mockRestore();
  });
  it("scopes deletion to the authenticated family", async () => {
    await deleteMemoryAction(form({ id: "other-memory" }));
    expect(mocks.remove).toHaveBeenCalledWith({ where: { id: "other-memory", baby: { userId: "user-1" } } });
  });
});

describe("milestone tags", () => {
  it("stores a tag with the letter without recording an achieved milestone", async () => {
    expect(await saveMemoryAction({}, form({ milestoneKey: "roll" }))).toEqual({ saved: true });
    expect(mocks.create).toHaveBeenCalledWith({ data: expect.objectContaining({ milestoneKey: "roll" }) });
  });
  it("rejects unknown milestone keys before writing", async () => {
    expect(await saveMemoryAction({}, form({ milestoneKey: "fake" }))).toHaveProperty("error");
    await expect(updateMemoryMilestoneAction(form({ id: "memory", milestoneKey: "fake" }))).rejects.toThrow();
    expect(mocks.create).not.toHaveBeenCalled(); expect(mocks.update).not.toHaveBeenCalled();
  });
  it("scopes updates and tag removal to the family", async () => {
    await updateMemoryMilestoneAction(form({ id: "memory", milestoneKey: "smile" }));
    expect(mocks.update).toHaveBeenLastCalledWith({ where: { id: "memory", baby: { userId: "user-1" } }, data: { milestoneKey: "smile" } });
    await updateMemoryMilestoneAction(form({ id: "memory", milestoneKey: "" }));
    expect(mocks.update).toHaveBeenLastCalledWith({ where: { id: "memory", baby: { userId: "user-1" } }, data: { milestoneKey: null } });
  });
});
