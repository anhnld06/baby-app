import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { isMemoryMediaType } from "@/features/mailbox/memories";
import { byteRangeStream, parseByteRange } from "@/features/mailbox/media-range";

type MediaInfo = { mime: string | null; size: number | null };

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  // Ownership and length only: never load the bytea here (iOS issues many Range requests per video).
  const [info] = await db.$queryRaw<MediaInfo[]>`
    SELECT m."mediaMime" AS mime, octet_length(m."mediaData")::int AS size
    FROM "BabyMemory" m
    JOIN "Baby" b ON b."id" = m."babyId"
    WHERE m."id" = ${id} AND b."userId" = ${user.id}
    LIMIT 1`;
  const size = info?.size == null ? null : Number(info.size);
  if (!info?.mime || size === null || !Number.isSafeInteger(size)) return new Response(null, { status: 404 });
  // Only serve types we accept on upload, so stored content can never be rendered as HTML/SVG.
  if (!isMemoryMediaType(info.mime)) return new Response(null, { status: 404 });

  const headers = new Headers({ "Content-Type": info.mime, "Cache-Control": "private, no-store", "Accept-Ranges": "bytes" });
  const range = parseByteRange(request.headers.get("range"), size);
  if (range === "unsatisfiable") {
    headers.set("Content-Range", `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }
  const start = range?.start ?? 0;
  const end = range?.end ?? size - 1;
  headers.set("Content-Length", String(end - start + 1));
  if (range) headers.set("Content-Range", `bytes ${start}-${end}/${size}`);

  const read = async (offset: number, length: number) => {
    // Postgres substring() on bytea is 1-based.
    const [row] = await db.$queryRaw<{ chunk: Uint8Array | null }[]>`
      SELECT substring("mediaData" from ${offset + 1}::int for ${length}::int) AS chunk
      FROM "BabyMemory"
      WHERE "id" = ${id}`;
    return row?.chunk ? new Uint8Array(row.chunk) : new Uint8Array();
  };
  return new Response(byteRangeStream(read, start, end), { status: range ? 206 : 200, headers });
}
