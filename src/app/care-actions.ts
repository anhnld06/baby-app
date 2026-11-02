"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { zonedDateTimeToUtc, toDateTimeLocal } from "@/lib/date";
import { careSections, isCareSection } from "@/features/care/config";
import { MILESTONES } from "@/features/journey/milestones";
import { careSchema } from "@/features/care/validation";

async function scope(form: FormData) {
  const user = await requireUser();
  const babyId = String(form.get("babyId") ?? "");
  const section = String(form.get("section") ?? "");
  if (!isCareSection(section)) throw new Error("Mục không hợp lệ");
  if (
    !(await db.baby.findFirst({
      where: { id: babyId, userId: user.id },
      select: { id: true },
    }))
  )
    throw new Error("Không tìm thấy hồ sơ bé");
  return { user, babyId, section, kind: careSections[section].kind };
}
export async function saveCareAction(form: FormData) {
  const { user, babyId, section, kind } = await scope(form);
  const fields = careSchema.parse(Object.fromEntries(form));
  const local = String(form.get("occurredAt") ?? "");
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local))
    throw new Error("Thời điểm không hợp lệ");
  const occurredAt = zonedDateTimeToUtc(local, user.timezone);
  if (
    !Number.isFinite(occurredAt.getTime()) ||
    toDateTimeLocal(occurredAt, user.timezone) !== local
  )
    throw new Error("Thời điểm không hợp lệ");
  if (kind !== "ROUTINE" && occurredAt > new Date())
    throw new Error("Nhật ký thực tế không thể ở tương lai");
  const id = String(form.get("id") ?? "");
  const existing = id
    ? await db.babyCareEntry.findFirst({
        where: { id, babyId, kind },
        select: { id: true },
      })
    : null;
  if (id && !existing) throw new Error("Không tìm thấy bản ghi");
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
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    )
      throw new Error("Ảnh cần là JPG, PNG hoặc WebP dưới 500 KB");
    const bytes = new Uint8Array(await file.arrayBuffer());
    const valid =
      file.type === "image/jpeg"
        ? bytes[0] === 255 && bytes[1] === 216
        : file.type === "image/png"
          ? bytes[0] === 137 &&
            bytes[1] === 80 &&
            bytes[2] === 78 &&
            bytes[3] === 71
          : new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" &&
            new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
    if (!valid) throw new Error("Nội dung ảnh không hợp lệ");
    photo = { photoData: bytes, photoMime: file.type };
  }
  const milestoneKey = kind === "MILESTONE" ? String(form.get("milestoneKey") ?? "") || null : null;
  if (milestoneKey && !MILESTONES.some(m => m.key === milestoneKey)) throw new Error("Huy hiệu không hợp lệ");
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
  if (id) await db.babyCareEntry.update({ where: { id }, data });
  else if (milestoneKey) await db.babyCareEntry.upsert({ where: { babyId_milestoneKey: { babyId, milestoneKey } }, create: { ...data, babyId, kind }, update: data });
  else await db.babyCareEntry.create({ data: { ...data, babyId, kind } });
  revalidatePath("/", "layout");
  redirect(
    `/baby/${section}?saved=1${kind === "ROUTINE" ? `&day=${local.slice(0, 10)}` : ""}`,
  );
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
  if (section !== "routine") throw new Error("Mục không hợp lệ");
  const id = String(form.get("id"));
  await db.babyCareEntry.updateMany({
    where: { id, babyId, kind },
    data: { completed: form.get("completed") === "true" },
  });
  revalidatePath("/baby/routine");
}
