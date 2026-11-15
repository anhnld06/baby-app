import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { isAllowedPushEndpoint } from "@/lib/push-endpoint";

const subscriptionSchema = z.object({
  endpoint: z
    .string()
    .url()
    .max(4096)
    .refine(isAllowedPushEndpoint, "Dịch vụ thông báo không được hỗ trợ"),
  keys: z.object({
    p256dh: z.string().min(1).max(1024),
    auth: z.string().min(1).max(1024),
  }),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  return Response.json({
    configured: Boolean(
      publicKey &&
      process.env.VAPID_PRIVATE_KEY &&
      process.env.VAPID_SUBJECT,
    ),
    // Public by design; the service worker needs it to re-subscribe on pushsubscriptionchange.
    publicKey: publicKey ?? null,
  });
}

// Upsert by endpoint: re-posting the same subscription (renewal on page load,
// pushsubscriptionchange in the service worker) is idempotent.
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = subscriptionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Subscription không hợp lệ" }, { status: 400 });
  }
  await db.pushSubscription.upsert({
    where: { endpoint: parsed.data.endpoint },
    create: {
      userId: user.id,
      endpoint: parsed.data.endpoint,
      p256dh: parsed.data.keys.p256dh,
      auth: parsed.data.keys.auth,
    },
    update: {
      userId: user.id,
      p256dh: parsed.data.keys.p256dh,
      auth: parsed.data.keys.auth,
    },
  });
  return Response.json({ ok: true });
}

// Deletes only the given endpoint of the current user (this device), never
// the subscriptions of other devices on the shared account.
export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = z.object({ endpoint: z.string().url().max(4096) }).safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) return Response.json({ error: "Endpoint không hợp lệ" }, { status: 400 });
  await db.pushSubscription.deleteMany({
    where: { userId: user.id, endpoint: parsed.data.endpoint },
  });
  return Response.json({ ok: true });
}
