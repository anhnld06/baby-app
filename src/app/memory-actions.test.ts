import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ user: vi.fn(), baby: vi.fn(), create: vi.fn(), remove: vi.fn(), update: vi.fn(), find: vi.fn(), storage: { configured: vi.fn(), presign: vi.fn(), head: vi.fn(), read: vi.fn(), remove: vi.fn() } }));
vi.mock("@/lib/auth", () => ({ requireUser: mocks.user }));
vi.mock("@/lib/db", () => ({ db: { baby: { findFirst: mocks.baby }, babyMemory: { create: mocks.create, deleteMany: mocks.remove, updateMany: mocks.update, findFirst: mocks.find } } }));
vi.mock("@/lib/object-storage", () => ({ objectStorageConfigured: mocks.storage.configured, presignUpload: mocks.storage.presign, headObject: mocks.storage.head, readObjectStart: mocks.storage.read, deleteObject: mocks.storage.remove }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
import { saveMemoryAction, deleteMemoryAction, prepareMemoryUploadAction, updateMemoryMilestoneAction } from "./memory-actions";
function form(extra: Record<string, string> = {}) {
  const data = new FormData();
  Object.entries({ babyId: "baby-1", title: "Nụ cười đầu tiên", letter: "Con yêu!", frame: "blossom", occurredAt: "2026-01-01T08:00", ...extra }).forEach(([k,v]) => data.set(k,v));
  return data;
}
beforeEach(() => { vi.resetAllMocks(); mocks.user.mockResolvedValue({ id: "user-1", timezone: "Asia/Ho_Chi_Minh" }); mocks.baby.mockResolvedValue({ id: "baby-1" }); mocks.storage.configured.mockReturnValue(false); mocks.storage.remove.mockResolvedValue(undefined); mocks.find.mockResolvedValue(null); });
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
    expect(mocks.find).toHaveBeenCalledWith({ where: { id: "other-memory", baby: { userId: "user-1" } }, select: { mediaKey: true } });
    expect(mocks.remove).toHaveBeenCalledWith({ where: { id: "other-memory", baby: { userId: "user-1" } } });
    expect(mocks.storage.remove).not.toHaveBeenCalled();
  });
  it("deletes the stored file only after the letter row", async () => {
    mocks.find.mockResolvedValue({ mediaKey: KEY });
    await deleteMemoryAction(form({ id: "memory-1" }));
    expect(mocks.storage.remove).toHaveBeenCalledWith(KEY);
    expect(mocks.remove.mock.invocationCallOrder[0]).toBeLessThan(mocks.storage.remove.mock.invocationCallOrder[0]);
  });
});

const KEY = "memories/baby-1/abcdefghijklmnopqrstuvwx.mp4";
const MP4_START = new Uint8Array([0, 0, 0, 0x18, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d, 0, 0, 0, 0]);

describe("direct uploads to object storage", () => {
  beforeEach(() => {
    mocks.storage.configured.mockReturnValue(true);
    mocks.storage.presign.mockResolvedValue({ url: "https://storage.example/presigned", headers: { "Content-Type": "video/mp4" } });
    mocks.storage.head.mockResolvedValue({ size: 30_000_000, contentType: "video/mp4" });
    mocks.storage.read.mockResolvedValue(MP4_START);
  });

  it("falls back to inline uploads when object storage is not configured", async () => {
    mocks.storage.configured.mockReturnValue(false);
    expect(await prepareMemoryUploadAction("baby-1", "video/mp4", 3_000_000)).toEqual({ mode: "inline" });
    expect(mocks.storage.presign).not.toHaveBeenCalled();
  });

  it("signs a 30 MB video under the baby's prefix and refuses foreign babies, bad types and videos above 50 MB", async () => {
    const ticket = await prepareMemoryUploadAction("baby-1", "video/mp4", 30_000_000);
    expect(ticket).toMatchObject({ mode: "direct", url: "https://storage.example/presigned" });
    const key = (ticket as { key: string }).key;
    expect(key).toMatch(/^memories\/baby-1\/[A-Za-z0-9_-]{24}\.mp4$/);
    expect(mocks.storage.presign).toHaveBeenCalledWith(key, "video/mp4", 30_000_000);
    expect(await prepareMemoryUploadAction("baby-1", "video/mp4", 50_000_001)).toEqual({ error: expect.stringContaining("50 MB") });
    expect(await prepareMemoryUploadAction("baby-1", "text/html", 100)).toHaveProperty("error");
    expect(await prepareMemoryUploadAction("baby-1", "image/jpeg", 10_000_001)).toHaveProperty("error");
    mocks.baby.mockResolvedValue(null);
    expect(await prepareMemoryUploadAction("baby-2", "video/mp4", 1000)).toHaveProperty("error");
    expect(mocks.storage.presign).toHaveBeenCalledTimes(1);
  });

  it("saves a verified upload by key without media bytes in the database", async () => {
    expect(await saveMemoryAction({}, form({ mediaKey: KEY }))).toEqual({ saved: true });
    expect(mocks.storage.read).toHaveBeenCalledWith(KEY, 16);
    expect(mocks.create).toHaveBeenCalledWith({ data: expect.objectContaining({ mediaKey: KEY, mediaMime: "video/mp4", mediaSize: 30_000_000, mediaData: null }) });
    expect(mocks.storage.remove).not.toHaveBeenCalled();
  });

  it("rejects and removes uploads that are missing, disguised or too large", async () => {
    mocks.storage.read.mockResolvedValueOnce(new TextEncoder().encode("<html><body>....."));
    expect(await saveMemoryAction({}, form({ mediaKey: KEY }))).toHaveProperty("error");
    mocks.storage.head.mockResolvedValueOnce({ size: 60_000_000, contentType: "video/mp4" });
    expect(await saveMemoryAction({}, form({ mediaKey: KEY }))).toEqual({ error: expect.stringContaining("50 MB") });
    mocks.storage.head.mockResolvedValueOnce({ size: 1000, contentType: "text/html" });
    expect(await saveMemoryAction({}, form({ mediaKey: KEY }))).toHaveProperty("error");
    mocks.storage.head.mockResolvedValueOnce(null);
    expect(await saveMemoryAction({}, form({ mediaKey: KEY }))).toHaveProperty("error");
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.storage.remove).toHaveBeenCalledTimes(4);
  });

  it("never accepts or deletes a key belonging to another baby or already used by a letter", async () => {
    expect(await saveMemoryAction({}, form({ mediaKey: "memories/baby-2/abcdefghijklmnopqrstuvwx.mp4" }))).toHaveProperty("error");
    expect(await saveMemoryAction({}, form({ mediaKey: "memories/baby-1/../baby-2/abcdefghijklmnop.mp4" }))).toHaveProperty("error");
    expect(mocks.storage.head).not.toHaveBeenCalled();
    mocks.find.mockResolvedValue({ id: "existing" });
    mocks.create.mockRejectedValueOnce(new Error("Unique constraint failed on mediaKey"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await saveMemoryAction({}, form({ mediaKey: KEY }))).toHaveProperty("error");
    log.mockRestore();
    expect(mocks.storage.remove).not.toHaveBeenCalled();
  });

  it("removes the upload when the letter itself is invalid", async () => {
    expect(await saveMemoryAction({}, form({ mediaKey: KEY, title: "" }))).toHaveProperty("error");
    expect(mocks.storage.remove).toHaveBeenCalledWith(KEY);
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
