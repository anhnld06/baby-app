"use server";

import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import { pumpingSchema } from "@/features/pumping/pumping";
import { requireUser } from "@/lib/auth";
import { zonedDateTimeToUtc } from "@/lib/date";
import { db } from "@/lib/db";

export async function savePumpingAction(formData: FormData) {
  const user = await requireUser();
  const mother = await db.mother.findUnique({ where: { userId: user.id }, select: { id: true } });
  if (!mother) throw new Error("Mother not found");
  const { id, ...data } = pumpingSchema.parse({
    ...Object.fromEntries(formData),
    startTime: zonedDateTimeToUtc(String(formData.get("startTime") ?? ""), user.timezone),
  });
  if (id) {
    const result = await db.pumpingEntry.updateMany({
      where: { id, motherId: mother.id, isRunning: false },
      data: { ...data, durationMinutes: data.durationMinutes ?? null, leftAmountMl: data.leftAmountMl ?? null, rightAmountMl: data.rightAmountMl ?? null, notes: data.notes ?? null },
    });
    if (!result.count) throw new Error("Pumping entry not found");
  } else {
    await db.pumpingEntry.create({ data: { ...data, motherId: mother.id } });
  }
  revalidatePath("/mother/pumping");
  redirect("/mother/pumping", RedirectType.replace);
}

export async function deletePumpingAction(formData: FormData) {
  const user = await requireUser();
  await db.pumpingEntry.deleteMany({
    where: { id: String(formData.get("id") ?? ""), mother: { userId: user.id } },
  });
  revalidatePath("/mother/pumping");
  redirect("/mother/pumping", RedirectType.replace);
}


export async function startPumpingTimerAction() {
  const user = await requireUser();
  const mother = await db.mother.findUnique({ where: { userId: user.id }, select: { id: true } });
  if (!mother) throw new Error("Mother not found");
  // The partial unique index also prevents concurrent starts on two devices.
  await db.pumpingEntry.createMany({
    data: [{ motherId: mother.id, startTime: new Date(), isRunning: true }],
    skipDuplicates: true,
  });
  revalidatePath("/mother/pumping");
}

export async function finishPumpingTimerAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const open = await db.pumpingEntry.findFirst({
    where: { id, isRunning: true, mother: { userId: user.id } },
  });
  if (!open) return;
  const durationMinutes = Math.max(1, Math.round((Date.now() - open.startTime.getTime()) / 60_000));
  const result = await db.pumpingEntry.updateMany({
    where: { id: open.id, isRunning: true, mother: { userId: user.id } },
    data: { isRunning: false, durationMinutes },
  });
  revalidatePath("/mother/pumping");
  if (result.count) redirect(`/mother/pumping?edit=${open.id}`, RedirectType.replace);
}
