/**
 * Rules for linking an appointment ("Đã tiêm") to a vaccination record.
 *
 * Completing an appointment either reuses a matching record that already
 * exists (e.g. the dose was ticked earlier on the checklist) or creates one.
 * Undo must only delete a record the completion itself created; a reused
 * record stays and is only unlinked. A record created by a completion stores
 * that appointment's id in `createdByAppointmentId`; records created any other
 * way (checklist tick, past-vaccination form) keep it NULL, so undo leaves
 * them in the journal.
 */

export type LinkableRecord = {
  id: string;
  facility: string | null;
  notes: string | null;
  scheduleKey?: string | null;
  appointment: { id: string } | null;
};

export const ALREADY_LINKED_ERROR =
  "Mũi này đã được ghi nhận ở một lịch hẹn khác. Hãy bỏ đánh dấu lịch hẹn đó trước nếu muốn ghi lại.";

export type CompletionPlan =
  | { kind: "create" }
  | { kind: "reuse"; recordId: string }
  | { kind: "conflict" };

export function planCompletion(
  appointmentId: string,
  existing: LinkableRecord | undefined,
): CompletionPlan {
  if (!existing) return { kind: "create" };
  if (existing.appointment && existing.appointment.id !== appointmentId)
    return { kind: "conflict" };
  return { kind: "reuse", recordId: existing.id };
}

/** Whether undoing/deleting this appointment may delete the linked record. */
export function createdByCompletion(
  appointment: { id: string },
  record: { createdByAppointmentId: string | null },
) {
  return record.createdByAppointmentId === appointment.id;
}

/**
 * Update for a reused record: the date typed in the completion form is the
 * real one; facility/notes are only replaced when the user typed something.
 */
export function reusedRecordUpdate(
  existing: LinkableRecord,
  typed: {
    administeredAt: Date;
    facility?: string | null;
    notes?: string | null;
    scheduleKey?: string;
  },
) {
  return {
    administeredAt: typed.administeredAt,
    facility: typed.facility ?? existing.facility,
    notes: typed.notes ?? existing.notes,
    ...(typed.scheduleKey && !existing.scheduleKey
      ? { scheduleKey: typed.scheduleKey }
      : {}),
  };
}
