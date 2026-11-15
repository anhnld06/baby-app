import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  user: vi.fn(),
  redirect: vi.fn(),
  appointmentFind: vi.fn(),
  appointmentUpdate: vi.fn(),
  appointmentDelete: vi.fn(),
  appointmentCreate: vi.fn(),
  appointmentFindMany: vi.fn(),
  babyFind: vi.fn(),
  recordFindMany: vi.fn(),
  recordFindFirst: vi.fn(),
  recordCreate: vi.fn(),
  recordUpdate: vi.fn(),
  recordDelete: vi.fn(),
  queryRaw: vi.fn(),
}));
const tx = vi.hoisted(() => ({}) as Record<string, unknown>);

vi.mock("@/lib/auth", () => ({ requireUser: mocks.user }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
  RedirectType: { replace: "replace" },
  unstable_rethrow: vi.fn(),
}));
vi.mock("@/lib/db", () => {
  Object.assign(tx, {
    vaccinationAppointment: {
      findFirst: mocks.appointmentFind,
      update: mocks.appointmentUpdate,
      delete: mocks.appointmentDelete,
      create: mocks.appointmentCreate,
      findMany: mocks.appointmentFindMany,
    },
    baby: { findFirst: mocks.babyFind },
    vaccinationRecord: {
      findMany: mocks.recordFindMany,
      findFirst: mocks.recordFindFirst,
      create: mocks.recordCreate,
      update: mocks.recordUpdate,
      delete: mocks.recordDelete,
    },
    $queryRaw: mocks.queryRaw,
  });
  return { db: { $transaction: (run: (client: typeof tx) => unknown) => run(tx) } };
});

import { changeAppointment, completeAppointment, toggleScheduledDose } from "./vaccination-actions";

const appointment = {
  id: "apt-1",
  babyId: "baby-1",
  motherId: null,
  vaccineName: "BCG",
  doseNumber: 1,
  scheduledAt: new Date("2026-10-01T00:00:00Z"),
  notes: null,
  vaccinationRecordId: null as string | null,
  motherVaccinationRecordId: null,
  createdAt: new Date("2026-09-01T02:03:04.005Z"),
  updatedAt: new Date("2026-09-01T02:03:04.005Z"),
};

function form(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.user.mockResolvedValue({ id: "user-1", timezone: "Asia/Ho_Chi_Minh" });
  mocks.appointmentFind.mockResolvedValue(appointment);
  mocks.recordCreate.mockResolvedValue({ id: "new-record" });
});

describe("completeAppointment", () => {
  it("marks a newly created record with the appointment so undo can recognise it", async () => {
    mocks.recordFindMany.mockResolvedValue([]);
    await completeAppointment("apt-1", {}, form({ administeredAt: "2026-10-02", facility: "VNVC" }));
    expect(mocks.recordCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ scheduleKey: "bcg", facility: "VNVC", createdByAppointmentId: "apt-1", babyId: "baby-1" }),
    });
    // The record keeps its own creation time; the old createdAt marker is gone.
    expect(mocks.recordCreate.mock.calls[0][0].data).not.toHaveProperty("createdAt");
    expect(mocks.appointmentUpdate).toHaveBeenCalledWith({ where: { id: "apt-1" }, data: { vaccinationRecordId: "new-record" } });
  });

  it("reuses a checklist record and keeps the date and facility that were typed", async () => {
    mocks.recordFindMany.mockResolvedValue([
      { id: "ticked", scheduleKey: "bcg", vaccineName: "BCG (lao)", doseNumber: 1, createdAt: new Date("2026-09-20T00:00:00Z"), facility: null, notes: null, appointment: null },
    ]);
    await completeAppointment("apt-1", {}, form({ administeredAt: "2026-10-02", facility: "VNVC" }));
    expect(mocks.recordCreate).not.toHaveBeenCalled();
    expect(mocks.recordUpdate).toHaveBeenCalledWith({
      where: { id: "ticked" },
      data: { administeredAt: new Date("2026-10-02T00:00:00Z"), facility: "VNVC", notes: null },
    });
    expect(mocks.appointmentUpdate).toHaveBeenCalledWith({ where: { id: "apt-1" }, data: { vaccinationRecordId: "ticked" } });
  });

  it("explains a dose already linked to another appointment", async () => {
    mocks.recordFindMany.mockResolvedValue([
      { id: "other", scheduleKey: "bcg", vaccineName: "BCG", doseNumber: 1, createdAt: new Date(), facility: null, notes: null, appointment: { id: "apt-2" } },
    ]);
    const result = await completeAppointment("apt-1", {}, form({ administeredAt: "2026-10-02" }));
    expect(result.error).toContain("lịch hẹn khác");
    expect(mocks.appointmentUpdate).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
});

