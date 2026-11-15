import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "@prisma/client";

const mocks = vi.hoisted(() => ({
  user: vi.fn(),
  redirect: vi.fn(),
  babyFind: vi.fn(),
  motherFind: vi.fn(),
  motherUpsert: vi.fn(),
  transaction: vi.fn(),
  queryRaw: vi.fn(),
  pregnancyUpdateMany: vi.fn(),
  pregnancyCreate: vi.fn(),
  feedingUpdateMany: vi.fn(),
  feedingCreate: vi.fn(),
  sleepCreate: vi.fn(),
  sleepUpdateMany: vi.fn(),
  growthUpdateMany: vi.fn(),
  growthCreate: vi.fn(),
  assessmentDelete: vi.fn(),
  refresh: vi.fn(),
  prescriptionUpdateMany: vi.fn(),
  prescriptionCreate: vi.fn(),
  itemDelete: vi.fn(),
  itemCreate: vi.fn(),
  visitUpdateMany: vi.fn(),
  motherUpdateMany: vi.fn(),
  cycleUpdateMany: vi.fn(),
  cycleCreate: vi.fn(),
  dailyLogUpsert: vi.fn(),
}));

const client = vi.hoisted(() => ({}) as Record<string, unknown>);

vi.mock("@/lib/auth", () => ({ requireUser: mocks.user }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: async () => ({ set: vi.fn() }) }));
vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
  RedirectType: { replace: "replace" },
  unstable_rethrow: vi.fn(),
}));
vi.mock("@/features/growth/who-anthro", () => ({ refreshWhoGrowthAssessment: mocks.refresh }));
vi.mock("@/lib/db", () => {
  Object.assign(client, {
    baby: { findFirst: mocks.babyFind },
    mother: { findFirst: mocks.motherFind, upsert: mocks.motherUpsert, updateMany: mocks.motherUpdateMany },
    menstrualCycle: { updateMany: mocks.cycleUpdateMany, create: mocks.cycleCreate },
    motherDailyHealthLog: { upsert: mocks.dailyLogUpsert },
    pregnancy: { updateMany: mocks.pregnancyUpdateMany, create: mocks.pregnancyCreate },
    feeding: { updateMany: mocks.feedingUpdateMany, create: mocks.feedingCreate },
    sleepEntry: { updateMany: mocks.sleepUpdateMany, create: mocks.sleepCreate },
    growthEntry: { updateMany: mocks.growthUpdateMany, create: mocks.growthCreate },
    growthAssessment: { deleteMany: mocks.assessmentDelete },
    prescription: { updateMany: mocks.prescriptionUpdateMany, create: mocks.prescriptionCreate },
    prescriptionItem: { deleteMany: mocks.itemDelete, createMany: mocks.itemCreate },
    babyMedicalVisit: { updateMany: mocks.visitUpdateMany },
    $queryRaw: mocks.queryRaw,
    $transaction: mocks.transaction,
  });
  return { db: client };
});

import {
  saveBabyMedicalVisitAction,
  saveCycleSettingsAction,
  saveMenstrualCycleAction,
  saveMotherDailyHealthLogAction,
  saveFeedingAction,
  saveGrowthAction,
  saveMotherAction,
  savePregnancyAction,
  savePrescriptionAction,
  saveSleepAction,
} from "./actions";

const STALE = "Bản ghi không còn tồn tại, có thể đã bị xóa trên thiết bị khác.";

function form(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

function uniqueViolation() {
  return new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
    code: "P2002",
    clientVersion: "6.12.0",
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.user.mockResolvedValue({ id: "user-1", timezone: "Asia/Ho_Chi_Minh" });
  mocks.babyFind.mockResolvedValue({ id: "baby-1" });
  mocks.motherFind.mockResolvedValue({ id: "mother-1" });
  mocks.transaction.mockImplementation((run: (tx: typeof client) => unknown) => run(client));
  mocks.refresh.mockResolvedValue(undefined);
});

