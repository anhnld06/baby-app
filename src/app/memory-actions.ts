"use server";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { toDateTimeLocal, zonedDateTimeToUtc } from "@/lib/date";
import { MILESTONES } from "@/features/journey/milestones";
import { isMemoryMediaKey, isMemoryMediaType, MAX_MEMORY_MEDIA, MEMORY_DIRECT_VIDEO_TOO_LARGE, MEMORY_FRAMES, MEMORY_MEDIA_TOO_LARGE, MEMORY_MEDIA_UNSUPPORTED, MEMORY_UPLOAD_FAILED, memoryMediaExtension, memoryMediaKeyPrefix, memoryMediaLimit, sniffMemoryMediaType, validMemoryMedia } from "@/features/mailbox/memories";
import { deleteObject, headObject, presignUpload, objectStorageConfigured, readObjectStart } from "@/lib/object-storage";

const FUTURE_GRACE_MS = 5 * 60_000;
/** Enough bytes for every file signature we check (WebP needs 12, MP4/MOV 8). */
const SIGNATURE_BYTES = 16;

export type MemoryUploadTicket =
  | { mode: "direct"; key: string; url: string; headers: Record<string, string> }
  | { mode: "inline" }
  | { error: string };

async function ownedBaby(userId: string, babyId: string) {
  return db.baby.findFirst({ where: { id: babyId, userId }, select: { id: true } });
}

/**
 * Step 1 of a direct upload: returns a presigned link for exactly this type and size. Without
 * object storage the composer falls back to sending the file inside the Server Action (≤ 4 MB).
 */
export async function prepareMemoryUploadAction(babyId: string, mime: string, size: number): Promise<MemoryUploadTicket> {
  const user = await requireUser();
  if (!await ownedBaby(user.id, String(babyId))) return { error: "Không tìm thấy hồ sơ bé." };
  if (!objectStorageConfigured()) return { mode: "inline" };
  const type = String(mime).split(";")[0].trim().toLowerCase();
  if (!isMemoryMediaType(type)) return { error: MEMORY_MEDIA_UNSUPPORTED };
  const kind = type.startsWith("video/") ? "video" : "image";
  if (!Number.isSafeInteger(size) || size <= 0) return { error: MEMORY_MEDIA_UNSUPPORTED };
  if (size > memoryMediaLimit(kind, true)) return { error: kind === "video" ? MEMORY_DIRECT_VIDEO_TOO_LARGE : MEMORY_MEDIA_TOO_LARGE };
  const key = `${memoryMediaKeyPrefix(babyId)}${randomBytes(18).toString("base64url")}.${memoryMediaExtension(type)}`;
  try {
    const upload = await presignUpload(key, type, size);
    return { mode: "direct", key, ...upload };
  } catch (error) {
    console.error("prepareMemoryUploadAction: could not sign upload", error);
    return { error: MEMORY_UPLOAD_FAILED };
  }
}

/** Removes an uploaded object that will not be saved; failures are only logged. */
async function discardUpload(key: string) {
  await deleteObject(key).catch(error => console.error("memory upload cleanup failed", key, error));
}

type StoredMedia = { mediaKey: string; mediaMime: string; mediaSize: number };

/** Confirms a direct upload exists, fits the limit and really is the declared photo/video. */
async function verifyUploadedMedia(key: string): Promise<StoredMedia | { error: string }> {
  const info = await headObject(key);
  if (!info) return { error: MEMORY_UPLOAD_FAILED };
  const mime = (info.contentType ?? "").split(";")[0].trim().toLowerCase();
  if (!isMemoryMediaType(mime)) return { error: MEMORY_MEDIA_UNSUPPORTED };
  const kind = mime.startsWith("video/") ? "video" : "image";
  if (info.size > memoryMediaLimit(kind, true)) return { error: kind === "video" ? MEMORY_DIRECT_VIDEO_TOO_LARGE : MEMORY_MEDIA_TOO_LARGE };
  if (!validMemoryMedia(await readObjectStart(key, SIGNATURE_BYTES), mime)) return { error: MEMORY_MEDIA_UNSUPPORTED };
  return { mediaKey: key, mediaMime: mime, mediaSize: info.size };
}

