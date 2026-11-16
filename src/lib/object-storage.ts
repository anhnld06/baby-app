import "server-only";

import { AwsClient, AwsV4Signer } from "aws4fetch";

// Neon Object Storage through its S3-compatible API (path-style URLs only: <endpoint>/<bucket>/<key>).
// Configure OBJECT_STORAGE_ENDPOINT (the branch's S3 endpoint, e.g.
// https://br-xxx.storage.c-2.ap-southeast-1.aws.neon.tech), OBJECT_STORAGE_REGION (e.g. ap-southeast-1),
// OBJECT_STORAGE_BUCKET, OBJECT_STORAGE_ACCESS_KEY_ID and OBJECT_STORAGE_SECRET_ACCESS_KEY.
// (Not the AWS_* names: Vercel reserves those.)

type StorageConfig = { endpoint: string; region: string; bucket: string; accessKeyId: string; secretAccessKey: string };

/** Presigned upload links stay valid for 10 minutes: enough for a 50 MB video on a slow network. */
export const UPLOAD_EXPIRES_SECONDS = 600;
/** Download links are signed for a fixed 3-hour window and stay valid for 6 hours, so the same
 *  URL is reused for a while (the browser can cache it) and a link is always good for ≥ 3 hours. */
const DOWNLOAD_WINDOW_SECONDS = 3 * 3600;

export function objectStorageConfig(): StorageConfig | null {
  const endpoint = (process.env.OBJECT_STORAGE_ENDPOINT?.trim() ?? "").replace(/\/+$/, "");
  const region = process.env.OBJECT_STORAGE_REGION?.trim();
  const bucket = process.env.OBJECT_STORAGE_BUCKET?.trim();
  const accessKeyId = process.env.OBJECT_STORAGE_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.OBJECT_STORAGE_SECRET_ACCESS_KEY?.trim();
  if (!endpoint || !region || !bucket || !accessKeyId || !secretAccessKey) return null;
  return { endpoint, region, bucket, accessKeyId, secretAccessKey };
}

export function objectStorageConfigured() {
  return objectStorageConfig() !== null;
}

function requireConfig() {
  const config = objectStorageConfig();
  if (!config) throw new Error("Object storage is not configured");
  return config;
}

function objectUrl(config: StorageConfig, key: string) {
  const path = key.split("/").map(encodeURIComponent).join("/");
  return `${config.endpoint}/${encodeURIComponent(config.bucket)}/${path}`;
}

function client(config: StorageConfig) {
  return new AwsClient({ accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey, service: "s3", region: config.region, retries: 2 });
}

function amzDate(date: Date) {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, "");
}

async function presign(config: StorageConfig, key: string, method: "GET" | "PUT", expires: number, headers: Record<string, string> = {}, datetime?: string) {
  const url = new URL(objectUrl(config, key));
  url.searchParams.set("X-Amz-Expires", String(expires));
  const signer = new AwsV4Signer({
    method, url: url.toString(), headers,
    accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey,
    service: "s3", region: config.region, signQuery: true,
    // Sign Content-Type and Content-Length too, so the upload must be exactly the file we approved.
    allHeaders: true, datetime,
  });
  const signed = await signer.sign();
  return signed.url.toString();
}

/** A one-time upload link for exactly this type and size. The browser must send both headers unchanged. */
export async function presignUpload(key: string, mime: string, size: number) {
  const config = requireConfig();
  const headers = { "content-type": mime, "content-length": String(size) };
  const url = await presign(config, key, "PUT", UPLOAD_EXPIRES_SECONDS, headers);
  return { url, headers: { "Content-Type": mime } };
}

/** A short-lived private download link (supports Range requests for video seeking). */
export async function presignDownload(key: string, now = new Date()) {
  const config = requireConfig();
  const windowStart = Math.floor(now.getTime() / 1000 / DOWNLOAD_WINDOW_SECONDS) * DOWNLOAD_WINDOW_SECONDS;
  return presign(config, key, "GET", DOWNLOAD_WINDOW_SECONDS * 2, {}, amzDate(new Date(windowStart * 1000)));
}

export type StoredObjectInfo = { size: number; contentType: string | null };

export async function headObject(key: string): Promise<StoredObjectInfo | null> {
  const config = requireConfig();
  const response = await client(config).fetch(objectUrl(config, key), { method: "HEAD" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Object storage HEAD failed: ${response.status}`);
  const size = Number(response.headers.get("content-length"));
  if (!Number.isSafeInteger(size) || size < 0) throw new Error("Object storage HEAD returned no size");
  return { size, contentType: response.headers.get("content-type") };
}

/** The first `length` bytes of an object, to check its file signature without downloading it. */
export async function readObjectStart(key: string, length: number) {
  const config = requireConfig();
  const response = await client(config).fetch(objectUrl(config, key), { headers: { range: `bytes=0-${length - 1}` } });
  if (!response.ok) throw new Error(`Object storage GET failed: ${response.status}`);
  return new Uint8Array(await response.arrayBuffer()).slice(0, length);
}

export async function deleteObject(key: string) {
  const config = requireConfig();
  const response = await client(config).fetch(objectUrl(config, key), { method: "DELETE" });
  if (!response.ok && response.status !== 404) throw new Error(`Object storage DELETE failed: ${response.status}`);
}
