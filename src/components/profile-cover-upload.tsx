"use client";

import { Camera, ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const MAX_SOURCE_BYTES = 20 * 1024 * 1024;
const MAX_OUTPUT_BYTES = 450 * 1024;

type DrawableImage = ImageBitmap | HTMLImageElement;

async function decodeImage(file: File): Promise<DrawableImage> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      // Safari can decode some camera formats through an image element only.
    }
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Không đọc được ảnh này."));
      image.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function imageSize(image: DrawableImage) {
  return "naturalWidth" in image
    ? { width: image.naturalWidth, height: image.naturalHeight }
    : { width: image.width, height: image.height };
}

function canvasBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error("Không thể xử lý ảnh.")),
      "image/jpeg",
      quality,
    );
  });
}

function blobDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Không thể đọc ảnh đã xử lý."));
    reader.readAsDataURL(blob);
  });
}

async function compressProfileCover(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Vui lòng chọn một file ảnh.");
  if (file.size > MAX_SOURCE_BYTES) throw new Error("Ảnh gốc không được lớn hơn 20 MB.");

  const image = await decodeImage(file);
  try {
    const source = imageSize(image);
    for (const maxEdge of [1280, 1080, 900, 720]) {
      const scale = Math.min(1, maxEdge / Math.max(source.width, source.height));
      const width = Math.max(1, Math.round(source.width * scale));
      const height = Math.max(1, Math.round(source.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Trình duyệt không hỗ trợ xử lý ảnh.");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);

      for (const quality of [0.82, 0.72, 0.62, 0.52]) {
        const blob = await canvasBlob(canvas, quality);
        if (blob.size <= MAX_OUTPUT_BYTES) return blobDataUrl(blob);
      }
    }
    throw new Error("Không thể nén ảnh đủ nhỏ. Vui lòng chọn ảnh khác.");
  } finally {
    if ("close" in image) image.close();
  }
}

export function ProfileCoverUpload({ currentImageUrl }: { currentImageUrl?: string }) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(currentImageUrl);
  const [imageData, setImageData] = useState("");
  const [action, setAction] = useState<"keep" | "replace" | "remove">("keep");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function selectImage(file?: File) {
    if (!file) return;
    setProcessing(true);
    setError("");
    try {
      const dataUrl = await compressProfileCover(file);
      setPreview(dataUrl);
      setImageData(dataUrl);
      setAction("replace");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể xử lý ảnh.");
    } finally {
      setProcessing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage() {
    setPreview(undefined);
    setImageData("");
    setAction("remove");
    setError("");
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium">Ảnh nền hồ sơ</legend>
      <input type="hidden" name="coverImageAction" value={action} />
      {action === "replace" && <input type="hidden" name="coverImageData" value={imageData} />}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => void selectImage(event.target.files?.[0])}
      />

      <div
        className="relative aspect-[16/7] overflow-hidden rounded-2xl border border-border/70 bg-muted bg-cover bg-center"
        style={preview ? { backgroundImage: `url(${JSON.stringify(preview)})` } : undefined}
      >
        {!preview && (
          <div className="grid size-full place-items-center text-muted-foreground">
            <div className="text-center">
              <Camera className="mx-auto size-7" />
              <p className="mt-2 text-xs">Chưa có ảnh nền</p>
            </div>
          </div>
        )}
        {processing && (
          <div className="absolute inset-0 grid place-items-center bg-background/70">
            <LoaderCircle className="size-7 animate-spin text-primary" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          className="h-10 rounded-xl"
          disabled={processing}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="size-4" />
          {preview ? "Đổi ảnh" : "Chọn ảnh"}
        </Button>
        {preview && (
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl text-destructive"
            disabled={processing}
            onClick={removeImage}
          >
            <Trash2 className="size-4" />
            Xóa ảnh
          </Button>
        )}
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        Ảnh được tự động thu nhỏ và nén trước khi tải lên. Hỗ trợ ảnh tối đa 20 MB.
      </p>
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
    </fieldset>
  );
}
