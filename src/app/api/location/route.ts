import { formatLocality, type AddressParts } from "@/lib/location";

const DEFAULT_NOMINATIM_URL = "https://nominatim.openstreetmap.org";

function coordinate(value: string | null, minimum: number, maximum: number) {
  if (value === null || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= minimum && parsed <= maximum ? parsed : null;
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const latitude = coordinate(searchParams.get("latitude"), -90, 90);
  const longitude = coordinate(searchParams.get("longitude"), -180, 180);

  if (latitude === null || longitude === null) {
    return Response.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  // Locality-level names do not need full GPS precision, and rounding improves cache reuse.
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: latitude.toFixed(3),
    lon: longitude.toFixed(3),
    zoom: "14",
    addressdetails: "1",
    layer: "address",
    "accept-language": "vi",
  });
  const baseUrl = (process.env.NOMINATIM_BASE_URL ?? DEFAULT_NOMINATIM_URL).replace(/\/$/, "");

  try {
    const response = await fetch(`${baseUrl}/reverse?${params}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": process.env.NOMINATIM_USER_AGENT ?? "VaniFamily/0.1",
      },
      next: { revalidate: 86_400 },
    });

    if (!response.ok) {
      return Response.json({ name: null }, { status: 502 });
    }

    const data = (await response.json()) as { address?: AddressParts };
    return Response.json(
      { name: data.address ? formatLocality(data.address) : null },
      { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } },
    );
  } catch {
    return Response.json({ name: null }, { status: 502 });
  }
}
