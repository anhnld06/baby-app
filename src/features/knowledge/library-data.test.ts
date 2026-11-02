import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
const mocks = vi.hoisted(() => ({ find: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({
  db: { knowledgeArticle: { findMany: mocks.find } },
}));
beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
});
afterEach(() => {
  vi.restoreAllMocks();
});
describe("editorial catalog cache", () => {
  it("coalesces simultaneous loads and refreshes after its bounded TTL", async () => {
    const clock = vi.spyOn(Date, "now").mockReturnValue(1000);
    mocks.find.mockResolvedValue([]);
    const { getLibraryIndex } = await import("./library-data");
    await Promise.all([getLibraryIndex(), getLibraryIndex()]);
    await getLibraryIndex();
    expect(mocks.find).toHaveBeenCalledTimes(1);
    clock.mockReturnValue(62000);
    await getLibraryIndex();
    expect(mocks.find).toHaveBeenCalledTimes(2);
    expect(mocks.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { NOT: { slug: { startsWith: "demo-" } } },
        select: expect.not.objectContaining({ content: true }),
      }),
    );
  });
  it("retries after failure instead of retaining a rejected promise", async () => {
    mocks.find
      .mockRejectedValueOnce(new Error("db unavailable"))
      .mockResolvedValueOnce([]);
    const { getLibraryIndex } = await import("./library-data");
    await expect(getLibraryIndex()).rejects.toThrow("db unavailable");
    await expect(getLibraryIndex()).resolves.toEqual([]);
    expect(mocks.find).toHaveBeenCalledTimes(2);
  });
});
