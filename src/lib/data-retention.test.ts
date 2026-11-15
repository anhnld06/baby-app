import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ deliveries: vi.fn(), receipts: vi.fn(), attempts: vi.fn() }));
vi.mock("@/lib/db", () => ({
  db: {
    reminderDelivery: { deleteMany: mocks.deliveries },
    offlineMutationReceipt: { deleteMany: mocks.receipts },
    loginAttempt: { deleteMany: mocks.attempts },
  },
}));
import { pruneExpiredRecords, releaseStaleReminderDeliveries } from "./data-retention";

const now = new Date("2026-11-09T00:00:00Z");

beforeEach(() => {
  vi.resetAllMocks();
  mocks.deliveries.mockResolvedValue({ count: 2 });
  mocks.receipts.mockResolvedValue({ count: 3 });
  mocks.attempts.mockResolvedValue({ count: 4 });
});

describe("data retention", () => {
  it("releases only unsent delivery claims older than 15 minutes", async () => {
    await expect(releaseStaleReminderDeliveries(now)).resolves.toBe(2);
    expect(mocks.deliveries).toHaveBeenCalledWith({
      where: { sentAt: null, createdAt: { lt: new Date("2026-11-08T23:45:00Z") } },
    });
  });
  it("prunes deliveries after 180 days, offline receipts after 60 days and login attempts after 1 day", async () => {
    await expect(pruneExpiredRecords(now)).resolves.toEqual({ deliveries: 2, offlineReceipts: 3, loginAttempts: 4 });
    expect(mocks.deliveries).toHaveBeenCalledWith({ where: { scheduledAt: { lt: new Date("2026-05-13T00:00:00Z") } } });
    expect(mocks.receipts).toHaveBeenCalledWith({ where: { createdAt: { lt: new Date("2026-09-10T00:00:00Z") } } });
    expect(mocks.attempts).toHaveBeenCalledWith({ where: { createdAt: { lt: new Date("2026-11-08T00:00:00Z") } } });
  });
});