describe("savePrescriptionAction", () => {
  const edit = { id: "rx-1", babyId: "baby-1", issuedAt: "2026-11-01", "items.0.medicineName": "Paracetamol" };

  it("never touches items when the edited prescription no longer matches", async () => {
    mocks.prescriptionUpdateMany.mockResolvedValue({ count: 0 });
    await expect(savePrescriptionAction(form(edit))).resolves.toEqual({ error: STALE });
    expect(mocks.itemDelete).not.toHaveBeenCalled();
    expect(mocks.itemCreate).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("replaces items of the verified prescription inside one transaction", async () => {
    mocks.prescriptionUpdateMany.mockResolvedValue({ count: 1 });
    await savePrescriptionAction(form(edit));
    expect(mocks.transaction).toHaveBeenCalledTimes(1);
    expect(mocks.prescriptionUpdateMany).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "rx-1", babyId: "baby-1" } }));
    expect(mocks.itemDelete).toHaveBeenCalledWith({ where: { prescriptionId: "rx-1" } });
    expect(mocks.itemCreate).toHaveBeenCalledWith({ data: [expect.objectContaining({ medicineName: "Paracetamol", prescriptionId: "rx-1" })] });
    expect(mocks.redirect).toHaveBeenCalledWith("/tracking/prescription?view=archive", "replace");
  });
});

describe("saveGrowthAction", () => {
  const edit = { id: "g-1", babyId: "baby-1", measuredAt: "2026-11-01T08:00", weightKg: "5" };

  it("does not delete or recompute an assessment for an entry that was not updated", async () => {
    mocks.growthUpdateMany.mockResolvedValue({ count: 0 });
    await expect(saveGrowthAction(form(edit))).resolves.toEqual({ error: STALE });
    expect(mocks.assessmentDelete).not.toHaveBeenCalled();
    expect(mocks.refresh).not.toHaveBeenCalled();
  });

  it("refreshes the assessment of an updated entry", async () => {
    mocks.growthUpdateMany.mockResolvedValue({ count: 1 });
    await saveGrowthAction(form(edit));
    expect(mocks.assessmentDelete).toHaveBeenCalledWith({ where: { growthEntryId: "g-1" } });
    expect(mocks.refresh).toHaveBeenCalledWith("g-1");
    expect(mocks.redirect).toHaveBeenCalledWith("/tracking/growth", "replace");
  });
});

describe("expected failures are returned, not thrown", () => {
  const feeding = { babyId: "baby-1", type: "FORMULA", startTime: "2026-11-01T08:00", amountMl: "90" };

  it("reports an edit of a record deleted on the other phone", async () => {
    mocks.feedingUpdateMany.mockResolvedValue({ count: 0 });
    await expect(saveFeedingAction(form({ ...feeding, id: "f-1" }))).resolves.toEqual({ error: STALE });
    mocks.visitUpdateMany.mockResolvedValue({ count: 0 });
    await expect(saveBabyMedicalVisitAction(form({ id: "v-1", babyId: "baby-1", visitedAt: "2026-11-01T08:00" }))).resolves.toEqual({ error: STALE });
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("returns schema messages and a missing-baby message", async () => {
    await expect(saveFeedingAction(form({ ...feeding, startTime: "2099-01-01T08:00" }))).resolves.toEqual({ error: "Giờ bắt đầu bú không thể ở tương lai" });
    await expect(saveSleepAction(form({ babyId: "baby-1", type: "NIGHT", startTime: "2026-11-01T20:00", endTime: "2026-11-03T08:00" }))).resolves.toEqual({ error: expect.stringContaining("24 giờ") });
    await expect(saveFeedingAction(form({ ...feeding, type: "UNKNOWN" }))).resolves.toEqual({ error: "Hãy chọn một giá trị hợp lệ." });
    mocks.babyFind.mockResolvedValue(null);
    await expect(saveFeedingAction(form(feeding))).resolves.toEqual({ error: "Không tìm thấy hồ sơ bé." });
    expect(mocks.feedingCreate).not.toHaveBeenCalled();
  });

  it("redirects after a successful create", async () => {
    await expect(saveFeedingAction(form(feeding))).resolves.toBeUndefined();
    expect(mocks.feedingCreate).toHaveBeenCalledWith({ data: expect.objectContaining({ babyId: "baby-1", startTime: new Date("2026-11-01T01:00:00Z") }) });
    expect(mocks.redirect).toHaveBeenCalledWith("/tracking/feeding", "replace");
  });

  it("explains a second open sleep or running breastfeeding timer", async () => {
    mocks.sleepCreate.mockRejectedValue(uniqueViolation());
    await expect(saveSleepAction(form({ babyId: "baby-1", type: "NAP", startTime: "2026-11-01T08:00" }))).resolves.toEqual({ error: expect.stringContaining("giấc ngủ chưa kết thúc") });
    mocks.feedingCreate.mockRejectedValue(uniqueViolation());
    await expect(saveFeedingAction(form({ babyId: "baby-1", type: "BREASTFEEDING", startTime: "2026-11-01T08:00" }))).resolves.toEqual({ error: expect.stringContaining("cữ bú mẹ đang bấm giờ") });
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("hides unexpected errors behind a generic message", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    mocks.feedingCreate.mockRejectedValue(new Error("connection reset"));
    await expect(saveFeedingAction(form(feeding))).resolves.toEqual({ error: "Chưa thể lưu. Hãy thử lại." });
    log.mockRestore();
  });
});

describe("mother and pregnancy races", () => {
  it("upserts the single mother profile on the unique account id", async () => {
    mocks.motherUpsert.mockResolvedValue({ id: "mother-1" });
    await saveMotherAction(form({ name: "Lan" }));
    expect(mocks.motherUpsert).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: "user-1" }, create: expect.objectContaining({ userId: "user-1", name: "Lan" }) }));
  });

  it("locks the mother row before ending other pregnancies in the same transaction", async () => {
    mocks.pregnancyUpdateMany.mockResolvedValue({ count: 1 });
    await savePregnancyAction(form({ motherId: "mother-1", pregnancyStatus: "PREGNANT" }));
    expect(mocks.transaction).toHaveBeenCalledTimes(1);
    expect(mocks.queryRaw).toHaveBeenCalledTimes(1);
    expect(mocks.queryRaw.mock.invocationCallOrder[0]).toBeLessThan(mocks.pregnancyUpdateMany.mock.invocationCallOrder[0]);
    expect(mocks.pregnancyUpdateMany).toHaveBeenCalledWith({ where: { motherId: "mother-1", pregnancyStatus: "PREGNANT" }, data: { pregnancyStatus: "ENDED" } });
    expect(mocks.pregnancyCreate).toHaveBeenCalled();
  });

  it("reports a stale pregnancy edit", async () => {
    mocks.pregnancyUpdateMany.mockResolvedValueOnce({ count: 0 });
    await expect(savePregnancyAction(form({ id: "p-1", motherId: "mother-1", pregnancyStatus: "PLANNING" }))).resolves.toEqual({ error: STALE });
  });
});

