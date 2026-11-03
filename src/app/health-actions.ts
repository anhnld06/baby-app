"use server";
import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { toDateTimeLocal, zonedDateTimeToUtc } from "@/lib/date";
import { doseSchema, medicationSchema, scheduledOn, temperatureSchema } from "@/features/health/validation";
import { ageMonthsOn, matchesSupplement, supplementTopics } from "@/features/health/supplements";

async function ownedBaby(form: FormData) {
  const user = await requireUser();
  const babyId = String(form.get("babyId") ?? "");
  if (!await db.baby.findFirst({ where: { id: babyId, userId: user.id }, select: { id: true } })) throw new Error("Không tìm thấy hồ sơ bé");
  return { user, babyId };
}
function refresh() { revalidatePath("/", "layout"); }
export async function saveTemperatureAction(form: FormData) {
  const { user, babyId } = await ownedBaby(form);
  const fields = temperatureSchema.parse(Object.fromEntries(form));
  const measuredAt = zonedDateTimeToUtc(fields.measuredAt, user.timezone);
  if (!Number.isFinite(measuredAt.getTime()) || toDateTimeLocal(measuredAt, user.timezone) !== fields.measuredAt || measuredAt > new Date()) throw new Error("Thời điểm đo không hợp lệ hoặc ở tương lai");
  const id = String(form.get("id") ?? "");
  const data = { ...fields, measuredAt };
  if (id) {
    const result = await db.temperatureEntry.updateMany({ where: { id, babyId }, data });
    if (!result.count) throw new Error("Không tìm thấy lần đo");
  } else await db.temperatureEntry.create({ data: { babyId, ...data } });
  refresh(); redirect("/tracking/temperature?saved=1", RedirectType.replace);
}
export async function deleteTemperatureAction(form: FormData) {
  const user = await requireUser();
  await db.temperatureEntry.deleteMany({ where: { id: String(form.get("id") ?? ""), baby: { userId: user.id } } });
  refresh(); redirect("/tracking/temperature", RedirectType.replace);
}
export async function saveMedicationAction(form: FormData) {
  const { user, babyId } = await ownedBaby(form);
  const fields = medicationSchema.parse(Object.fromEntries(form));
  if (form.get("preset")) {
    const baby = await db.baby.findUniqueOrThrow({ where: { id: babyId }, select: { dateOfBirth: true } });
    const today = toDateTimeLocal(new Date(), user.timezone).slice(0, 10);
    const topic = supplementTopics(ageMonthsOn(baby.dateOfBirth, today)).find(item => item.id === form.get("preset"));
    if (!topic || fields.name !== topic.name || form.get("confirmed") !== "on" || fields.startDate !== today) throw new Error("Hãy xác nhận hướng dẫn sử dụng phù hợp trước khi tạo lịch bổ sung.");
    const schedules = await db.medicationSchedule.findMany({ where: { babyId }, select: { id: true, name: true } });
    const existing = schedules.find(schedule => matchesSupplement(schedule.name, topic));
    if (existing) redirect(`/tracking/medication?edit=${existing.id}&baby=${encodeURIComponent(babyId)}`, RedirectType.replace);
  }
  const id = String(form.get("id") ?? "");
  const data = { ...fields, startDate: new Date(`${fields.startDate}T00:00Z`), endDate: fields.endDate ? new Date(`${fields.endDate}T00:00Z`) : null, active: form.get("active") === "on" };
  if (id) {
    const result = await db.medicationSchedule.updateMany({ where: { id, babyId }, data });
    if (!result.count) throw new Error("Không tìm thấy lịch thuốc");
  } else await db.medicationSchedule.create({ data: { ...data, babyId } });
  refresh(); redirect(`/tracking/medication?saved=1&baby=${encodeURIComponent(babyId)}`, RedirectType.replace);
}
export async function deleteMedicationAction(form: FormData) {
  const user = await requireUser();
  await db.medicationSchedule.deleteMany({ where: { id: String(form.get("id") ?? ""), baby: { userId: user.id } } });
  refresh(); redirect("/tracking/medication", RedirectType.replace);
}
export async function setMedicationTakenAction(form: FormData) {
  const user = await requireUser();
  const fields = doseSchema.parse(Object.fromEntries(form));
  const scheduleId = String(form.get("scheduleId") ?? "");
  const schedule = await db.medicationSchedule.findFirst({ where: { id: scheduleId, baby: { userId: user.id } } });
  const today = toDateTimeLocal(new Date(), user.timezone).slice(0, 10);
  if (!schedule || !scheduledOn(schedule, fields.day) || !schedule.times.includes(fields.time) || fields.day > today) throw new Error("Cữ thuốc không hợp lệ");
  const key = { scheduleId, day: new Date(`${fields.day}T00:00Z`), time: fields.time };
  if (fields.taken === "true") await db.medicationDose.upsert({ where: { scheduleId_day_time: key }, create: key, update: {} });
  else await db.medicationDose.deleteMany({ where: key });
  refresh();
}
