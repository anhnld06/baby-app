"use server";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { toDateTimeLocal, zonedDateTimeToUtc } from "@/lib/date";
import { MAX_MEMORY_MEDIA, MEMORY_FRAMES, validMemoryMedia } from "@/features/mailbox/memories";

export async function saveMemoryAction(_state: { error?: string; saved?: boolean }, form: FormData): Promise<{ error?: string; saved?: boolean }> {
  const user = await requireUser();
  const babyId = String(form.get("babyId") ?? "");
  if (!await db.baby.findFirst({ where: { id: babyId, userId: user.id }, select: { id: true } })) return { error: "Không tìm thấy hồ sơ bé." };
  const title = String(form.get("title") ?? "").trim();
  const letter = String(form.get("letter") ?? "").trim();
  const frame = String(form.get("frame") ?? "");
  const local = String(form.get("occurredAt") ?? "");
  if (!title || title.length > 120 || letter.length > 6000 || !MEMORY_FRAMES.some(f => f.key === frame)) return { error: "Hãy nhập tên kỷ niệm (tối đa 120 ký tự), thư tối đa 6.000 ký tự và chọn khung tem." };
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local)) return { error: "Ngày kỷ niệm không hợp lệ." };
  const occurredAt = zonedDateTimeToUtc(local, user.timezone);
  if (!Number.isFinite(occurredAt.getTime()) || toDateTimeLocal(occurredAt, user.timezone) !== local || occurredAt > new Date()) return { error: "Hãy chọn ngày có thật và không ở tương lai." };
  let mediaData: Uint8Array<ArrayBuffer> | null = null;
  let mediaMime: string | null = null;
  const file = form.get("media");
  if (file instanceof File && file.size) {
    if (file.size > MAX_MEMORY_MEDIA) return { error: "Ảnh/video cần nhỏ hơn hoặc bằng 10 MB." };
    mediaData = new Uint8Array(await file.arrayBuffer());
    mediaMime = file.type.split(";")[0];
    if (!validMemoryMedia(mediaData, mediaMime)) return { error: "Chọn ảnh JPG, PNG, WebP hoặc video MP4, MOV, WebM hợp lệ." };
  }
  if (!mediaData && !letter) return { error: "Thêm ảnh/video hoặc viết một lời nhắn cho con nhé." };
  await db.babyMemory.create({ data: { babyId, title, letter, frame, occurredAt, mediaData, mediaMime } });
  revalidatePath("/baby/mailbox");
  return { saved: true };
}
export async function deleteMemoryAction(form: FormData) {
  const user = await requireUser();
  await db.babyMemory.deleteMany({ where: { id: String(form.get("id") ?? ""), baby: { userId: user.id } } });
  revalidatePath("/baby/mailbox");
}
