// Moves mailbox photos/videos stored inside Postgres (BabyMemory.mediaData) to Neon Object Storage.
//
//   node --env-file=.env scripts/migrate-memory-media-to-object-storage.mjs            # dry run: only counts
//   node --env-file=.env scripts/migrate-memory-media-to-object-storage.mjs --copy     # upload + set mediaKey (keeps DB bytes)
//   node --env-file=.env scripts/migrate-memory-media-to-object-storage.mjs --clear-db # verify stored copy, then drop DB bytes
//
// --copy never deletes anything: the app serves the stored copy as soon as mediaKey is set, and the DB
// bytes remain as a fallback. --clear-db only clears rows whose stored object exists with exactly the
// same size. Postgres reclaims the space later (autovacuum), so the Neon storage graph drops with a delay.
import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { AwsClient } from "aws4fetch";

const copy = process.argv.includes("--copy");
const clearDb = process.argv.includes("--clear-db");
const EXTENSIONS = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "video/mp4": "mp4", "video/quicktime": "mov", "video/webm": "webm" };

function config() {
  const endpoint = (process.env.OBJECT_STORAGE_ENDPOINT?.trim() ?? "").replace(/\/+$/, "");
  const region = process.env.OBJECT_STORAGE_REGION?.trim();
  const bucket = process.env.OBJECT_STORAGE_BUCKET?.trim();
  const accessKeyId = process.env.OBJECT_STORAGE_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.OBJECT_STORAGE_SECRET_ACCESS_KEY?.trim();
  if (!endpoint || !region || !bucket || !accessKeyId || !secretAccessKey) return null;
  return { endpoint, region, bucket, accessKeyId, secretAccessKey };
}

const storage = config();
const db = new PrismaClient();
const client = storage && new AwsClient({ accessKeyId: storage.accessKeyId, secretAccessKey: storage.secretAccessKey, service: "s3", region: storage.region, retries: 3 });
const objectUrl = key => `${storage.endpoint}/${encodeURIComponent(storage.bucket)}/${key.split("/").map(encodeURIComponent).join("/")}`;

async function objectSize(key) {
  const response = await client.fetch(objectUrl(key), { method: "HEAD" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`HEAD ${key}: HTTP ${response.status}`);
  return Number(response.headers.get("content-length"));
}

async function main() {
  const [counts] = await db.$queryRaw`
    SELECT count(*) FILTER (WHERE "mediaData" IS NOT NULL AND "mediaKey" IS NULL)::int AS "toCopy",
           count(*) FILTER (WHERE "mediaData" IS NOT NULL AND "mediaKey" IS NOT NULL)::int AS "toClear",
           coalesce(sum(octet_length("mediaData")), 0)::bigint AS "dbBytes"
    FROM "BabyMemory"`;
  console.log(`Chưa chép sang kho lưu trữ: ${counts.toCopy} thư · Đã chép, còn bản trong DB: ${counts.toClear} thư · Media trong DB: ${(Number(counts.dbBytes) / 1e6).toFixed(1)} MB`);
  if (!copy && !clearDb) { console.log("Chạy thử: không thay đổi gì. Thêm --copy để chép sang kho lưu trữ, --clear-db để xóa bản trong DB sau khi đã chép."); return; }
  if (!storage) throw new Error("Thiếu cấu hình OBJECT_STORAGE_ENDPOINT, OBJECT_STORAGE_REGION, OBJECT_STORAGE_BUCKET, OBJECT_STORAGE_ACCESS_KEY_ID, OBJECT_STORAGE_SECRET_ACCESS_KEY.");

  if (copy) {
    const ids = await db.$queryRaw`SELECT id FROM "BabyMemory" WHERE "mediaData" IS NOT NULL AND "mediaKey" IS NULL ORDER BY "createdAt"`;
    for (const { id } of ids) {
      // One row at a time: never hold more than one file in memory.
      const memory = await db.babyMemory.findUnique({ where: { id }, select: { babyId: true, mediaMime: true, mediaData: true, mediaKey: true } });
      if (!memory?.mediaData || memory.mediaKey) continue;
      const extension = EXTENSIONS[memory.mediaMime];
      if (!extension) { console.warn(`Bỏ qua ${id}: định dạng ${memory.mediaMime} không hỗ trợ.`); continue; }
      const key = `memories/${memory.babyId}/${randomBytes(18).toString("base64url")}.${extension}`;
      const body = new Uint8Array(memory.mediaData);
      const put = await client.fetch(objectUrl(key), { method: "PUT", body, headers: { "content-type": memory.mediaMime } });
      if (!put.ok) throw new Error(`PUT ${key}: HTTP ${put.status}`);
      if (await objectSize(key) !== body.length) throw new Error(`Kích thước trên kho lưu trữ không khớp cho ${id}; dừng lại.`);
      const updated = await db.babyMemory.updateMany({ where: { id, mediaKey: null }, data: { mediaKey: key, mediaSize: body.length } });
      console.log(`${updated.count ? "Đã chép" : "Bỏ qua (đã có key)"} ${id} → ${key} (${(body.length / 1e6).toFixed(2)} MB)`);
    }
  }

  if (clearDb) {
    const rows = await db.$queryRaw`
      SELECT id, "mediaKey" AS key, octet_length("mediaData")::int AS size
      FROM "BabyMemory" WHERE "mediaData" IS NOT NULL AND "mediaKey" IS NOT NULL ORDER BY "createdAt"`;
    for (const row of rows) {
      const size = await objectSize(row.key);
      if (size !== row.size) { console.warn(`Giữ bản DB của ${row.id}: kho lưu trữ ${size ?? "không có"} byte ≠ DB ${row.size} byte.`); continue; }
      await db.babyMemory.updateMany({ where: { id: row.id, mediaKey: row.key }, data: { mediaData: null } });
      console.log(`Đã xóa bản DB của ${row.id} (${(row.size / 1e6).toFixed(2)} MB, kho lưu trữ đã xác nhận).`);
    }
  }
}

main()
  .catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; })
  .finally(() => db.$disconnect());
