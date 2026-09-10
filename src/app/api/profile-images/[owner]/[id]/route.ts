import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ owner: string; id: string }> },
) {
  const [user, { owner, id }] = await Promise.all([getCurrentUser(), params]);
  if (!user) return new Response(null, { status: 401 });

  const image = owner === "mother"
    ? await db.motherProfileCover.findFirst({
        where: { motherId: id, mother: { userId: user.id } },
        select: { data: true, mimeType: true },
      })
    : owner === "baby"
      ? await db.babyProfileCover.findFirst({
          where: { babyId: id, baby: { userId: user.id } },
          select: { data: true, mimeType: true },
        })
      : null;

  if (!image) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(image.data), {
    headers: {
      "Cache-Control": "private, max-age=31536000, immutable",
      "Content-Type": image.mimeType,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
