import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  user: vi.fn(),
  baby: vi.fn(),
  find: vi.fn(),
  create: vi.fn(),
  upsert: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  toggle: vi.fn(),
  redirect: vi.fn(),
}));
vi.mock("@/lib/auth", () => ({ requireUser: mocks.user }));
vi.mock("@/lib/db", () => ({
  db: {
    baby: { findFirst: mocks.baby },
    babyCareEntry: {
      findFirst: mocks.find,
      create: mocks.create,
      upsert: mocks.upsert,
      update: mocks.update,
      deleteMany: mocks.remove,
      updateMany: mocks.toggle,
    },
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
import {
  saveCareAction,
  deleteCareAction,
  toggleRoutineAction,
} from "./care-actions";
function form(extra: Record<string, string> = {}) {
  const result = new FormData();
  Object.entries({
    babyId: "baby-1",
    section: "meals",
    occurredAt: "2026-01-01T08:30",
    title: "Cháo",
    details: "",
    amount: "3 thìa",
    mood: "",
    symptoms: "",
    ...extra,
  }).forEach(([k, v]) => result.set(k, v));
  return result;
}
beforeEach(() => {
  vi.resetAllMocks();
  mocks.user.mockResolvedValue({ id: "user-1", timezone: "Asia/Ho_Chi_Minh" });
  mocks.baby.mockResolvedValue({ id: "baby-1" });
});
describe("care journal actions", () => {
  it("validates ownership before creating and converts account local time", async () => {
    await saveCareAction(form());
    expect(mocks.baby).toHaveBeenCalledWith({
      where: { id: "baby-1", userId: "user-1" },
      select: { id: true },
    });
    expect(mocks.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        babyId: "baby-1",
        kind: "MEAL",
        occurredAt: new Date("2026-01-01T01:30Z"),
        amount: "3 thìa",
        mood: null,
      }),
    });
    mocks.baby.mockResolvedValueOnce(null);
    await expect(saveCareAction(form())).rejects.toThrow("Không tìm thấy");
    expect(mocks.create).toHaveBeenCalledTimes(1);
  });
  it("rejects foreign entry edits and invalid or future actual dates", async () => {
    mocks.find.mockResolvedValue(null);
    await expect(saveCareAction(form({ id: "foreign" }))).rejects.toThrow(
      "Không tìm thấy bản ghi",
    );
    await expect(
      saveCareAction(form({ occurredAt: "2026-02-31T08:30" })),
    ).rejects.toThrow("Thời điểm");
    await expect(
      saveCareAction(form({ occurredAt: "2099-01-01T08:30" })),
    ).rejects.toThrow("tương lai");
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it("scopes deletion to the baby and record kind", async () => {
    await deleteCareAction(form({ id: "entry-1" }));
    expect(mocks.remove).toHaveBeenCalledWith({
      where: { id: "entry-1", babyId: "baby-1", kind: "MEAL" },
    });
  });
  it("allows future plans and never creates a real feeding or sleep on completion", async () => {
    await saveCareAction(
      form({
        section: "routine",
        occurredAt: "2099-01-01T08:30",
        durationMinutes: "30",
      }),
    );
    expect(mocks.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        kind: "ROUTINE",
        durationMinutes: 30,
        amount: null,
      }),
    });
    await toggleRoutineAction(
      form({ section: "routine", id: "plan-1", completed: "true" }),
    );
    expect(mocks.toggle).toHaveBeenCalledWith({
      where: { id: "plan-1", babyId: "baby-1", kind: "ROUTINE" },
      data: { completed: true },
    });
    await expect(toggleRoutineAction(form())).rejects.toThrow("không hợp lệ");
  });
  it("accepts the actual minimal form without fields from other sections", async () => {
    const data = form();
    data.delete("mood");
    data.delete("symptoms");
    data.delete("durationMinutes");
    await saveCareAction(data);
    expect(mocks.create).toHaveBeenCalledTimes(1);
    const milestone = form({ section: "milestones", title: "Nụ cười đầu" });
    milestone.delete("amount");
    milestone.delete("mood");
    milestone.delete("symptoms");
    await saveCareAction(milestone);
    expect(mocks.create).toHaveBeenCalledTimes(2);
  });
  it("uses an ownership-scoped unique badge key and rejects unknown badge keys", async () => {
    await saveCareAction(form({ section: "milestones", milestoneKey: "smile", title: "Nụ cười" }));
    expect(mocks.upsert).toHaveBeenCalledWith(expect.objectContaining({ where: { babyId_milestoneKey: { babyId: "baby-1", milestoneKey: "smile" } }, create: expect.objectContaining({ kind: "MILESTONE", milestoneKey: "smile" }) }));
    await expect(saveCareAction(form({ section: "milestones", milestoneKey: "invalid" }))).rejects.toThrow("Huy hiệu không hợp lệ");
  });
  it("rejects invalid uploads before writing", async () => {
    const data = form({ section: "milestones" });
    data.set(
      "photo",
      new File(["not a photo"], "fake.png", { type: "image/png" }),
    );
    await expect(saveCareAction(data)).rejects.toThrow("ảnh không hợp lệ");
    expect(mocks.create).not.toHaveBeenCalled();
  });
});
