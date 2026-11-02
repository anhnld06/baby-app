"use server";

import { revalidatePath } from "next/cache";
import { redirect, RedirectType, unstable_rethrow } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { BABY_SCHEDULE, MOTHER_PRENATAL_SCHEDULE } from "@/features/vaccination/schedule";
import { findChecklistRecord, recordMatchesEntry, scheduleEntry } from "@/features/vaccination/checklist";
import { toDateTimeLocal } from "@/lib/date";
import {
  appointmentSchema,
  completionSchema,
  historySchema,
  dateFromInput,
  type VaccinationFormState,
} from "@/features/vaccination/journal";

async function ownerFor(
  tx: Prisma.TransactionClient,
  owner: string,
  userId: string,
) {
  const [kind, id] = owner.split(":");
  if (
    kind === "baby" &&
    id &&
    (await tx.baby.findFirst({ where: { id, userId }, select: { id: true } }))
  )
    return { babyId: id, motherId: null };
  if (
    kind === "mother" &&
    id &&
    (await tx.mother.findFirst({ where: { id, userId }, select: { id: true } }))
  )
    return { babyId: null, motherId: id };
  throw new Error("Không tìm thấy hồ sơ trong gia đình.");
}

async function lockedAppointment(
  tx: Prisma.TransactionClient,
  id: string,
  userId: string,
) {
  const where = { id, OR: [{ baby: { userId } }, { mother: { userId } }] };
  const original = await tx.vaccinationAppointment.findFirst({ where });
  if (!original) throw new Error("Không tìm thấy lịch hẹn.");
  if (original.babyId)
    await tx.$queryRaw`SELECT "id" FROM "Baby" WHERE "id" = ${original.babyId} FOR UPDATE`;
  else
    await tx.$queryRaw`SELECT "id" FROM "Mother" WHERE "id" = ${original.motherId} FOR UPDATE`;
  await tx.$queryRaw`SELECT "id" FROM "VaccinationAppointment" WHERE "id" = ${id} FOR UPDATE`;
  const item = await tx.vaccinationAppointment.findFirst({ where });
  if (!item) throw new Error("Không tìm thấy lịch hẹn.");
  return item;
}

function checkActualDate(value: string, timezone: string) {
  if (value > toDateTimeLocal(new Date(), timezone).slice(0, 10))
    throw new Error("Ngày đã tiêm không thể ở tương lai.");
}

async function mutation(
  run: () => Promise<unknown>,
  navigate = true,
): Promise<VaccinationFormState> {
  try {
    await run();
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof z.ZodError)
      return { error: error.issues[0]?.message ?? "Thông tin chưa hợp lệ." };
    const known = [
      "Không tìm thấy hồ sơ trong gia đình.",
      "Không tìm thấy lịch hẹn.",
      "Không tìm thấy lần tiêm.",
      "Ngày đã tiêm không thể ở tương lai.",
    ];
    return {
      error:
        error instanceof Error && known.includes(error.message)
          ? error.message
          : "Chưa thể lưu. Hãy kiểm tra kết nối và thử lại.",
    };
  }
  revalidatePath("/", "layout");
  if (navigate) redirect("/vaccination-schedule", RedirectType.replace);
  return {};
}

