"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { zonedDateTimeToUtc, toDateTimeLocal } from "@/lib/date";
import {
  ActionError,
  assertUpdated,
  captureActionError,
  isUniqueViolation,
  parseInput,
  type ActionResult,
} from "@/lib/action-result";
import { careSections, isCareSection } from "@/features/care/config";
import { MILESTONES } from "@/features/journey/milestones";
import { careSchema } from "@/features/care/validation";
import { hasExpectedSignature, isImageMimeType } from "@/lib/upload";

async function scope(form: FormData) {
  const user = await requireUser();
  const babyId = String(form.get("babyId") ?? "");
  const section = String(form.get("section") ?? "");
  if (!isCareSection(section)) throw new ActionError("Mục không hợp lệ");
  if (
    !(await db.baby.findFirst({
      where: { id: babyId, userId: user.id },
      select: { id: true },
    }))
  )
    throw new ActionError("Không tìm thấy hồ sơ bé");
  return { user, babyId, section, kind: careSections[section].kind };
}
export async function saveCareAction(form: FormData): Promise<ActionResult> {
  let target = "";
  const failure = await captureActionError(async () => {
    const { user, babyId, section, kind } = await scope(form);
    const fields = parseInput(careSchema, Object.fromEntries(form));
    const local = String(form.get("occurredAt") ?? "");
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local))
      throw new ActionError("Thời điểm không hợp lệ");
    const occurredAt = zonedDateTimeToUtc(local, user.timezone);
    if (
      !Number.isFinite(occurredAt.getTime()) ||
      toDateTimeLocal(occurredAt, user.timezone) !== local
    )
      throw new ActionError("Thời điểm không hợp lệ");
    if (kind !== "ROUTINE" && occurredAt > new Date())
      throw new ActionError("Nhật ký thực tế không thể ở tương lai");
    const id = String(form.get("id") ?? "");
    let photo: {
      photoData?: Uint8Array<ArrayBuffer> | null;
      photoMime?: string | null;
    } = {};
    if (form.get("removePhoto") === "on")
      photo = { photoData: null, photoMime: null };
    const file = form.get("photo");
    if (kind === "MILESTONE" && file instanceof File && file.size) {
      if (
        file.size > 500 * 1024 ||
        !isImageMimeType(file.type)
      )
        throw new ActionError("Ảnh cần là JPG, PNG hoặc WebP dưới 500 KB");
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (!hasExpectedSignature(bytes, file.type)) throw new ActionError("Nội dung ảnh không hợp lệ");
      photo = { photoData: bytes, photoMime: file.type };
    }
    const milestoneKey = kind === "MILESTONE" ? String(form.get("milestoneKey") ?? "") || null : null;
    if (milestoneKey && !MILESTONES.some(m => m.key === milestoneKey)) throw new ActionError("Huy hiệu không hợp lệ");
    const data = {
      milestoneKey,
      ...fields,
      occurredAt,
      amount: kind === "MEAL" ? fields.amount : null,
      mood: kind === "WELLBEING" ? fields.mood : null,
      symptoms: kind === "WELLBEING" ? fields.symptoms : null,
      durationMinutes: kind === "ROUTINE" ? fields.durationMinutes : null,
      ...photo,
    };
    try {
      // Scoped to the baby and section: an entry deleted on the other phone
      // (or one from another section) is reported instead of silently skipped.
      if (id) assertUpdated(await db.babyCareEntry.updateMany({ where: { id, babyId, kind }, data }));
      else if (milestoneKey) await db.babyCareEntry.upsert({ where: { babyId_milestoneKey: { babyId, milestoneKey } }, create: { ...data, babyId, kind }, update: data });
      else await db.babyCareEntry.create({ data: { ...data, babyId, kind } });
    } catch (error) {
      // Editing an entry onto a badge another entry already holds.
      if (isUniqueViolation(error))
        throw new ActionError("Huy hiệu này đã được ghi cho bé ở một bản ghi khác. Hãy mở bản ghi đó để sửa.");
      throw error;
    }
    target = `/baby/${section}?saved=1${kind === "ROUTINE" ? `&day=${local.slice(0, 10)}` : ""}`;
  });
  if (failure) return failure;
  revalidatePath("/", "layout");
  redirect(target);
}
export async function deleteCareAction(form: FormData) {
  const { babyId, section, kind } = await scope(form);
  await db.babyCareEntry.deleteMany({
    where: { id: String(form.get("id")), babyId, kind },
  });
  revalidatePath("/", "layout");
  redirect(`/baby/${section}`);
}
export async function toggleRoutineAction(form: FormData) {
  const { babyId, kind, section } = await scope(form);
  if (section !== "routine") throw new ActionError("Mục không hợp lệ");
  const id = String(form.get("id"));
  await db.babyCareEntry.updateMany({
    where: { id, babyId, kind },
    data: { completed: form.get("completed") === "true" },
  });
  revalidatePath("/baby/routine");
}
