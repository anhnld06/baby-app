import { Buffer } from "node:buffer";

const MAX_PROFILE_COVER_BYTES = 500 * 1024;
const DATA_URL_PATTERN = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/;

export type ProfileCoverUpdate =
  | { data: Uint8Array; mimeType: "image/jpeg" | "image/png" | "image/webp" }
  | null
  | undefined;

function hasExpectedSignature(data: Uint8Array, mimeType: string) {
  if (mimeType === "image/jpeg") {
    return data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
  }
  if (mimeType === "image/png") {
    return data.length >= 8
      && data[0] === 0x89
      && data[1] === 0x50
      && data[2] === 0x4e
      && data[3] === 0x47
      && data[4] === 0x0d
      && data[5] === 0x0a
      && data[6] === 0x1a
      && data[7] === 0x0a;
  }
  return data.length >= 12
    && String.fromCharCode(...data.slice(0, 4)) === "RIFF"
    && String.fromCharCode(...data.slice(8, 12)) === "WEBP";
}

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
