import { Buffer } from "node:buffer";
import { hasExpectedSignature } from "@/lib/upload";

const MAX_PROFILE_COVER_BYTES = 500 * 1024;
const DATA_URL_PATTERN = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/;

export type ProfileCoverUpdate =
  | { data: Uint8Array; mimeType: "image/jpeg" | "image/png" | "image/webp" }
  | null
  | undefined;

export function parseProfileCoverUpdate(formData: FormData): ProfileCoverUpdate {
  const action = String(formData.get("coverImageAction") ?? "keep");
  if (action === "keep") return undefined;
  if (action === "remove") return null;
  if (action !== "replace") throw new Error("Invalid profile cover action");

  const value = formData.get("coverImageData");
  if (typeof value !== "string") throw new Error("Profile cover image is missing");
  const match = DATA_URL_PATTERN.exec(value);
  if (!match) throw new Error("Profile cover image format is invalid");

  const mimeType = match[1] as "image/jpeg" | "image/png" | "image/webp";
  const data = Buffer.from(match[2], "base64");
  if (data.length === 0 || data.length > MAX_PROFILE_COVER_BYTES) {
    throw new Error("Profile cover image must be 500 KB or smaller");
  }
  if (!hasExpectedSignature(data, mimeType)) {
    throw new Error("Profile cover image content is invalid");
  }
  return { data, mimeType };
}

export function profileCoverUrl(
  owner: "mother" | "baby",
  id: string,
  updatedAt: Date,
) {
  return `/api/profile-images/${owner}/${encodeURIComponent(id)}?v=${updatedAt.getTime()}`;
}