export async function saveAppointment(
  id: string | null,
  _state: VaccinationFormState,
  form: FormData,
): Promise<VaccinationFormState> {
  const user = await requireUser();
  return mutation(async () => {
    const data = appointmentSchema.parse(Object.fromEntries(form));
    if (data.administeredAt)
      checkActualDate(data.administeredAt, user.timezone);
    await db.$transaction(async (tx) => {
      const owner = await ownerFor(tx, data.owner, user.id);
      const details = {
        vaccineName: data.vaccineName,
        doseNumber: data.doseNumber ?? null,
        notes: data.notes ?? null,
      };
      if (!id) {
        await tx.vaccinationAppointment.create({
          data: {
            ...owner,
            ...details,
            scheduledAt: dateFromInput(data.scheduledAt),
          },
        });
        return;
      }
      const item = await lockedAppointment(tx, id, user.id);
      // An existing appointment stays attached to its original person.
      if (item.babyId !== owner.babyId || item.motherId !== owner.motherId)
        throw new Error("Không tìm thấy lịch hẹn.");
      await tx.vaccinationAppointment.update({
        where: { id },
        data: { ...details, scheduledAt: dateFromInput(data.scheduledAt) },
      });
      const recordData = {
        ...details,
        facility: data.facility ?? null,
        ...(data.administeredAt
          ? { administeredAt: dateFromInput(data.administeredAt) }
          : {}),
      };
      if (item.vaccinationRecordId)
        await tx.vaccinationRecord.update({
          where: { id: item.vaccinationRecordId },
          data: recordData,
        });
      if (item.motherVaccinationRecordId)
        await tx.motherVaccinationRecord.update({
          where: { id: item.motherVaccinationRecordId },
          data: recordData,
        });
    });
  });
}

export async function completeAppointment(
  id: string,
  _state: VaccinationFormState,
  form: FormData,
): Promise<VaccinationFormState> {
  const user = await requireUser();
  return mutation(async () => {
    const data = completionSchema.parse(Object.fromEntries(form));
    checkActualDate(data.administeredAt, user.timezone);
    await db.$transaction(async (tx) => {
      const item = await lockedAppointment(tx, id, user.id);
      if (item.vaccinationRecordId || item.motherVaccinationRecordId) return;
      const kind = item.babyId ? "baby" : "mother";
      const entry = (kind === "baby" ? BABY_SCHEDULE : MOTHER_PRENATAL_SCHEDULE).find((candidate) => recordMatchesEntry(item, candidate));
      const existingRecords = item.babyId
        ? await tx.vaccinationRecord.findMany({ where: { babyId: item.babyId } })
        : await tx.motherVaccinationRecord.findMany({ where: { motherId: item.motherId! } });
      const existing = entry ? findChecklistRecord<(typeof existingRecords)[number]>(existingRecords, entry) : undefined;
      const details = {
        ...(entry ? { scheduleKey: entry.key } : {}),
        vaccineName: item.vaccineName,
        doseNumber: item.doseNumber,
        administeredAt: dateFromInput(data.administeredAt),
        facility: data.facility ?? null,
        notes: data.notes ?? null,
      };
      if (item.babyId) {
        const record = existing ?? await tx.vaccinationRecord.create({
          data: { ...details, babyId: item.babyId },
        });
        await tx.vaccinationAppointment.update({
          where: { id },
          data: { vaccinationRecordId: record.id },
        });
      } else {
        const record = existing ?? await tx.motherVaccinationRecord.create({
          data: { ...details, motherId: item.motherId! },
        });
        await tx.vaccinationAppointment.update({
          where: { id },
          data: { motherVaccinationRecordId: record.id },
        });
      }
      if (data.nextScheduledAt)
        await tx.vaccinationAppointment.create({
          data: {
            babyId: item.babyId,
            motherId: item.motherId,
            vaccineName: item.vaccineName,
            scheduledAt: dateFromInput(data.nextScheduledAt),
          },
        });
    });
  });
}

export async function changeAppointment(
  id: string,
  operation: "undo" | "delete",
): Promise<VaccinationFormState> {
  const user = await requireUser();
  return mutation(() =>
    db.$transaction(async (tx) => {
      const item = await lockedAppointment(tx, id, user.id);
      if (operation === "delete")
        await tx.vaccinationAppointment.delete({ where: { id } });
      else
        await tx.vaccinationAppointment.update({
          where: { id },
          data: { vaccinationRecordId: null, motherVaccinationRecordId: null },
        });
      if (item.vaccinationRecordId)
        await tx.vaccinationRecord.deleteMany({
          where: { id: item.vaccinationRecordId, baby: { userId: user.id } },
        });
      if (item.motherVaccinationRecordId)
        await tx.motherVaccinationRecord.deleteMany({
          where: {
            id: item.motherVaccinationRecordId,
            mother: { userId: user.id },
          },
        });
    }),
  );
}

