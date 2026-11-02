import { beforeEach, describe, it, expect, vi } from "vitest";
const mocks = vi.hoisted(() => ({ user: vi.fn(), page: vi.fn() }));
vi.mock("@/lib/auth", () => ({ getCurrentUser: mocks.user }));
vi.mock("@/features/knowledge/library-data", () => ({
  getLibraryPage: mocks.page,
}));
import { GET } from "./route";
beforeEach(() => vi.resetAllMocks());
describe("knowledge API", () => {
  it("authenticates before reading any catalog data", async () => {
    mocks.user.mockResolvedValue(null);
    const response = await GET(
      new Request("http://localhost/api/knowledge?stage=ALL"),
    );
    expect(response.status).toBe(401);
    expect(mocks.page).not.toHaveBeenCalled();
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  });
  it("validates filters and returns private paginated responses", async () => {
    mocks.user.mockResolvedValue({ id: "user" });
    mocks.page.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      totalPages: 1,
    });
    const response = await GET(
      new Request("http://localhost/api/knowledge?stage=oops&page=-4&q=du+sua"),
    );
    expect(mocks.page).toHaveBeenCalledWith({
      q: "du sua",
      stage: null,
      page: 1,
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  });
});
