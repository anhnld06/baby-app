import { getCurrentUser } from "@/lib/auth";
import { formatLocality, type AddressParts } from "@/lib/location";

const DEFAULT_NOMINATIM_URL = "https://nominatim.openstreetmap.org";
// Nominatim's usage policy allows at most 1 request per second per application.
const UPSTREAM_INTERVAL_MS = 1_000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1_000;
const CACHE_MAX_ENTRIES = 500;

// Per-instance only (each serverless instance has its own copy); enough for a single-family app.
const cache = new Map<string, { name: string | null; expiresAt: number }>();
const inFlight = new Map<string, Promise<string | null>>();
let lastUpstreamAt = Number.NEGATIVE_INFINITY;

const privateHeaders = { "Cache-Control": "private, no-store" };

function coordinate(value: string | null, minimum: number, maximum: number) {
  if (value === null || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= minimum && parsed <= maximum ? parsed : null;
}

function cached(key: string, now: number) {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt <= now) {
    cache.delete(key);
    return undefined;
  }
  return entry.name;
}

function remember(key: string, name: string | null, now: number) {
  cache.delete(key);
  cache.set(key, { name, expiresAt: now + CACHE_TTL_MS });
  // Map preserves insertion order: drop the oldest entries first.
  while (cache.size > CACHE_MAX_ENTRIES) cache.delete(cache.keys().next().value!);
}

async function lookup(lat: string, lon: string) {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat,
    lon,
    zoom: "14",
    addressdetails: "1",
    layer: "address",
    "accept-language": "vi",
  });
  const baseUrl = (process.env.NOMINATIM_BASE_URL ?? DEFAULT_NOMINATIM_URL).replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/reverse?${params}`, {
    headers: {
      Accept: "application/json",
      "User-Agent": process.env.NOMINATIM_USER_AGENT ?? "VaniFamily/0.1",
    },
    next: { revalidate: 86_400 },
  });
  if (!response.ok) throw new Error(`Nominatim responded ${response.status}`);
  const data = (await response.json()) as { address?: AddressParts };
  return data.address ? formatLocality(data.address) : null;
}

export async function GET(request: Request) {
  if (!(await getCurrentUser())) {
    return Response.json({ error: "Cần đăng nhập để xem vị trí." }, { status: 401, headers: privateHeaders });
  }

  const searchParams = new URL(request.url).searchParams;
  const latitude = coordinate(searchParams.get("latitude"), -90, 90);
  const longitude = coordinate(searchParams.get("longitude"), -180, 180);

  if (latitude === null || longitude === null) {
    return Response.json({ error: "Invalid coordinates" }, { status: 400, headers: privateHeaders });
  }

  // Locality-level names do not need full GPS precision, and rounding improves cache reuse.
  const lat = latitude.toFixed(3);
  const lon = longitude.toFixed(3);
  const key = `${lat},${lon}`;
  const now = Date.now();
  const hit = cached(key, now);
  const okHeaders = { "Cache-Control": "private, max-age=3600" };
  if (hit !== undefined) return Response.json({ name: hit }, { headers: okHeaders });

  let pending = inFlight.get(key);
  if (!pending) {
    if (now - lastUpstreamAt < UPSTREAM_INTERVAL_MS) {
      return Response.json(
        { name: null, error: "Too many location lookups" },
        { status: 429, headers: { ...privateHeaders, "Retry-After": "1" } },
      );
    }
    lastUpstreamAt = now;
    pending = lookup(lat, lon).finally(() => inFlight.delete(key));
    inFlight.set(key, pending);
  }

  try {
    const name = await pending;
    remember(key, name, Date.now());
    return Response.json({ name }, { headers: okHeaders });
  } catch {
    return Response.json({ name: null }, { status: 502, headers: privateHeaders });
  }
}
