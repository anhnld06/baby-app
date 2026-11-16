// Allows browsers on the app's origins to upload memory media straight to the bucket (presigned PUT).
// Run once after creating the bucket, and again when the app gets a new domain:
//
//   node --env-file=.env scripts/object-storage-cors.mjs https://your-app.vercel.app http://localhost:3000
//   node --env-file=.env scripts/object-storage-cors.mjs --show
import { createHash } from "node:crypto";
import { AwsClient } from "aws4fetch";

const endpoint = (process.env.OBJECT_STORAGE_ENDPOINT?.trim() ?? "").replace(/\/+$/, "");
const region = process.env.OBJECT_STORAGE_REGION?.trim();
const bucket = process.env.OBJECT_STORAGE_BUCKET?.trim();
const accessKeyId = process.env.OBJECT_STORAGE_ACCESS_KEY_ID?.trim();
const secretAccessKey = process.env.OBJECT_STORAGE_SECRET_ACCESS_KEY?.trim();
if (!endpoint || !region || !bucket || !accessKeyId || !secretAccessKey) {
  console.error("Thiếu cấu hình OBJECT_STORAGE_ENDPOINT, OBJECT_STORAGE_REGION, OBJECT_STORAGE_BUCKET, OBJECT_STORAGE_ACCESS_KEY_ID, OBJECT_STORAGE_SECRET_ACCESS_KEY.");
  process.exit(1);
}

const client = new AwsClient({ accessKeyId, secretAccessKey, service: "s3", region, retries: 2 });
const url = `${endpoint}/${encodeURIComponent(bucket)}?cors`;
const args = process.argv.slice(2);

if (args.includes("--show")) {
  const response = await client.fetch(url);
  console.log(response.status, await response.text());
  process.exit(response.ok ? 0 : 1);
}

const origins = [];
for (const value of args) {
  let origin = "";
  try { origin = new URL(value).origin; } catch { /* reported below */ }
  if (!origin || origin !== value.replace(/\/+$/, "")) {
    console.error(`Chỉ nhập origin dạng https://ten-mien (không có đường dẫn): ${value}`);
    process.exit(1);
  }
  origins.push(origin);
}
if (!origins.length) {
  console.error("Hãy truyền ít nhất một origin, ví dụ: https://your-app.vercel.app http://localhost:3000");
  process.exit(1);
}

const xml = `<?xml version="1.0" encoding="UTF-8"?><CORSConfiguration><CORSRule>${origins.map(origin => `<AllowedOrigin>${origin}</AllowedOrigin>`).join("")}<AllowedMethod>PUT</AllowedMethod><AllowedMethod>GET</AllowedMethod><AllowedMethod>HEAD</AllowedMethod><AllowedHeader>content-type</AllowedHeader><MaxAgeSeconds>3600</MaxAgeSeconds></CORSRule></CORSConfiguration>`;
const response = await client.fetch(url, {
  method: "PUT",
  body: xml,
  // S3 requires an integrity header on PutBucketCors.
  headers: { "content-type": "application/xml", "content-md5": createHash("md5").update(xml).digest("base64") },
});
console.log(response.ok ? `Đã cho phép tải lên từ: ${origins.join(", ")}` : `Lỗi ${response.status}: ${await response.text()}`);
process.exit(response.ok ? 0 : 1);
