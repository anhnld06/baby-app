"use server";

import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { activeFeedingWhere } from "@/features/timeline/active-feeding";

async function ownedBabyId(formData: FormData) {
  const user = await requireUser();
  const babyId = String(formData.get("babyId") ?? "");
  const baby = await db.baby.findFirst({
    where: { id: babyId, userId: user.id },
    select: { id: true },
  });
  if (!baby) throw new Error("Baby not found");
  return { babyId: baby.id, timeZone: user.timezone };
}

function refreshTracking() {
  revalidatePath("/");
  revalidatePath("/tracking/feeding");
  revalidatePath("/tracking/sleep");
  revalidatePath("/activity");
}

export async function startFeedingTimerAction(formData: FormData) {
  const { babyId } = await ownedBabyId(formData);
  const open = await db.feeding.findFirst({ where: { babyId, ...activeFeedingWhere }, select: { id: true } });
  if (!open) {
    await db.feeding.create({
      data: { babyId, type: "BREASTFEEDING", startTime: new Date() },
    });
  }
  refreshTracking();
}

export async function finishFeedingTimerAction(formData: FormData) {
  const { babyId } = await ownedBabyId(formData);
  const open = await db.feeding.findFirst({
    where: { babyId, ...activeFeedingWhere },
    orderBy: { startTime: "desc" },
    select: { id: true },
  });
  if (!open) return;
  const result = await db.feeding.updateMany({
    where: { id: open.id, babyId, ...activeFeedingWhere },
    data: { endTime: new Date() },
  });
  refreshTracking();
  if (result.count) {
    (await cookies()).set("selectedBabyId", babyId, { sameSite: "lax", path: "/", maxAge: 31_536_000 });
    redirect(`/tracking/feeding?edit=${open.id}`, RedirectType.replace);
  }
}

export async function startSleepTimerAction(formData: FormData) {
  const { babyId, timeZone } = await ownedBabyId(formData);
  const open = await db.sleepEntry.findFirst({ where: { babyId, endTime: null }, select: { id: true } });
  if (!open) {
    const hour = Number(new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "numeric",
      hourCycle: "h23",
    }).format(new Date()));
    await db.sleepEntry.create({
      data: { babyId, type: hour >= 18 || hour < 6 ? "NIGHT" : "NAP", startTime: new Date() },
    });
  }
  refreshTracking();
}

export async function finishSleepTimerAction(formData: FormData) {
  const { babyId } = await ownedBabyId(formData);
  const open = await db.sleepEntry.findFirst({
    where: { babyId, endTime: null },
    orderBy: { startTime: "desc" },
    select: { id: true },
  });
  if (open) await db.sleepEntry.update({ where: { id: open.id }, data: { endTime: new Date() } });
  refreshTracking();
}