export async function saveMemoryAction(_state: { error?: string; saved?: boolean }, form: FormData): Promise<{ error?: string; saved?: boolean }> {
  const user = await requireUser();
  const babyId = String(form.get("babyId") ?? "");
  const uploadedKey = String(form.get("mediaKey") ?? "");
  // A direct upload belongs to this baby only (its key carries the baby's prefix).
  const ownedKey = uploadedKey && isMemoryMediaKey(uploadedKey, babyId) && objectStorageConfigured() ? uploadedKey : "";
  if (!await ownedBaby(user.id, babyId)) return { error: "Không tìm thấy hồ sơ bé." };
  const result = await saveOwnedMemory(user.timezone, babyId, form, uploadedKey, ownedKey);
  // Never delete a file another letter already uses (e.g. a replayed form).
  if (result.error && ownedKey && !await db.babyMemory.findFirst({ where: { mediaKey: ownedKey }, select: { id: true } })) await discardUpload(ownedKey);
  return result;
}

async function saveOwnedMemory(timeZone: string, babyId: string, form: FormData, uploadedKey: string, ownedKey: string): Promise<{ error?: string; saved?: boolean }> {
  const title = String(form.get("title") ?? "").trim();
  const letter = String(form.get("letter") ?? "").trim();
  const frame = String(form.get("frame") ?? "");
  const milestoneKey = String(form.get("milestoneKey") ?? "") || null;
  if (milestoneKey && !MILESTONES.some(m => m.key === milestoneKey)) return { error: "Mốc phát triển không hợp lệ." };
  // Some mobile pickers submit seconds ("…T08:00:00"); the memory keeps minute precision.
  const local = String(form.get("occurredAt") ?? "").trim().replace(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(?::\d{2}(?:\.\d{1,3})?)?$/, "$1");
  if (!title || title.length > 120 || letter.length > 6000 || !MEMORY_FRAMES.some(f => f.key === frame)) return { error: "Hãy nhập tên kỷ niệm (tối đa 120 ký tự), thư tối đa 6.000 ký tự và chọn khung tem." };
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local)) return { error: "Ngày kỷ niệm không hợp lệ." };
  const occurredAt = zonedDateTimeToUtc(local, timeZone);
  // A few minutes of grace: the phone's clock may run slightly ahead of the server's.
  if (!Number.isFinite(occurredAt.getTime()) || toDateTimeLocal(occurredAt, timeZone) !== local || occurredAt.getTime() > Date.now() + FUTURE_GRACE_MS) return { error: "Hãy chọn ngày có thật và không ở tương lai." };
  let mediaData: Uint8Array<ArrayBuffer> | null = null;
  let mediaMime: string | null = null;
  let stored: StoredMedia | null = null;
  const file = form.get("media");
  if (uploadedKey) {
    if (!ownedKey) return { error: MEMORY_UPLOAD_FAILED };
    try {
      const verified = await verifyUploadedMedia(ownedKey);
      if ("error" in verified) return verified;
      stored = verified;
    } catch (error) {
      console.error("saveMemoryAction: could not verify upload", error);
      return { error: MEMORY_UPLOAD_FAILED };
    }
  } else if (file instanceof File && file.size) {
    if (file.size > MAX_MEMORY_MEDIA) return { error: MEMORY_MEDIA_TOO_LARGE };
    mediaMime = file.type.split(";")[0].trim().toLowerCase();
    const untyped = !mediaMime || mediaMime === "application/octet-stream";
    if (!untyped && !isMemoryMediaType(mediaMime)) return { error: MEMORY_MEDIA_UNSUPPORTED };
    mediaData = new Uint8Array(await file.arrayBuffer());
    if (untyped) mediaMime = sniffMemoryMediaType(mediaData);
    if (!mediaMime || !validMemoryMedia(mediaData, mediaMime)) return { error: MEMORY_MEDIA_UNSUPPORTED };
  }
  if (!stored && !mediaData && !letter) return { error: "Thêm ảnh/video hoặc viết một lời nhắn cho con nhé." };
  try {
    await db.babyMemory.create({ data: { babyId, title, letter, frame, milestoneKey, occurredAt, mediaData, mediaMime, ...stored } });
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
  const where = { id: String(form.get("id") ?? ""), baby: { userId: user.id } };
  const memory = await db.babyMemory.findFirst({ where, select: { mediaKey: true } });
  await db.babyMemory.deleteMany({ where });
  // The row is gone first, so a failed object delete only leaves an unreachable file behind.
  if (memory?.mediaKey) await discardUpload(memory.mediaKey);
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
