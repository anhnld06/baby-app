import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ findUnique: vi.fn(), upsert: vi.fn(), deleteMany: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({ db: { growthEntry: { findUnique: mocks.findUnique }, growthAssessment: { upsert: mocks.upsert, deleteMany: mocks.deleteMany } } }));
import { growthAgeInDays, whoSex, refreshWhoGrowthAssessment, whoEntryInput } from "./who-anthro";
const entry = {
  id: "growth-1", measuredAt: new Date("2026-01-11T12:00:00Z"), weightKg: 3.5, heightCm: 51, headCircumferenceCm: 35, measurementPosition: "RECUMBENT",
  baby: { gender: "MALE", dateOfBirth: new Date("2026-01-01T00:00:00Z"), gestationalAgeAtBirth: 40 },
};
beforeEach(() => { vi.clearAllMocks(); mocks.findUnique.mockResolvedValue(entry); mocks.upsert.mockResolvedValue({}); mocks.deleteMany.mockResolvedValue({ count: 0 }); });
describe("WHO Anthro input and persistence", () => {
  it("uses age at measurement and does not clamp pre-birth measurements to zero", () => {
    expect(growthAgeInDays(entry.baby.dateOfBirth, new Date("2026-01-11T23:59:00Z"))).toBe(10);
    expect(growthAgeInDays(entry.baby.dateOfBirth, new Date("2025-12-31"))).toBe(-1);
  });
  it("maps only supported sex references", () => {
    expect(whoSex("MALE")).toBe("1"); expect(whoSex("FEMALE")).toBe("2"); expect(whoSex("UNDISCLOSED")).toBeNull();
  });
  it("calculates and upserts locally without any network request", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    expect(await refreshWhoGrowthAssessment(entry.id)).toEqual({ status: "calculated" });
    expect(fetchSpy).not.toHaveBeenCalled(); fetchSpy.mockRestore();
    expect(mocks.upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { growthEntryId: entry.id },
      create: expect.objectContaining({ growthEntryId: entry.id, standard: "WHO_2006", engineVersion: expect.stringContaining("local-lms"), weightAgeZ: expect.any(Number) }),
      update: expect.objectContaining({ computedAt: expect.any(Date), headAgeZ: expect.any(Number) }),
    }));
  });
  it("returns missing without trying to persist", async () => {
    mocks.findUnique.mockResolvedValue(null);
    expect(await refreshWhoGrowthAssessment("missing")).toEqual({ status: "missing" });
    expect(mocks.upsert).not.toHaveBeenCalled();
  });
  it("removes stale assessments if sex, age or preterm status is unsupported", async () => {
    for (const modified of [
      { ...entry, baby: { ...entry.baby, gender: "UNDISCLOSED" } },
      { ...entry, baby: { ...entry.baby, gestationalAgeAtBirth: 35 } },
      { ...entry, measuredAt: new Date("2025-01-01") },
    ]) {
      mocks.findUnique.mockResolvedValue(modified);
      expect((await refreshWhoGrowthAssessment(entry.id)).status).toBe("unsupported");
    }
    expect(mocks.deleteMany).toHaveBeenCalledTimes(3); expect(mocks.upsert).not.toHaveBeenCalled();
  });
  it("does not store an all-null success result", async () => {
    mocks.findUnique.mockResolvedValue({ ...entry, weightKg: null, heightCm: null, headCircumferenceCm: null });
    expect(await refreshWhoGrowthAssessment(entry.id)).toEqual({ status: "empty" }); expect(mocks.upsert).not.toHaveBeenCalled();
  });
  it("propagates a persistence failure so the action can display an error", async () => {
    mocks.upsert.mockRejectedValue(new Error("database unavailable"));
    await expect(refreshWhoGrowthAssessment(entry.id)).rejects.toThrow("database unavailable");
  });
  it("checks input using age at the recorded date", () => {
    expect(whoEntryInput(entry).input).toMatchObject({ ageInDays: 10, sex: "1", measure: "L" });
  });
});

describe("WHO Anthro age in the account timezone", () => {
  it("uses the measurement's local calendar day", () => {
    // 2026-01-12 06:59 in Vietnam.
    expect(
      growthAgeInDays(
        new Date("2026-01-01T00:00:00Z"),
        new Date("2026-01-11T23:59:00Z"),
        "Asia/Ho_Chi_Minh",
      ),
    ).toBe(11);
  });
});
