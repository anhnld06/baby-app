import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ user: vi.fn() }));
vi.mock("@/lib/auth", () => ({ getCurrentUser: mocks.user }));

const fetchMock = vi.fn();
// The throttle and cache are module state, so each test gets a fresh copy of the route.
async function loadRoute() {
  vi.resetModules();
  return (await import("./route")).GET;
}
const url = (lat: number, lon: number) =>
  new Request(`http://localhost/api/location?latitude=${lat}&longitude=${lon}`);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-09T00:00:00Z"));
  mocks.user.mockReset();
  mocks.user.mockResolvedValue({ id: "user-1" });
  fetchMock.mockReset();
  fetchMock.mockImplementation(async () =>
    Response.json({ address: { suburb: "Phường Bến Nghé", city: "Hồ Chí Minh" } }),
  );
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("location API", () => {
  it("requires a session before contacting Nominatim", async () => {
    const GET = await loadRoute();
    mocks.user.mockResolvedValue(null);
    const response = await GET(url(10.7769, 106.7009));
    expect(response.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("caches rounded coordinates and keeps responses private", async () => {
    const GET = await loadRoute();
    const first = await GET(url(10.77691, 106.70091));
    expect(first.status).toBe(200);
    expect(first.headers.get("Cache-Control")).toMatch(/^private/);
    const { name } = (await first.json()) as { name: string | null };
    const second = await GET(url(10.77689, 106.70089));
    expect(await second.json()).toEqual({ name });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toContain("lat=10.777&lon=106.701");
  });

  it("throttles uncached lookups to one per second", async () => {
    const GET = await loadRoute();
    expect((await GET(url(10.1, 106.1))).status).toBe(200);
    const throttled = await GET(url(21, 105.8));
    expect(throttled.status).toBe(429);
    expect(throttled.headers.get("Retry-After")).toBe("1");
    vi.advanceTimersByTime(1_000);
    expect((await GET(url(21, 105.8))).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("rejects invalid coordinates and reports upstream failures", async () => {
    const GET = await loadRoute();
    expect((await GET(url(200, 0))).status).toBe(400);
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 503 }));
    expect((await GET(url(16, 108.2))).status).toBe(502);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
