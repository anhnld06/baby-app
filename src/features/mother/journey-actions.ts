"use server";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { journeyTaskSchema } from "./journey-tasks";

export async function saveJourneyTask(_state: { error: string; saved: boolean }, form: FormData) {
  const user = await requireUser();
  const parsed = journeyTaskSchema.safeParse({ ...Object.fromEntries(form), done: form.get("done") === "on" });
  if (!parsed.success) return { error: parsed.error.issues[0].message, saved: false };
  const { pregnancyId, taskKey, remindOn, ...values } = parsed.data;
  const pregnancy = await db.pregnancy.findFirst({ where: { id: pregnancyId, mother: { userId: user.id } } });
  if (!pregnancy) return { error: "Không tìm thấy thai kỳ của bạn.", saved: false };
  if (remindOn && pregnancy.pregnancyStatus !== "PREGNANT") return { error: "Thai kỳ đã lưu chỉ xem lại, không đặt nhắc mới.", saved: false };
  const data = { ...values, remindOn: remindOn ? new Date(`${remindOn}T00:00:00Z`) : null };
  await db.pregnancyJourneyTask.upsert({ where: { pregnancyId_taskKey: { pregnancyId, taskKey } }, create: { pregnancyId, taskKey, ...data }, update: data });
  revalidatePath("/mother/pregnancy", "layout");
  return { error: "", saved: true };
}