describe("cycle forms return errors instead of throwing", () => {
  it("saves a period and redirects, or reports a stale edit and an invalid range", async () => {
    await expect(saveMenstrualCycleAction(form({ motherId: "mother-1", periodStart: "2026-11-01" }))).resolves.toBeUndefined();
    expect(mocks.cycleCreate).toHaveBeenCalledWith({ data: expect.objectContaining({ motherId: "mother-1" }) });
    expect(mocks.redirect).toHaveBeenCalledWith("/mother/cycle", "replace");
    mocks.redirect.mockClear();
    mocks.cycleUpdateMany.mockResolvedValue({ count: 0 });
    await expect(saveMenstrualCycleAction(form({ id: "c-1", motherId: "mother-1", periodStart: "2026-11-01" }))).resolves.toEqual({ error: STALE });
    await expect(saveMenstrualCycleAction(form({ motherId: "mother-1", periodStart: "2026-11-05", periodEnd: "2026-11-01" }))).resolves.toEqual({ error: "Ngày kết thúc phải sau ngày bắt đầu" });
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("reports a missing mother profile for settings and daily logs", async () => {
    const settings = { motherId: "mother-1", cycleLengthDays: "28", periodLengthDays: "5", lutealPhaseDays: "14" };
    mocks.motherUpdateMany.mockResolvedValue({ count: 1 });
    await expect(saveCycleSettingsAction(form(settings))).resolves.toBeUndefined();
    mocks.motherUpdateMany.mockResolvedValue({ count: 0 });
    await expect(saveCycleSettingsAction(form(settings))).resolves.toEqual({ error: "Không tìm thấy hồ sơ mẹ." });
    await expect(saveCycleSettingsAction(form({ ...settings, cycleLengthDays: "5" }))).resolves.toEqual({ error: expect.any(String) });

    const log = { motherId: "mother-1", loggedAt: "2026-11-01" };
    await expect(saveMotherDailyHealthLogAction(form(log))).resolves.toBeUndefined();
    expect(mocks.dailyLogUpsert).toHaveBeenCalledTimes(1);
    mocks.motherFind.mockResolvedValue(null);
    await expect(saveMotherDailyHealthLogAction(form(log))).resolves.toEqual({ error: "Không tìm thấy hồ sơ mẹ." });
    expect(mocks.dailyLogUpsert).toHaveBeenCalledTimes(1);
  });
});
