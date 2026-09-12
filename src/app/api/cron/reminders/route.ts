import webpush from "web-push";
import { Prisma } from "@prisma/client";
import { listUserReminders } from "@/features/reminders/candidates";
import { remindersDueForPush } from "@/features/reminders/push";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function statusCode(error: unknown) {
  return typeof error === "object" && error !== null && "statusCode" in error
    ? Number(error.statusCode)
    : undefined;
}

export async function GET(request: Request) {
  if (
    !process.env.CRON_SECRET ||
    request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;
  if (!publicKey || !privateKey || !subject) {
    return Response.json({ error: "VAPID chưa được cấu hình" }, { status: 503 });
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);

  const now = new Date();
  const users = await db.user.findMany({
    where: { pushSubscriptions: { some: {} } },
    select: { id: true, timezone: true, pushSubscriptions: true },
  });
  let sent = 0;
  let removed = 0;

  for (const user of users) {
    const candidates = remindersDueForPush(
      await listUserReminders(user.id, user.timezone, now),
      user.timezone,
      now,
    );
    for (const subscription of user.pushSubscriptions) {
      for (const reminder of candidates) {
        let delivery;
        try {
          delivery = await db.reminderDelivery.create({
            data: {
              subscriptionId: subscription.id,
              reminderKey: reminder.deliveryKey,
              scheduledAt: now,
            },
          });
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") continue;
          throw error;
        }
        try {
          const body = reminder.daysBefore === 0
            ? "Bạn có một lịch cần kiểm tra hôm nay."
            : `Bạn có một lịch cần kiểm tra sau ${reminder.daysBefore} ngày.`;
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: { p256dh: subscription.p256dh, auth: subscription.auth },
            },
            JSON.stringify({
              title: "Nhắc lịch từ Vani Family",
              body,
              url: "/vaccination-schedule",
              tag: reminder.deliveryKey,
            }),
            { TTL: 86_400 },
          );
          await db.reminderDelivery.update({
            where: { id: delivery.id },
            data: { sentAt: new Date() },
          });
          sent += 1;
        } catch (error) {
          const code = statusCode(error);
          if (code === 404 || code === 410) {
            await db.pushSubscription.delete({ where: { id: subscription.id } });
            removed += 1;
            break;
          }
          await db.reminderDelivery.deleteMany({ where: { id: delivery.id } });
        }
      }
    }
  }
  return Response.json({ sent, removed, checkedUsers: users.length });
}
