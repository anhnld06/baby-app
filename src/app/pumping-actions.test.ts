import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  user: vi.fn(), mother: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn(), redirect: vi.fn(), find: vi.fn(), createMany: vi.fn(),
}));
vi.mock("@/lib/auth", () => ({ requireUser: mocks.user }));
vi.mock("@/lib/db", () => ({ db: {
  mother: { findUnique: mocks.mother },
  pumpingEntry: { findFirst: mocks.find, createMany: mocks.createMany, create: mocks.create, updateMany: mocks.update, deleteMany: mocks.remove },
} }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect, RedirectType: { replace: "replace" } }));
import { deletePumpingAction, savePumpingAction, startPumpingTimerAction, finishPumpingTimerAction } from "./pumping-actions";

function form(values: Record<string, string>) {
  const result = new FormData();
  Object.entries(values).forEach(([key, value]) => result.set(key, value));
  return result;
}
const entry = { startTime: "2026-01-02T00:15", leftAmountMl: "25" };

beforeEach(() => {
  vi.resetAllMocks();
  mocks.user.mockResolvedValue({ id: "user-1", timezone: "Asia/Ho_Chi_Minh" });
  mocks.mother.mockResolvedValue({ id: "mother-1" });
  mocks.update.mockResolvedValue({ count: 1 });
});

describe("pumping actions", () => {
  it("uses the signed-in mother's profile and converts local times", async () => {
    await savePumpingAction(form({ ...entry, motherId: "someone-else" }));
    expect(mocks.create).toHaveBeenCalledWith({ data: expect.objectContaining({ motherId: "mother-1", startTime: new Date("2026-01-01T17:15:00Z"), leftAmountMl: 25 }) });
  });
  it("clears optional fields when editing and scopes the update to the mother", async () => {
    await savePumpingAction(form({ ...entry, id: "entry-1", notes: "", rightAmountMl: "", durationMinutes: "" }));
    expect(mocks.update).toHaveBeenCalledWith({ where: { id: "entry-1", motherId: "mother-1", isRunning: false }, data: expect.objectContaining({ rightAmountMl: null, durationMinutes: null, notes: null }) });
  });
  it("rejects missing profiles and entries outside the mother's ownership", async () => {
    mocks.mother.mockResolvedValueOnce(null);
    await expect(savePumpingAction(form(entry))).rejects.toThrow("Mother not found");
    expect(mocks.create).not.toHaveBeenCalled();
    mocks.update.mockResolvedValueOnce({ count: 0 });
    await expect(savePumpingAction(form({ ...entry, id: "foreign-entry" }))).rejects.toThrow("Pumping entry not found");
  });
  it("only deletes entries owned by the signed-in user", async () => {
    await deletePumpingAction(form({ id: "entry-1" }));
    expect(mocks.remove).toHaveBeenCalledWith({ where: { id: "entry-1", mother: { userId: "user-1" } } });
  });
});


describe("pumping timer", () => {
  it("starts with a database guard against duplicate active sessions", async () => {
    await startPumpingTimerAction();
    expect(mocks.createMany).toHaveBeenCalledWith({ data: [{ motherId: "mother-1", startTime: expect.any(Date), isRunning: true }], skipDuplicates: true });
  });
  it("finishes the owned active session and opens its volume form", async () => {
    mocks.find.mockResolvedValue({ id: "timer-1", startTime: new Date(Date.now() - 20 * 60_000) });
    await finishPumpingTimerAction(form({ id: "timer-1" }));
    expect(mocks.find).toHaveBeenCalledWith({ where: { id: "timer-1", isRunning: true, mother: { userId: "user-1" } } });
    expect(mocks.update).toHaveBeenCalledWith({ where: { id: "timer-1", isRunning: true, mother: { userId: "user-1" } }, data: { isRunning: false, durationMinutes: 20 } });
    expect(mocks.redirect).toHaveBeenCalledWith("/mother/pumping?edit=timer-1", "replace");
  });
  it("ignores stale stops and entries not owned by the user", async () => {
    mocks.find.mockResolvedValue(null);
    await finishPumpingTimerAction(form({ id: "foreign-timer" }));
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it("does not overwrite a timer that another device already stopped", async () => {
    mocks.find.mockResolvedValue({ id: "timer-1", startTime: new Date() });
    mocks.update.mockResolvedValue({ count: 0 });
    await finishPumpingTimerAction(form({ id: "timer-1" }));
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
});
