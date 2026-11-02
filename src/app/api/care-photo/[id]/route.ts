import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireUser();
  const { id } = await params;
  const entry = await db.babyCareEntry.findFirst({
    where: { id, baby: { userId: user.id } },
    select: { photoData: true, photoMime: true },
  });
  if (!entry?.photoData || !entry.photoMime)
    return new Response(null, { status: 404 });
  return new Response(new Uint8Array(entry.photoData), {
    headers: {
      "Content-Type": entry.photoMime,
      "Cache-Control": "private, no-store",
    },
  });
}
