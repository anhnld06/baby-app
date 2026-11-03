"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { toDateTimeLocal } from "@/lib/date";
import { pregnancyMeasurementSchema, trackingSessionSchema } from "./tracking-validation";

export async function saveTrackingSession(input: unknown) {
  const user = await requireUser();
  const parsed = trackingSessionSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { pregnancyId, clientId, kind, events, startedAt, endedAt, notes } = parsed.data;
  const pregnancy = await db.pregnancy.findFirst({ where: { id: pregnancyId, mother: { userId: user.id } } });
  if (!pregnancy || pregnancy.pregnancyStatus !== "PREGNANT") return { error: "Chỉ bắt đầu phiên theo dõi cho thai kỳ đang mang thai." };
  const data = { kind, events, startedAt: new Date(startedAt), endedAt: new Date(endedAt), notes };
  await db.pregnancyTrackingSession.upsert({ where: { pregnancyId_clientId: { pregnancyId, clientId } }, create: { ...data, pregnancyId, clientId }, update: data });
  revalidatePath("/mother/pregnancy", "layout");
  return { error: "" };
}

export async function savePregnancyMeasurement(_state: { error: string; saved: boolean }, form: FormData) {
  const user = await requireUser();
  const parsed = pregnancyMeasurementSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message, saved: false };
  const { pregnancyId, measuredOn, weightKg, bellyCm, notes } = parsed.data;
  if (measuredOn > toDateTimeLocal(new Date(), user.timezone).slice(0, 10)) return { error: "Ngày đo không thể ở tương lai.", saved: false };
  const pregnancy = await db.pregnancy.findFirst({ where: { id: pregnancyId, mother: { userId: user.id } }, select: { id: true } });
  if (!pregnancy) return { error: "Không tìm thấy thai kỳ của bạn.", saved: false };
  const date = new Date(`${measuredOn}T00:00:00Z`);
  const data = { weightKg: weightKg ?? null, bellyCm: bellyCm ?? null, notes: notes || null };
  await db.pregnancyMeasurement.upsert({ where: { pregnancyId_measuredOn: { pregnancyId, measuredOn: date } }, create: { ...data, pregnancyId, measuredOn: date }, update: data });
  revalidatePath("/mother/pregnancy", "layout");
  return { error: "", saved: true };
}

export async function deletePregnancyTrackingRecord(form: FormData) {
  const user = await requireUser();
  const id = String(form.get("id") ?? "");
  const where = { id, pregnancy: { mother: { userId: user.id } } };
  if (form.get("recordType") === "measurement") await db.pregnancyMeasurement.deleteMany({ where });
  else await db.pregnancyTrackingSession.deleteMany({ where });
  revalidatePath("/mother/pregnancy", "layout");
}