describe("undo a completed appointment", () => {
  it("deletes a record created by the completion", async () => {
    mocks.appointmentFind.mockResolvedValue({ ...appointment, vaccinationRecordId: "rec-1" });
    mocks.recordFindFirst.mockResolvedValue({ id: "rec-1", createdByAppointmentId: "apt-1" });
    await changeAppointment("apt-1", "undo");
    expect(mocks.recordFindFirst).toHaveBeenCalledWith(expect.objectContaining({ select: { id: true, createdByAppointmentId: true } }));
    expect(mocks.appointmentUpdate).toHaveBeenCalledWith({ where: { id: "apt-1" }, data: { vaccinationRecordId: null, motherVaccinationRecordId: null } });
    expect(mocks.recordDelete).toHaveBeenCalledWith({ where: { id: "rec-1" } });
  });

  it("only unlinks a record that existed before (checklist tick)", async () => {
    mocks.appointmentFind.mockResolvedValue({ ...appointment, vaccinationRecordId: "ticked" });
    mocks.recordFindFirst.mockResolvedValue({ id: "ticked", createdByAppointmentId: null });
    await changeAppointment("apt-1", "undo");
    expect(mocks.appointmentUpdate).toHaveBeenCalled();
    expect(mocks.recordDelete).not.toHaveBeenCalled();
  });

  it("no longer treats a matching createdAt as ownership", async () => {
    mocks.appointmentFind.mockResolvedValue({ ...appointment, vaccinationRecordId: "legacy" });
    mocks.recordFindFirst.mockResolvedValue({ id: "legacy", createdAt: appointment.createdAt, createdByAppointmentId: null });
    await changeAppointment("apt-1", "undo");
    expect(mocks.recordDelete).not.toHaveBeenCalled();
  });

  it("deleting a completed appointment also removes the record it created", async () => {
    mocks.appointmentFind.mockResolvedValue({ ...appointment, vaccinationRecordId: "rec-1" });
    mocks.recordFindFirst.mockResolvedValue({ id: "rec-1", createdByAppointmentId: "apt-1" });
    await changeAppointment("apt-1", "delete");
    expect(mocks.appointmentDelete).toHaveBeenCalledWith({ where: { id: "apt-1" } });
    expect(mocks.recordDelete).toHaveBeenCalledWith({ where: { id: "rec-1" } });
  });
});

describe("next appointment after completing a series dose", () => {
  it("names the follow-up after the next dose so the checklist links it", async () => {
    mocks.appointmentFind.mockResolvedValue({ ...appointment, vaccineName: "5 trong 1 / 6 trong 1 - mũi 1", doseNumber: 1 });
    mocks.recordFindMany.mockResolvedValue([]);
    await completeAppointment("apt-1", {}, form({ administeredAt: "2026-10-30", nextScheduledAt: "2026-11-30" }));
    expect(mocks.appointmentCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ vaccineName: "5 trong 1 / 6 trong 1 - mũi 2", doseNumber: 2, scheduledAt: new Date("2026-11-30T00:00:00Z") }),
    });
  });

  it("keeps the typed name for a vaccine outside the schedule", async () => {
    mocks.appointmentFind.mockResolvedValue({ ...appointment, vaccineName: "Vắc-xin khác", doseNumber: null });
    mocks.recordFindMany.mockResolvedValue([]);
    await completeAppointment("apt-1", {}, form({ administeredAt: "2026-10-30", nextScheduledAt: "2026-11-30" }));
    expect(mocks.appointmentCreate.mock.calls[0][0].data).toMatchObject({ vaccineName: "Vắc-xin khác" });
    expect(mocks.appointmentCreate.mock.calls[0][0].data).not.toHaveProperty("doseNumber");
  });
});

describe("checklist tick", () => {
  beforeEach(() => {
    mocks.babyFind.mockResolvedValue({ id: "baby-1" });
    mocks.recordFindMany.mockResolvedValue([]);
    mocks.appointmentFindMany.mockResolvedValue([]);
  });

  it("saves the date chosen in the tick dialog", async () => {
    const result = await toggleScheduledDose("baby", "baby-1", "5in1-1", true, {}, form({ administeredAt: "2026-10-30" }));
    expect(result).toEqual({});
    expect(mocks.recordCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ scheduleKey: "5in1-1", doseNumber: 1, administeredAt: new Date("2026-10-30T00:00:00Z"), babyId: "baby-1" }),
    });
  });

  it("refuses a future date and an invalid date", async () => {
    expect((await toggleScheduledDose("baby", "baby-1", "5in1-1", true, {}, form({ administeredAt: "2999-01-01" }))).error)
      .toBe("Ngày đã tiêm không thể ở tương lai.");
    expect((await toggleScheduledDose("baby", "baby-1", "5in1-1", true, {}, form({ administeredAt: "2026-02-30" }))).error)
      .toBe("Ngày không hợp lệ.");
    expect(mocks.recordCreate).not.toHaveBeenCalled();
  });

  it("falls back to today in the account timezone when no date is sent", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-11-09T18:30:00Z")); // 10/11 01:30 in Asia/Ho_Chi_Minh
    try {
      await toggleScheduledDose("baby", "baby-1", "bcg", true, {}, new FormData());
    } finally {
      vi.useRealTimers();
    }
    expect(mocks.recordCreate.mock.calls[0][0].data.administeredAt).toEqual(new Date("2026-11-10T00:00:00Z"));
  });
});
