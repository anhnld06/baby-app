import { hasExpectedSignature, IMAGE_MIME_TYPES, MAX_UPLOAD_BYTES, VIDEO_MIME_TYPES } from "@/lib/upload";

export const MEMORY_FRAMES = [
  { key: "blossom", name: "Hoa yêu thương", emoji: "🌷", className: "bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-100" },
  { key: "sunshine", name: "Nắng đầu đời", emoji: "☀️", className: "bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-100" },
  { key: "cloud", name: "Mây êm đềm", emoji: "☁️", className: "bg-sky-100 text-sky-950 dark:bg-sky-950 dark:text-sky-100" },
  { key: "garden", name: "Mầm nhỏ lớn lên", emoji: "🌱", className: "bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100" },
] as const;
/**
 * Without object storage, media travels inside the Server Action body and is capped at 4 MB.
 * Older memories stored before this limit (up to 10 MB) are still served by /api/memories/[id].
 */
export const MAX_MEMORY_MEDIA = MAX_UPLOAD_BYTES;
export const MEMORY_MEDIA_TOO_LARGE = "Tệp tối đa 4 MB. Hãy chọn ảnh nhỏ hơn hoặc video ngắn hơn.";

/**
 * With object storage (Neon Object Storage) the device uploads straight to the bucket, bypassing the
 * 4.5 MB request limit of Vercel functions. Photos are still shrunk on the device first.
 */
export const MAX_MEMORY_DIRECT_IMAGE = 10_000_000;
export const MAX_MEMORY_DIRECT_VIDEO = 50_000_000;
export const MEMORY_DIRECT_VIDEO_TOO_LARGE = "Video tối đa 50 MB (khoảng 20–30 giây). Hãy cắt ngắn video rồi chọn lại nhé.";
export const MEMORY_UPLOAD_FAILED = "Chưa tải được ảnh/video lên. Hãy kiểm tra kết nối mạng rồi thử lại nhé.";

/** Largest file allowed for this kind of media, depending on whether direct upload is available. */
export function memoryMediaLimit(kind: "image" | "video", direct: boolean) {
  if (!direct) return MAX_MEMORY_MEDIA;
  return kind === "video" ? MAX_MEMORY_DIRECT_VIDEO : MAX_MEMORY_DIRECT_IMAGE;
}

const MEDIA_EXTENSIONS: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "video/mp4": "mp4", "video/quicktime": "mov", "video/webm": "webm" };
/** File extension used in object keys, so a downloaded file opens with the right app. */
export function memoryMediaExtension(mime: string) {
  return MEDIA_EXTENSIONS[mime] ?? "bin";
}
/** Keys are always `memories/<babyId>/<random>.<ext>`; the prefix ties an upload to one baby. */
export function memoryMediaKeyPrefix(babyId: string) {
  return `memories/${babyId}/`;
}
export function isMemoryMediaKey(key: string, babyId: string) {
  const prefix = memoryMediaKeyPrefix(babyId);
  return key.startsWith(prefix) && /^[A-Za-z0-9_-]{16,64}\.(jpg|png|webp|mp4|mov|webm)$/.test(key.slice(prefix.length));
}
export const MEMORY_MEDIA_TYPES: readonly string[] = [...IMAGE_MIME_TYPES, ...VIDEO_MIME_TYPES];
export function isMemoryMediaType(mime: string) {
  return MEMORY_MEDIA_TYPES.includes(mime);
}
export function validMemoryMedia(bytes: Uint8Array, mime: string) {
  return isMemoryMediaType(mime) && hasExpectedSignature(bytes, mime);
}

/** Photos are shrunk on the device before upload; videos cannot be, so they keep the 4 MB cap. */
export const MEMORY_VIDEO_TOO_LARGE = "Video tối đa 4 MB (khoảng vài giây). Hãy cắt ngắn video hoặc quay Boomerang.";
export const MEMORY_MEDIA_UNSUPPORTED = "Chọn ảnh JPG, PNG, WebP hoặc video MP4, MOV, WebM hợp lệ.";
export const MEMORY_SAVE_FAILED = "Chưa lưu được thư. Hãy kiểm tra kết nối mạng hoặc tải lại trang rồi thử lại nhé.";

const VIDEO_EXTENSIONS: Record<string, string> = { mp4: "video/mp4", m4v: "video/mp4", mov: "video/quicktime", qt: "video/quicktime", webm: "video/webm" };

/**
 * "image" or "video" for a picked file, or null when it cannot be a memory. Some phones send an
 * empty or generic type, so the file extension is used as a fallback.
 */
export function memoryMediaKind(file: { type: string; name?: string }): "image" | "video" | null {
  const type = file.type.split(";")[0].trim().toLowerCase();
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  const extension = /\.([a-z0-9]+)$/i.exec(file.name ?? "")?.[1]?.toLowerCase() ?? "";
  if (/^(jpe?g|png|webp|gif|bmp|hei[cf]|avif)$/.test(extension)) return "image";
  if (extension in VIDEO_EXTENSIONS) return "video";
  return null;
}

/** The declared MIME type for a video, inferred from its extension when the browser gave none. */
export function memoryVideoType(file: { type: string; name?: string }) {
  const type = file.type.split(";")[0].trim().toLowerCase();
  if (type && type !== "application/octet-stream") return type;
  const extension = /\.([a-z0-9]+)$/i.exec(file.name ?? "")?.[1]?.toLowerCase() ?? "";
  return VIDEO_EXTENSIONS[extension] ?? type;
}

/** Detects the media type from magic bytes, for uploads that arrive without a usable type. */
export function sniffMemoryMediaType(bytes: Uint8Array): string | null {
  for (const mime of ["image/jpeg", "image/png", "image/webp", "video/webm"]) if (hasExpectedSignature(bytes, mime)) return mime;
  if (hasExpectedSignature(bytes, "video/mp4")) return String.fromCharCode(...bytes.subarray(8, 12)) === "qt  " ? "video/quicktime" : "video/mp4";
  return null;
}
export function memoryMonth(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en", { timeZone, year: "numeric", month: "2-digit" }).formatToParts(date);
  return `${parts.find(p => p.type === "year")!.value}-${parts.find(p => p.type === "month")!.value}`;
}

/** Birth is a date-only value; compare anniversaries against the family's local day. */
export function memoryAge(birth: string, localDay: string) {
  const start = new Date(`${birth.slice(0, 10)}T00:00:00Z`);
  const day = new Date(`${localDay.slice(0, 10)}T00:00:00Z`);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(day.getTime())) return { month: 0, label: "Kỷ niệm của con", range: "" };
  const anniversary = (months: number) => {
    const date = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + months, 1));
    const last = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
    date.setUTCDate(Math.min(start.getUTCDate(), last));
    return date;
  };
  if (day < start) return { month: -1, label: "Trước ngày chào đời", range: "Những ngày chờ con" };
  let month = (day.getUTCFullYear() - start.getUTCFullYear()) * 12 + day.getUTCMonth() - start.getUTCMonth();
  if (day < anniversary(month)) month--;
  const from = anniversary(month);
  const until = new Date(anniversary(month + 1).getTime() - 86400000);
  const days = Math.floor((day.getTime() - from.getTime()) / 86400000);
  const format = (date: Date) => `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`;
  return { month, label: month ? `${month} tháng${days ? ` ${days} ngày` : ""}` : `${days} ngày tuổi`, range: `${format(from)} – ${format(until)}` };
}
