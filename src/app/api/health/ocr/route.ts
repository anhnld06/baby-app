import { NextResponse } from "next/server";
import { getAIProvider, type HealthRecordType } from "@/features/ai/provider";
import { getCurrentUser } from "@/lib/auth";

const MAX_BYTES = 5_000_000;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const RECORD_TYPES = new Set(["vaccination", "prescription", "pregnancyCheckup"]);

export async function POST(request: Request) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const image = formData.get("image");
    const recordType = formData.get("recordType");
    if (!(image instanceof File) || typeof recordType !== "string" || !RECORD_TYPES.has(recordType)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    if (image.size > MAX_BYTES || !ALLOWED_TYPES.has(image.type)) {
      return NextResponse.json({ error: "Unsupported image" }, { status: 400 });
    }
    const buffer = Buffer.from(await image.arrayBuffer());
    const imageDataUrl = `data:${image.type};base64,${buffer.toString("base64")}`;
    const extracted = await getAIProvider().extractFromImage({
      imageDataUrl,
      recordType: recordType as HealthRecordType,
      locale: formData.get("locale") === "en" ? "en" : "vi",
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
