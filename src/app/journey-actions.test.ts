import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  user: vi.fn(),
  baby: vi.fn(),
  settings: vi.fn(),
  reads: vi.fn(),
  update: vi.fn(),
  create: vi.fn(),
  remove: vi.fn(),
  wake: vi.fn(),
  redirect: vi.fn(),
}));
vi.mock("@/lib/auth", () => ({ requireUser: mocks.user }));
vi.mock("@/lib/db", () => ({
  db: {
    baby: { findFirst: mocks.baby },
    babyRoutineSettings: { upsert: mocks.settings },
    notificationRead: { createMany: mocks.reads },
    babyCareEntry: {
      updateMany: mocks.update,
      create: mocks.create,
      deleteMany: mocks.remove,
    },
    sleepEntry: { updateMany: mocks.wake },
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
import {
  saveRoutineSettingsAction,
  saveEpisodeAction,
  endEpisodeAction,
  deleteEpisodeAction,
  wakeBabyAction,
  markNotificationsReadAction,
} from "./journey-actions";
const form = (values: Record<string, string>) => {
  const f = new FormData();
  for (const [key, value] of Object.entries(values)) f.set(key, value);
  return f;
};
beforeEach(() => {
  vi.resetAllMocks();
  mocks.user.mockResolvedValue({ id: "user-1", timezone: "Asia/Ho_Chi_Minh" });
  mocks.baby.mockResolvedValue({ id: "baby-1" });
  mocks.update.mockResolvedValue({ count: 1 });
  mocks.wake.mockResolvedValue({ count: 1 });
});
describe("journey actions", () => {
  const routine = {
    babyId: "baby-1",
    method: "AUTO",
    dayStart: "06:30",
    dayEnd: "19:00",
    feedingMinutes: "25",
    awakeMinutes: "35",
    sleepMinutes: "120",
    adaptToLogs: "on",
  };
  it("scopes routine settings to an owned baby and validates the daily interval", async () => {
    await saveRoutineSettingsAction(form(routine));
    expect(mocks.settings).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { babyId: "baby-1" },
        update: expect.objectContaining({ adaptToLogs: true }),
      }),
    );
    await expect(
      saveRoutineSettingsAction(form({ ...routine, dayEnd: "05:00" })),
    ).rejects.toThrow();
    mocks.baby.mockResolvedValueOnce(null);
    await expect(saveRoutineSettingsAction(form(routine))).rejects.toThrow(
      "Không tìm thấy",
    );
  });
  it("stores observed episodes without generating an end date", async () => {
    await saveEpisodeAction(
      form({
        babyId: "baby-1",
        title: "Đợt quấy khóc",
        occurredAt: "2026-01-01T08:30",
      }),
    );
    expect(mocks.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        babyId: "baby-1",
        kind: "EPISODE",
        occurredAt: new Date("2026-01-01T01:30Z"),
        expectedEndAt: null,
        endedAt: null,
      }),
    });
    await expect(
      saveEpisodeAction(
        form({
          babyId: "baby-1",
          title: "Đợt quấy khóc",
          occurredAt: "2026-02-31T08:30",
        }),
      ),
    ).rejects.toThrow("Thời điểm");
  });
  it("rejects foreign episode edits and invalid actual time ordering", async () => {
    mocks.update.mockResolvedValueOnce({ count: 0 });
    await expect(
      saveEpisodeAction(
        form({
          babyId: "baby-1",
          id: "foreign",
          title: "Thay đổi giấc ngủ",
          occurredAt: "2026-01-01T08:30",
        }),
      ),
    ).rejects.toThrow("Không tìm thấy");
    await expect(
      saveEpisodeAction(
        form({
          babyId: "baby-1",
          title: "Thay đổi giấc ngủ",
          occurredAt: "2026-01-02T08:30",
          endedAt: "2026-01-01T08:30",
        }),
      ),
    ).rejects.toThrow("Ngày kết thúc");
    await endEpisodeAction(form({ id: "episode" }));
    expect(mocks.update).toHaveBeenLastCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: "episode",
          baby: { userId: "user-1" },
          kind: "EPISODE",
          endedAt: null,
        }),
      }),
    );
    await deleteEpisodeAction(form({ id: "episode" }));
    expect(mocks.remove).toHaveBeenCalledWith({
      where: { id: "episode", baby: { userId: "user-1" }, kind: "EPISODE" },
    });
  });
  it("ends real sleep on waking or stores a standalone wake, under ownership checks", async () => {
    await wakeBabyAction(form({ babyId: "baby-1" }));
    expect(mocks.wake).toHaveBeenCalledWith({
      where: { babyId: "baby-1", endTime: null },
      data: { endTime: expect.any(Date) },
    });
    expect(mocks.create).not.toHaveBeenCalled();
    mocks.wake.mockResolvedValueOnce({ count: 0 });
    await wakeBabyAction(form({ babyId: "baby-1" }));
    expect(mocks.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ kind: "WAKE", babyId: "baby-1" }),
    });
  });
  it("persists read state for this user only and deduplicates keys", async () => {
    const f = form({ key: "stage:baby-1:1" });
    f.append("key", "stage:baby-1:1");
    await markNotificationsReadAction(f);
    expect(mocks.reads).toHaveBeenCalledWith({
      data: [{ userId: "user-1", key: "stage:baby-1:1" }],
      skipDuplicates: true,
    });
  });
});
