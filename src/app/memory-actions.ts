"use server";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { toDateTimeLocal, zonedDateTimeToUtc } from "@/lib/date";
import { MILESTONES } from "@/features/journey/milestones";
import { isMemoryMediaType, MAX_MEMORY_MEDIA, MEMORY_FRAMES, MEMORY_MEDIA_TOO_LARGE, MEMORY_MEDIA_UNSUPPORTED, sniffMemoryMediaType, validMemoryMedia } from "@/features/mailbox/memories";

const FUTURE_GRACE_MS = 5 * 60_000;

export async function saveMemoryAction(_state: { error?: string; saved?: boolean }, form: FormData): Promise<{ error?: string; saved?: boolean }> {
  const user = await requireUser();
  const babyId = String(form.get("babyId") ?? "");
  if (!await db.baby.findFirst({ where: { id: babyId, userId: user.id }, select: { id: true } })) return { error: "Không tìm thấy hồ sơ bé." };
  const title = String(form.get("title") ?? "").trim();
  const letter = String(form.get("letter") ?? "").trim();
  const frame = String(form.get("frame") ?? "");
  const milestoneKey = String(form.get("milestoneKey") ?? "") || null;
  if (milestoneKey && !MILESTONES.some(m => m.key === milestoneKey)) return { error: "Mốc phát triển không hợp lệ." };
  // Some mobile pickers submit seconds ("…T08:00:00"); the memory keeps minute precision.
  const local = String(form.get("occurredAt") ?? "").trim().replace(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(?::\d{2}(?:\.\d{1,3})?)?$/, "$1");
  if (!title || title.length > 120 || letter.length > 6000 || !MEMORY_FRAMES.some(f => f.key === frame)) return { error: "Hãy nhập tên kỷ niệm (tối đa 120 ký tự), thư tối đa 6.000 ký tự và chọn khung tem." };
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local)) return { error: "Ngày kỷ niệm không hợp lệ." };
  const occurredAt = zonedDateTimeToUtc(local, user.timezone);
  // A few minutes of grace: the phone's clock may run slightly ahead of the server's.
  if (!Number.isFinite(occurredAt.getTime()) || toDateTimeLocal(occurredAt, user.timezone) !== local || occurredAt.getTime() > Date.now() + FUTURE_GRACE_MS) return { error: "Hãy chọn ngày có thật và không ở tương lai." };
  let mediaData: Uint8Array<ArrayBuffer> | null = null;
  let mediaMime: string | null = null;
  const file = form.get("media");
  if (file instanceof File && file.size) {
    if (file.size > MAX_MEMORY_MEDIA) return { error: MEMORY_MEDIA_TOO_LARGE };
    mediaMime = file.type.split(";")[0].trim().toLowerCase();
    const untyped = !mediaMime || mediaMime === "application/octet-stream";
    if (!untyped && !isMemoryMediaType(mediaMime)) return { error: MEMORY_MEDIA_UNSUPPORTED };
    mediaData = new Uint8Array(await file.arrayBuffer());
    if (untyped) mediaMime = sniffMemoryMediaType(mediaData);
    if (!mediaMime || !validMemoryMedia(mediaData, mediaMime)) return { error: MEMORY_MEDIA_UNSUPPORTED };
  }
  if (!mediaData && !letter) return { error: "Thêm ảnh/video hoặc viết một lời nhắn cho con nhé." };
  try {
    await db.babyMemory.create({ data: { babyId, title, letter, frame, milestoneKey, occurredAt, mediaData, mediaMime } });
  } catch (error) {
    console.error("saveMemoryAction: could not store memory", error);
    return { error: "Chưa lưu được thư do lỗi máy chủ. Hãy thử lại sau ít phút nhé." };
  }
  revalidatePath("/baby/mailbox");
  revalidatePath("/baby/milestones");
  return { saved: true };
}
export async function deleteMemoryAction(form: FormData) {
  const user = await requireUser();
  await db.babyMemory.deleteMany({ where: { id: String(form.get("id") ?? ""), baby: { userId: user.id } } });
  revalidatePath("/baby/mailbox");
  revalidatePath("/baby/milestones");
}

export async function updateMemoryMilestoneAction(form: FormData) {
  const user = await requireUser();
  const milestoneKey = String(form.get("milestoneKey") ?? "") || null;
  if (milestoneKey && !MILESTONES.some(m => m.key === milestoneKey)) throw new Error("Mốc phát triển không hợp lệ.");
  await db.babyMemory.updateMany({
    where: { id: String(form.get("id") ?? ""), baby: { userId: user.id } },
    data: { milestoneKey },
  });
  revalidatePath("/baby/mailbox");
  revalidatePath("/baby/milestones");
}
