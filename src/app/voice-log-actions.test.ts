import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  user: vi.fn(),
  baby: vi.fn(),
  findFeeding: vi.fn(),
  createFeeding: vi.fn(),
  updateFeeding: vi.fn(),
  findSleep: vi.fn(),
  createSleep: vi.fn(),
  updateSleep: vi.fn(),
}));
vi.mock("@/lib/auth", () => ({ requireUser: mocks.user }));
vi.mock("@/lib/db", () => ({
  db: {
    baby: { findFirst: mocks.baby },
    feeding: { findFirst: mocks.findFeeding, create: mocks.createFeeding, updateMany: mocks.updateFeeding },
    sleepEntry: { findFirst: mocks.findSleep, create: mocks.createSleep, updateMany: mocks.updateSleep },
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
import { saveVoiceLogAction } from "./voice-log-actions";

const idle = { status: "idle", message: "" } as const;

function uniqueViolation() {
  return new Prisma.PrismaClientKnownRequestError("Unique constraint failed", { code: "P2002", clientVersion: "6.12.0" });
}

function form(values: Record<string, string>) {
  const data = new FormData();
  data.set("babyId", "baby-1");
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

const sleepStart = { kind: "sleep", operation: "start", type: "NAP", startTime: "2026-11-09T10:00" };
const feedingStart = { kind: "feeding", operation: "start", type: "BREASTFEEDING", startTime: "2026-11-09T10:00" };

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  mocks.user.mockResolvedValue({ id: "user-1", timezone: "Asia/Bangkok" });
  mocks.baby.mockResolvedValue({ id: "baby-1" });
  mocks.findFeeding.mockResolvedValue(null);
  mocks.findSleep.mockResolvedValue(null);
  mocks.updateFeeding.mockResolvedValue({ count: 1 });
  mocks.updateSleep.mockResolvedValue({ count: 1 });
});

describe("voice start with a timer already running", () => {
  it("starts a sleep when none is open", async () => {
    const result = await saveVoiceLogAction(idle, form(sleepStart));
    expect(result.status).toBe("success");
    expect(mocks.createSleep).toHaveBeenCalledWith({
      data: { babyId: "baby-1", startTime: expect.any(Date), endTime: undefined, type: "NAP" },
    });
  });
  it("does not create a second open sleep", async () => {
    mocks.findSleep.mockResolvedValue({ id: "sleep-1" });
    const result = await saveVoiceLogAction(idle, form(sleepStart));
    expect(result).toEqual({ status: "error", message: expect.stringContaining("giấc ngủ chưa kết thúc") });
    expect(mocks.createSleep).not.toHaveBeenCalled();
  });
  it("reports a concurrent sleep start from the other phone as already running", async () => {
    mocks.createSleep.mockRejectedValue(uniqueViolation());
    const result = await saveVoiceLogAction(idle, form(sleepStart));
    expect(result.message).toContain("giấc ngủ chưa kết thúc");
  });
  it("still logs a completed sleep while another sleep is open", async () => {
    mocks.findSleep.mockResolvedValue({ id: "sleep-1" });
    const result = await saveVoiceLogAction(idle, form({ ...sleepStart, operation: "complete", endTime: "2026-11-09T11:00" }));
    expect(result.status).toBe("success");
    expect(mocks.createSleep).toHaveBeenCalled();
  });
  it("does not create a second running breastfeeding timer", async () => {
    mocks.findFeeding.mockResolvedValue({ id: "feed-1" });
    const result = await saveVoiceLogAction(idle, form(feedingStart));
    expect(result.message).toContain("cữ bú mẹ chưa kết thúc");
    expect(mocks.createFeeding).not.toHaveBeenCalled();
  });
  it("reports a concurrent breastfeeding start as already running", async () => {
    mocks.createFeeding.mockRejectedValue(uniqueViolation());
    const result = await saveVoiceLogAction(idle, form(feedingStart));
    expect(result.message).toContain("cữ bú mẹ chưa kết thúc");
  });
  it("logs a bottle feed without checking for a running breastfeeding timer", async () => {
    const result = await saveVoiceLogAction(idle, form({ ...feedingStart, type: "FORMULA", amountMl: "90" }));
    expect(result.status).toBe("success");
    expect(mocks.findFeeding).not.toHaveBeenCalled();
    expect(mocks.createFeeding).toHaveBeenCalled();
  });
});

describe("voice finish", () => {
  it("does not overwrite a sleep already finished on the other phone", async () => {
    mocks.findSleep.mockResolvedValue({ id: "sleep-1", startTime: new Date("2026-11-09T02:00:00Z") });
    mocks.updateSleep.mockResolvedValue({ count: 0 });
    const result = await saveVoiceLogAction(idle, form({ kind: "sleep", operation: "finish", type: "NAP", endTime: "2026-11-09T11:00" }));
    expect(mocks.updateSleep).toHaveBeenCalledWith({ where: { id: "sleep-1", endTime: null }, data: { endTime: expect.any(Date) } });
    expect(result.status).toBe("error");
  });
});
