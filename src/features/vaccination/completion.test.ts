import { describe, expect, it } from "vitest";
import {
  createdByCompletion,
  planCompletion,
  reusedRecordUpdate,
  type LinkableRecord,
} from "./completion";

const record = (extra: Partial<LinkableRecord> = {}): LinkableRecord => ({
  id: "rec-1",
  facility: "Trạm y tế",
  notes: "Tích từ danh sách",
  scheduleKey: "bcg",
  appointment: null,
  ...extra,
});

describe("appointment completion", () => {
  it("creates a record when none matches and reuses an unlinked one", () => {
    expect(planCompletion("apt-1", undefined)).toEqual({ kind: "create" });
    expect(planCompletion("apt-1", record())).toEqual({ kind: "reuse", recordId: "rec-1" });
  });

  it("refuses a record that already belongs to another appointment", () => {
    expect(planCompletion("apt-1", record({ appointment: { id: "apt-2" } }))).toEqual({ kind: "conflict" });
  });

  it("only treats a record marked with this appointment's id as created by its completion", () => {
    const appointment = { id: "apt-1" };
    expect(createdByCompletion(appointment, { createdByAppointmentId: "apt-1" })).toBe(true);
    // Checklist ticks, past entries and legacy rows without the old createdAt marker.
    expect(createdByCompletion(appointment, { createdByAppointmentId: null })).toBe(false);
    // Created by another appointment's completion: never deleted from here.
    expect(createdByCompletion(appointment, { createdByAppointmentId: "apt-2" })).toBe(false);
  });

  it("keeps the typed date and facility on a reused record", () => {
    const administeredAt = new Date("2026-10-18T00:00:00Z");
    expect(reusedRecordUpdate(record(), { administeredAt, facility: "VNVC", notes: undefined, scheduleKey: "bcg" }))
      .toEqual({ administeredAt, facility: "VNVC", notes: "Tích từ danh sách" });
    expect(reusedRecordUpdate(record({ scheduleKey: null }), { administeredAt, scheduleKey: "bcg" }))
      .toEqual({ administeredAt, facility: "Trạm y tế", notes: "Tích từ danh sách", scheduleKey: "bcg" });
  });
});
