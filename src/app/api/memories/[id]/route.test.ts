import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ user: vi.fn(), query: vi.fn() }));
vi.mock("@/lib/auth", () => ({ requireUser: mocks.user }));
vi.mock("@/lib/db", () => ({ db: { $queryRaw: mocks.query } }));
import { GET } from "./route";

const media = Uint8Array.from({ length: 20 }, (_, index) => index);
const params = () => ({ params: Promise.resolve({ id: "memory-1" }) });
const request = (range?: string) =>
  new Request("http://localhost/api/memories/memory-1", range ? { headers: { range } } : undefined);

function sql(strings: TemplateStringsArray) {
  return strings.join("?");
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.user.mockResolvedValue({ id: "user-1" });
  mocks.query.mockImplementation(async (strings: TemplateStringsArray, ...values: unknown[]) => {
    if (sql(strings).includes("octet_length")) return [{ mime: "video/mp4", size: media.length }];
    const [from, length] = values as [number, number];
    return [{ chunk: media.slice(from - 1, from - 1 + length) }];
  });
});

describe("memory media route", () => {
  it("checks family ownership and reads only the length first", async () => {
    await GET(request("bytes=0-1"), params());
    const [strings, ...values] = mocks.query.mock.calls[0];
    expect(sql(strings)).toContain('b."userId" = ?');
    expect(sql(strings)).toContain('octet_length(m."mediaData")');
    expect(values).toEqual(["memory-1", "user-1"]);
  });

  it("serves a 206 slice read with substring()", async () => {
    const response = await GET(request("bytes=4-7"), params());
    expect(response.status).toBe(206);
    expect(response.headers.get("Content-Range")).toBe("bytes 4-7/20");
    expect(response.headers.get("Content-Length")).toBe("4");
    expect(response.headers.get("Accept-Ranges")).toBe("bytes");
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect([...new Uint8Array(await response.arrayBuffer())]).toEqual([4, 5, 6, 7]);
    const read = mocks.query.mock.calls[1];
    expect(sql(read[0])).toContain("substring");
    expect(read.slice(1)).toEqual([5, 4, "memory-1"]);
  });

  it("serves the full file with 200 and answers 416 for unsatisfiable ranges", async () => {
    const full = await GET(request(), params());
    expect(full.status).toBe(200);
    expect(full.headers.get("Content-Length")).toBe("20");
    expect([...new Uint8Array(await full.arrayBuffer())]).toEqual([...media]);

    const outside = await GET(request("bytes=50-"), params());
    expect(outside.status).toBe(416);
    expect(outside.headers.get("Content-Range")).toBe("bytes */20");
  });

  it("returns 404 for missing, foreign or non-allowlisted media", async () => {
    mocks.query.mockResolvedValueOnce([]);
    expect((await GET(request(), params())).status).toBe(404);
    mocks.query.mockResolvedValueOnce([{ mime: "text/html", size: 20 }]);
    expect((await GET(request(), params())).status).toBe(404);
    mocks.query.mockResolvedValueOnce([{ mime: "image/jpeg", size: null }]);
    expect((await GET(request(), params())).status).toBe(404);
  });
});
