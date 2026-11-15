import { db } from "@/lib/db";

const DAY_MS = 24 * 60 * 60 * 1000;

export const STALE_DELIVERY_MS = 15 * 60 * 1000;
export const RETENTION = {
  reminderDeliveryDays: 180,
  offlineReceiptDays: 60,
  loginAttemptDays: 1,
} as const;

function ago(now: Date, ms: number) {
  return new Date(now.getTime() - ms);
}

// A delivery row is claimed before the push is sent. If the function times out in between, the row
// stays without sentAt and the unique (subscriptionId, reminderKey) would block every retry; release
// such claims once they are clearly abandoned.
export async function releaseStaleReminderDeliveries(now = new Date()) {
  const { count } = await db.reminderDelivery.deleteMany({
    where: { sentAt: null, createdAt: { lt: ago(now, STALE_DELIVERY_MS) } },
  });
  return count;
}

// NotificationRead is deliberately not pruned: keys such as `episode:<id>` or
// `sleep-stage:<babyId>:3-6` stay valid indefinitely and would reappear as unread.
export async function pruneExpiredRecords(now = new Date()) {
  const [deliveries, offlineReceipts, loginAttempts] = await Promise.all([
    db.reminderDelivery.deleteMany({
      where: { scheduledAt: { lt: ago(now, RETENTION.reminderDeliveryDays * DAY_MS) } },
    }),
    db.offlineMutationReceipt.deleteMany({
      where: { createdAt: { lt: ago(now, RETENTION.offlineReceiptDays * DAY_MS) } },
    }),
    db.loginAttempt.deleteMany({
      where: { createdAt: { lt: ago(now, RETENTION.loginAttemptDays * DAY_MS) } },
    }),
  ]);
  return {
    deliveries: deliveries.count,
    offlineReceipts: offlineReceipts.count,
    loginAttempts: loginAttempts.count,
  };
}
