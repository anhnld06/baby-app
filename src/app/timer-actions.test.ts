import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  user: vi.fn(),
  baby: vi.fn(),
  find: vi.fn(),
  update: vi.fn(),
  createFeeding: vi.fn(),
  findSleep: vi.fn(),
  createSleep: vi.fn(),
  updateSleep: vi.fn(),
  redirect: vi.fn(),
  setCookie: vi.fn(),
}));
vi.mock("@/lib/auth", () => ({ requireUser: mocks.user }));
vi.mock("@/lib/db", () => ({
  db: {
    baby: { findFirst: mocks.baby },
    feeding: { findFirst: mocks.find, updateMany: mocks.update, create: mocks.createFeeding },
    sleepEntry: { findFirst: mocks.findSleep, create: mocks.createSleep, updateMany: mocks.updateSleep },
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: async () => ({ set: mocks.setCookie }) }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect, RedirectType: { replace: "replace" } }));
import {
  finishFeedingTimerAction,
  finishSleepTimerAction,
  startFeedingTimerAction,
  startSleepTimerAction,
} from "./timer-actions";

function uniqueViolation() {
  return new Prisma.PrismaClientKnownRequestError("Unique constraint failed", { code: "P2002", clientVersion: "6.12.0" });
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.user.mockResolvedValue({ id: "user-1", timezone: "Asia/Bangkok" });
  mocks.baby.mockResolvedValue({ id: "baby-1" });
  mocks.find.mockResolvedValue({ id: "feed-1" });
  mocks.update.mockResolvedValue({ count: 1 });
  mocks.findSleep.mockResolvedValue(null);
  mocks.updateSleep.mockResolvedValue({ count: 1 });
});

function form() {
  const data = new FormData();
  data.set("babyId", "baby-1");
  return data;
}

describe("finishing feeding timer", () => {
  it("saves the end time and opens that baby's feeding form without inventing a volume", async () => {
    await finishFeedingTimerAction(form());
    expect(mocks.baby).toHaveBeenCalledWith({ where: { id: "baby-1", userId: "user-1" }, select: { id: true } });
    expect(mocks.update).toHaveBeenCalledWith({ where: expect.objectContaining({ id: "feed-1", babyId: "baby-1", endTime: null }), data: { endTime: expect.any(Date) } });
    expect(mocks.setCookie).toHaveBeenCalledWith("selectedBabyId", "baby-1", expect.any(Object));
    expect(mocks.redirect).toHaveBeenCalledWith("/tracking/feeding?edit=feed-1", "replace");
  });
  it("does nothing when no active breastfeeding session exists", async () => {
    mocks.find.mockResolvedValue(null);
    await finishFeedingTimerAction(form());
    expect(mocks.update).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
  it("does not overwrite a session already finished on another device", async () => {
    mocks.update.mockResolvedValue({ count: 0 });
    await finishFeedingTimerAction(form());
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
  it("rejects another user's baby before accessing its feeding records", async () => {
    mocks.baby.mockResolvedValue(null);
    await expect(finishFeedingTimerAction(form())).rejects.toThrow("Baby not found");
    expect(mocks.find).not.toHaveBeenCalled();
  });
});

describe("starting timers from two phones", () => {
  it("creates a breastfeeding timer when none is running", async () => {
    mocks.find.mockResolvedValue(null);
    await startFeedingTimerAction(form());
    expect(mocks.createFeeding).toHaveBeenCalledWith({ data: { babyId: "baby-1", type: "BREASTFEEDING", startTime: expect.any(Date) } });
  });
  it("keeps the existing breastfeeding timer instead of creating a second one", async () => {
    await startFeedingTimerAction(form());
    expect(mocks.createFeeding).not.toHaveBeenCalled();
  });
  it("treats a concurrent feeding start (unique index conflict) as already running", async () => {
    mocks.find.mockResolvedValue(null);
    mocks.createFeeding.mockRejectedValue(uniqueViolation());
    await expect(startFeedingTimerAction(form())).resolves.toBeUndefined();
  });
  it("treats a concurrent sleep start (unique index conflict) as already running", async () => {
    mocks.createSleep.mockRejectedValue(uniqueViolation());
    await expect(startSleepTimerAction(form())).resolves.toBeUndefined();
    expect(mocks.createSleep).toHaveBeenCalledTimes(1);
  });
  it("still surfaces unrelated database errors", async () => {
    mocks.createSleep.mockRejectedValue(new Error("connection lost"));
    await expect(startSleepTimerAction(form())).rejects.toThrow("connection lost");
  });
  it("finishes only a sleep that is still open", async () => {
    mocks.findSleep.mockResolvedValue({ id: "sleep-1" });
    await finishSleepTimerAction(form());
    expect(mocks.updateSleep).toHaveBeenCalledWith({ where: { id: "sleep-1", endTime: null }, data: { endTime: expect.any(Date) } });
  });
});
