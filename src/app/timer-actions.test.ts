import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ user: vi.fn(), baby: vi.fn(), find: vi.fn(), update: vi.fn(), redirect: vi.fn(), setCookie: vi.fn() }));
vi.mock("@/lib/auth", () => ({ requireUser: mocks.user }));
vi.mock("@/lib/db", () => ({ db: { baby: { findFirst: mocks.baby }, feeding: { findFirst: mocks.find, updateMany: mocks.update } } }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: async () => ({ set: mocks.setCookie }) }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect, RedirectType: { replace: "replace" } }));
import { finishFeedingTimerAction } from "./timer-actions";

beforeEach(() => {
  vi.resetAllMocks();
  mocks.user.mockResolvedValue({ id: "user-1" });
  mocks.baby.mockResolvedValue({ id: "baby-1" });
  mocks.find.mockResolvedValue({ id: "feed-1" });
  mocks.update.mockResolvedValue({ count: 1 });
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
