import { NextResponse } from "next/server";
import { getAIProvider, type HealthRecordType } from "@/features/ai/provider";
import { getCurrentUser } from "@/lib/auth";
import {
  declaredBodyTooLarge,
  hasExpectedSignature,
  isImageMimeType,
  MAX_UPLOAD_BYTES,
  MULTIPART_OVERHEAD_BYTES,
} from "@/lib/upload";

// Vercel rejects request bodies above 4.5 MB, so keep OCR uploads on the shared 4 MB ceiling.
const MAX_BYTES = MAX_UPLOAD_BYTES;
const RECORD_TYPES = new Set(["vaccination", "prescription", "pregnancyCheckup"]);
const TOO_LARGE = { error: "IMAGE_TOO_LARGE", message: "Ảnh tối đa 4 MB. Hãy chụp lại hoặc chọn ảnh nhỏ hơn." };

export async function POST(request: Request) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  // Refuse oversized bodies before buffering them with formData().
  if (declaredBodyTooLarge(request.headers, MAX_BYTES + MULTIPART_OVERHEAD_BYTES)) {
    return NextResponse.json(TOO_LARGE, { status: 413 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const image = formData.get("image");
  const recordType = formData.get("recordType");
  if (!(image instanceof File) || typeof recordType !== "string" || !RECORD_TYPES.has(recordType)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (image.size > MAX_BYTES) {
    return NextResponse.json(TOO_LARGE, { status: 413 });
  }
  const mimeType = image.type.split(";")[0].trim().toLowerCase();
  const buffer = Buffer.from(await image.arrayBuffer());
  // Do not trust the browser-supplied MIME type: the bytes must match it.
  if (!isImageMimeType(mimeType) || !hasExpectedSignature(buffer, mimeType)) {
    return NextResponse.json({ error: "Unsupported image" }, { status: 400 });
  }

  try {
    const imageDataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
    const extracted = await getAIProvider().extractFromImage({
      imageDataUrl,
      recordType: recordType as HealthRecordType,
    });
    return NextResponse.json(extracted);
  } catch (error: unknown) {
    console.error(
      "OCR extraction failed:",
      error instanceof Error ? `${error.name}: ${error.message}` : "Unknown error",
    );
    return NextResponse.json({ error: "OCR_UNAVAILABLE" }, { status: 422 });
  }
}
