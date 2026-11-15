import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  prune: vi.fn(),
  release: vi.fn(),
  send: vi.fn(),
  dueForPush: vi.fn(),
  users: vi.fn(),
  schedules: vi.fn(),
  deliveryCreate: vi.fn(),
  deliveryUpdate: vi.fn(),
  subscriptionDeleteMany: vi.fn(),
}));
vi.mock("web-push", () => ({ default: { setVapidDetails: vi.fn(), sendNotification: mocks.send } }));
vi.mock("@/features/reminders/candidates", () => ({ listUserReminders: vi.fn() }));
vi.mock("@/features/reminders/push", () => ({ remindersDueForPush: mocks.dueForPush }));
vi.mock("@/lib/db", () => ({
  db: {
    user: { findMany: mocks.users },
    medicationSchedule: { findMany: mocks.schedules },
    reminderDelivery: { create: mocks.deliveryCreate, update: mocks.deliveryUpdate, deleteMany: vi.fn() },
    pushSubscription: { delete: vi.fn(), deleteMany: mocks.subscriptionDeleteMany },
  },
}));
vi.mock("@/lib/data-retention", () => ({
  pruneExpiredRecords: mocks.prune,
  releaseStaleReminderDeliveries: mocks.release,
}));
import { GET } from "./route";

function request(authorization?: string) {
  return new Request("http://localhost/api/cron/reminders", {
    headers: authorization ? { authorization } : {},
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  process.env.CRON_SECRET = "cron-secret";
  delete process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  mocks.prune.mockResolvedValue({ deliveries: 0, offlineReceipts: 0, loginAttempts: 0 });
});

describe("reminder cron", () => {
  it("rejects a missing or wrong secret", async () => {
    expect((await GET(request())).status).toBe(401);
    expect((await GET(request("Bearer wrong"))).status).toBe(401);
    expect(mocks.prune).not.toHaveBeenCalled();
  });
  it("rejects every request when CRON_SECRET is not configured", async () => {
    delete process.env.CRON_SECRET;
    expect((await GET(request("Bearer "))).status).toBe(401);
  });
  it("prunes old records even when push is not configured", async () => {
    const response = await GET(request("Bearer cron-secret"));
    expect(response.status).toBe(503);
    expect(mocks.prune).toHaveBeenCalledTimes(1);
  });
  it("deletes stored subscriptions whose endpoint is not a known push service", async () => {
    Object.assign(process.env, {
      NEXT_PUBLIC_VAPID_PUBLIC_KEY: "public",
      VAPID_PRIVATE_KEY: "private",
      VAPID_SUBJECT: "mailto:test@example.com",
    });
    const subscription = (id: string, endpoint: string) => ({ id, endpoint, p256dh: "p", auth: "a" });
    mocks.users.mockResolvedValue([
      { id: "u-1", timezone: "Asia/Ho_Chi_Minh", pushSubscriptions: [
        subscription("bad", "https://169.254.169.254/latest"),
        subscription("good", "https://fcm.googleapis.com/fcm/send/abc"),
      ] },
      { id: "u-2", timezone: "Asia/Ho_Chi_Minh", pushSubscriptions: [subscription("internal", "http://localhost:3000/x")] },
    ]);
    mocks.schedules.mockResolvedValue([]);
    mocks.dueForPush.mockReturnValue([{ uid: "vaccine-1", deliveryKey: "vaccine-1:0", daysBefore: 0, url: "/vaccination-schedule" }]);
    mocks.deliveryCreate.mockResolvedValue({ id: "d-1" });

    const response = await GET(request("Bearer cron-secret"));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ sent: 1, removed: 2 });
    expect(mocks.subscriptionDeleteMany).toHaveBeenCalledWith({ where: { id: "bad" } });
    expect(mocks.subscriptionDeleteMany).toHaveBeenCalledWith({ where: { id: "internal" } });
    expect(mocks.send).toHaveBeenCalledTimes(1);
    expect(mocks.send.mock.calls[0][0]).toMatchObject({ endpoint: "https://fcm.googleapis.com/fcm/send/abc" });
    expect(mocks.schedules).toHaveBeenCalledTimes(1);
  });
});
