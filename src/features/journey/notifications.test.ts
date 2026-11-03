import { beforeEach, describe, it, expect, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  baby: vi.fn(),
  appointments: vi.fn(),
  episode: vi.fn(),
  reads: vi.fn(),
  medications: vi.fn(),
}));
vi.mock("@/lib/db", () => ({
  db: {
    baby: { findFirst: mocks.baby },
    vaccinationAppointment: { findMany: mocks.appointments },
    babyCareEntry: { findFirst: mocks.episode },
    medicationSchedule: { findMany: mocks.medications },
    notificationRead: { findMany: mocks.reads },
  },
}));
import { getJourneyNotifications } from "./notifications";
beforeEach(() => {
  vi.resetAllMocks();
  mocks.baby.mockResolvedValue(null);
  mocks.appointments.mockResolvedValue([]);
  mocks.episode.mockResolvedValue(null);
  mocks.reads.mockResolvedValue([]);
  mocks.medications.mockResolvedValue([]);
});
describe("in-app notifications", () => {
  it("keeps read state user-scoped and changes appointment keys when the date changes", async () => {
    const appointment = {
      id: "a",
      vaccineName: "Vắc-xin",
      scheduledAt: new Date("2026-11-03"),
      baby: { id: "baby-1", name: "Bé" },
      mother: null,
    };
    mocks.appointments.mockResolvedValue([appointment]);
    mocks.reads.mockResolvedValue([{ key: "appointment:a:2026-11-03" }]);
    const items = await getJourneyNotifications(
      "user-1",
      "Asia/Ho_Chi_Minh",
      null,
    );
    expect(items[0].read).toBe(true);
    expect(items[0].href).toBe("/vaccination-schedule?owner=baby&baby=baby-1");
    expect(mocks.appointments).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { baby: { userId: "user-1" } },
            { mother: { userId: "user-1" } },
          ],
          vaccinationRecordId: null,
          motherVaccinationRecordId: null,
        }),
      }),
    );
    expect(mocks.reads).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user-1", key: { in: ["appointment:a:2026-11-03"] } },
      }),
    );
    mocks.appointments.mockResolvedValue([
      { ...appointment, scheduledAt: new Date("2026-11-04") },
    ]);
    const changed = await getJourneyNotifications(
      "user-1",
      "Asia/Ho_Chi_Minh",
      null,
    );
    expect(changed[0].read).toBe(false);
  });
  it("uses a real episode for ongoing alerts and never invents a crisis from age", async () => {
    mocks.baby.mockResolvedValue({
      id: "baby",
      name: "Bé",
      dateOfBirth: new Date("2026-07-01"),
    });
    const items = await getJourneyNotifications(
      "user-1",
      "Asia/Ho_Chi_Minh",
      "baby",
    );
    expect(items.some((i) => i.key.startsWith("stage:baby:"))).toBe(true);
    expect(items.some((i) => i.key.startsWith("episode:"))).toBe(false);
    mocks.episode.mockResolvedValue({
      id: "e",
      title: "Đợt quấy khóc",
      occurredAt: new Date("2026-10-31"),
    });
    const active = await getJourneyNotifications(
      "user-1",
      "Asia/Ho_Chi_Minh",
      "baby",
    );
    expect(active[0].key).toBe("episode:e");
    expect(mocks.baby).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "baby", userId: "user-1" } }),
    );
  });
});
