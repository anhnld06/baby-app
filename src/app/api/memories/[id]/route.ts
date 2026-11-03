import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const memory = await db.babyMemory.findFirst({ where: { id, baby: { userId: user.id } }, select: { mediaData: true, mediaMime: true } });
  if (!memory?.mediaData || !memory.mediaMime) return new Response(null, { status: 404 });
  const bytes = new Uint8Array(memory.mediaData);
  const headers = new Headers({ "Content-Type": memory.mediaMime, "Cache-Control": "private, no-store", "Accept-Ranges": "bytes" });
  const range = request.headers.get("range");
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    const start = match?.[1] ? Number(match[1]) : match?.[2] ? Math.max(0, bytes.length - Number(match[2])) : NaN;
    const end = match?.[1] && match[2] ? Math.min(Number(match[2]), bytes.length - 1) : bytes.length - 1;
    if (!Number.isSafeInteger(start) || start < 0 || start > end || start >= bytes.length) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${bytes.length}` } });
    headers.set("Content-Range", `bytes ${start}-${end}/${bytes.length}`);
    headers.set("Content-Length", String(end - start + 1));
    return new Response(bytes.slice(start, end + 1), { status: 206, headers });
  }
  headers.set("Content-Length", String(bytes.length));
  return new Response(bytes, { headers });
}