export async function savePastVaccination(
  id: string | null,
  _state: VaccinationFormState,
  form: FormData,
): Promise<VaccinationFormState> {
  const user = await requireUser();
  return mutation(async () => {
    const data = historySchema.parse(Object.fromEntries(form));
    checkActualDate(data.administeredAt, user.timezone);
    await db.$transaction(async (tx) => {
      const owner = await ownerFor(tx, data.owner, user.id);
      const details = {
        vaccineName: data.vaccineName,
        doseNumber: data.doseNumber ?? null,
        administeredAt: dateFromInput(data.administeredAt),
        facility: data.facility ?? null,
        notes: data.notes ?? null,
      };
      if (owner.babyId) {
        if (id) {
          const result = await tx.vaccinationRecord.updateMany({
            where: { id, babyId: owner.babyId, appointment: null },
            data: details,
          });
          if (!result.count) throw new Error("Không tìm thấy lần tiêm.");
        } else
          await tx.vaccinationRecord.create({
            data: { ...details, babyId: owner.babyId },
          });
      } else {
        if (id) {
          const result = await tx.motherVaccinationRecord.updateMany({
            where: { id, motherId: owner.motherId!, appointment: null },
            data: details,
          });
          if (!result.count) throw new Error("Không tìm thấy lần tiêm.");
        } else
          await tx.motherVaccinationRecord.create({
            data: { ...details, motherId: owner.motherId! },
          });
      }
    });
  });
}

// A checkbox writes a real journal record, not a separate completion flag.
export async function toggleScheduledDose(
  kind: "baby" | "mother",
  ownerId: string,
  key: string,
  done: boolean,
  ..._submission: [VaccinationFormState, FormData]
): Promise<VaccinationFormState> {
  void _submission;
  const user = await requireUser();
  return mutation(async () => {
    const entry = scheduleEntry(kind, key);
    if (!entry) throw new Error("Không tìm thấy lần tiêm.");
    await db.$transaction(async (tx) => {
      await ownerFor(tx, `${kind}:${ownerId}`, user.id);
      // Serialize both spouses marking the same child's checklist.
      if (kind === "baby")
        await tx.$queryRaw`SELECT "id" FROM "Baby" WHERE "id" = ${ownerId} FOR UPDATE`;
      else
        await tx.$queryRaw`SELECT "id" FROM "Mother" WHERE "id" = ${ownerId} FOR UPDATE`;
      const records = kind === "baby"
        ? await tx.vaccinationRecord.findMany({ where: { babyId: ownerId } })
        : await tx.motherVaccinationRecord.findMany({ where: { motherId: ownerId } });
      const record = findChecklistRecord<(typeof records)[number]>(records, entry);
      if (!done) {
        if (!record) return;
        // SetNull on the relation restores a linked appointment to pending.
        if (kind === "baby") await tx.vaccinationRecord.delete({ where: { id: record.id } });
        else await tx.motherVaccinationRecord.delete({ where: { id: record.id } });
        return;
      }
      if (record) return;
      const details = {
        scheduleKey: entry.key,
        vaccineName: entry.label,
        doseNumber: entry.doseNumber,
        administeredAt: dateFromInput(toDateTimeLocal(new Date(), user.timezone).slice(0, 10)),
      };
      const created = kind === "baby"
        ? await tx.vaccinationRecord.create({ data: { ...details, babyId: ownerId } })
        : await tx.motherVaccinationRecord.create({ data: { ...details, motherId: ownerId } });
      const pending = await tx.vaccinationAppointment.findMany({ where: {
        ...(kind === "baby" ? { babyId: ownerId } : { motherId: ownerId }),
        vaccinationRecordId: null,
        motherVaccinationRecordId: null,
      }, orderBy: { scheduledAt: "asc" } });
      const appointment = pending.find((item) => recordMatchesEntry(item, entry));
      if (appointment) await tx.vaccinationAppointment.update({ where: { id: appointment.id }, data: kind === "baby" ? { vaccinationRecordId: created.id } : { motherVaccinationRecordId: created.id } });
    });
  }, false);
}
