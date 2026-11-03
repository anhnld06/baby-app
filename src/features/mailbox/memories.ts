export const MEMORY_FRAMES = [
  { key: "blossom", name: "Hoa yêu thương", emoji: "🌷", className: "bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-100" },
  { key: "sunshine", name: "Nắng đầu đời", emoji: "☀️", className: "bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-100" },
  { key: "cloud", name: "Mây êm đềm", emoji: "☁️", className: "bg-sky-100 text-sky-950 dark:bg-sky-950 dark:text-sky-100" },
  { key: "garden", name: "Mầm nhỏ lớn lên", emoji: "🌱", className: "bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100" },
] as const;
export const MAX_MEMORY_MEDIA = 10 * 1024 * 1024;
export function validMemoryMedia(bytes: Uint8Array, mime: string) {
  const ascii = (start: number, end: number) => new TextDecoder().decode(bytes.slice(start, end));
  if (mime === "image/jpeg") return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (mime === "image/png") return [137,80,78,71,13,10,26,10].every((v,i) => bytes[i] === v);
  if (mime === "image/webp") return ascii(0,4) === "RIFF" && ascii(8,12) === "WEBP";
  if (mime === "video/mp4" || mime === "video/quicktime") return ascii(4,8) === "ftyp";
  if (mime === "video/webm") return [26,69,223,163].every((v,i) => bytes[i] === v);
  return false;
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
