"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { pregnancyJournalSchema } from "./journal-validation";

export async function savePregnancyJournal(_state: { error: string }, form: FormData) {
  const user = await requireUser();
  const parsed = pregnancyJournalSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { id, occurredOn, ...data } = parsed.data;
  const pregnancy = await db.pregnancy.findFirst({ where: { id: data.pregnancyId, mother: { userId: user.id } }, select: { id: true } });
  if (!pregnancy) return { error: "Không tìm thấy thai kỳ của bạn." };
  const entry = { ...data, occurredOn: new Date(`${occurredOn}T00:00:00Z`) };
  let savedId = id;
  if (id) {
    const result = await db.pregnancyJournalEntry.updateMany({ where: { id, pregnancyId: pregnancy.id, kind: data.kind }, data: entry });
    if (!result.count) return { error: "Không tìm thấy ghi chép để cập nhật." };
  } else {
    const record = await db.pregnancyJournalEntry.create({ data: entry });
    savedId = record.id;
  }
  revalidatePath("/mother/pregnancy", "layout");
  redirect(`/mother/pregnancy/${data.kind === "HEALTH" ? "health/journal" : "memories"}?saved=${encodeURIComponent(savedId!)}`);
}

export async function deletePregnancyJournal(form: FormData) {
  const user = await requireUser();
  await db.pregnancyJournalEntry.deleteMany({ where: { id: String(form.get("id") ?? ""), pregnancy: { mother: { userId: user.id } } } });
  revalidatePath("/mother/pregnancy", "layout");
}
