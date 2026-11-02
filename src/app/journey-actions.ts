"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const settingsSchema = z
  .object({
    method: z.enum(["AUTO", "EASY3", "EASY35", "EASY4", "CUSTOM"]),
    dayStart: time,
    dayEnd: time,
    feedingMinutes: z.coerce.number().int().min(5).max(120),
    awakeMinutes: z.coerce.number().int().min(5).max(360),
    sleepMinutes: z.coerce.number().int().min(10).max(360),
  })
  .refine((v) => v.dayStart < v.dayEnd, {
    message: "Giờ kết thúc phải sau giờ bắt đầu",
  });
export async function saveRoutineSettingsAction(form: FormData) {
  const user = await requireUser();
  const babyId = String(form.get("babyId") ?? "");
  if (
    !(await db.baby.findFirst({
      where: { id: babyId, userId: user.id },
      select: { id: true },
    }))
  )
    throw new Error("Không tìm thấy bé");
  const fields = settingsSchema.parse(Object.fromEntries(form));
  const data = { ...fields, adaptToLogs: form.get("adaptToLogs") === "on" };
  await db.babyRoutineSettings.upsert({
    where: { babyId },
    create: { babyId, ...data },
    update: data,
  });
  revalidatePath("/", "layout");
  redirect("/baby/routine?saved=1");
}
export async function markNotificationsReadAction(form: FormData) {
  const user = await requireUser();
  const keys = form
    .getAll("key")
    .filter(
      (key): key is string => typeof key === "string" && key.length <= 200,
    )
    .slice(0, 100);
  await db.notificationRead.createMany({
    data: [...new Set(keys)].map((key) => ({ userId: user.id, key })),
    skipDuplicates: true,
  });
  revalidatePath("/", "layout");
}

export async function saveEpisodeAction(form: FormData) {
  const user = await requireUser();
  const babyId = String(form.get("babyId") ?? "");
  if (
    !(await db.baby.findFirst({
      where: { id: babyId, userId: user.id },
      select: { id: true },
    }))
  )
    throw new Error("Không tìm thấy bé");
  const title = z
    .enum(["Đợt quấy khóc", "Thay đổi giấc ngủ"])
    .parse(form.get("title"));
  const { zonedDateTimeToUtc, toDateTimeLocal } = await import("@/lib/date");
  const parse = (key: string) => {
    const value = String(form.get(key) ?? "");
    if (!value) return null;
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))
      throw new Error("Thời điểm không hợp lệ");
    const date = zonedDateTimeToUtc(value, user.timezone);
    if (
      !Number.isFinite(date.getTime()) ||
      toDateTimeLocal(date, user.timezone) !== value
    )
      throw new Error("Thời điểm không hợp lệ");
    return date;
  };
  const occurredAt = parse("occurredAt");
  const endedAt = parse("endedAt");
  const expectedEndAt = parse("expectedEndAt");
  if (
    !occurredAt ||
    occurredAt > new Date() ||
    (endedAt && (endedAt < occurredAt || endedAt > new Date())) ||
    (expectedEndAt && expectedEndAt < occurredAt)
  )
    throw new Error(
      "Ngày kết thúc phải sau ngày bắt đầu; ngày thực tế không ở tương lai",
    );
  const details = z
    .string()
    .max(4000)
    .parse(form.get("details") ?? "");
  const id = String(form.get("id") ?? "");
  if (id) {
    const result = await db.babyCareEntry.updateMany({
      where: { id, babyId, kind: "EPISODE" },
      data: { title, occurredAt, endedAt, expectedEndAt, details },
    });
    if (!result.count) throw new Error("Không tìm thấy đợt theo dõi");
  } else
    await db.babyCareEntry.create({
      data: {
        babyId,
        kind: "EPISODE",
        title,
        occurredAt,
        endedAt,
        expectedEndAt,
        details,
      },
    });
  revalidatePath("/", "layout");
  redirect("/baby/development?saved=1");
}
export async function endEpisodeAction(form: FormData) {
  const user = await requireUser();
  const id = String(form.get("id") ?? "");
  await db.babyCareEntry.updateMany({
    where: {
      id,
      baby: { userId: user.id },
      kind: "EPISODE",
      endedAt: null,
      occurredAt: { lte: new Date() },
    },
    data: { endedAt: new Date() },
  });
  revalidatePath("/", "layout");
}
export async function deleteEpisodeAction(form: FormData) {
  const user = await requireUser();
  await db.babyCareEntry.deleteMany({
    where: {
      id: String(form.get("id") ?? ""),
      baby: { userId: user.id },
      kind: "EPISODE",
    },
  });
  revalidatePath("/", "layout");
  redirect("/baby/development");
}
export async function wakeBabyAction(form: FormData) {
  const user = await requireUser();
  const babyId = String(form.get("babyId") ?? "");
  if (
    !(await db.baby.findFirst({
      where: { id: babyId, userId: user.id },
      select: { id: true },
    }))
  )
    throw new Error("Không tìm thấy bé");
  const now = new Date();
  const result = await db.sleepEntry.updateMany({
    where: { babyId, endTime: null },
    data: { endTime: now },
  });
  if (!result.count)
    await db.babyCareEntry.create({
      data: { babyId, kind: "WAKE", title: "Thức giấc", occurredAt: now },
    });
  revalidatePath("/", "layout");
  redirect("/baby/routine");
}
