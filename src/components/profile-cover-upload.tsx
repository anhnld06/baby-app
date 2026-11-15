"use client";

import { Camera, ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { compressImageFile } from "@/lib/image-compress";

const MAX_SOURCE_BYTES = 20 * 1024 * 1024;
const MAX_OUTPUT_BYTES = 450 * 1024;

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
  // Always re-encode to JPEG: the server only accepts covers up to 500 KB.
  const compressed = await compressImageFile(file, {
    maxEdge: 1280,
    maxBytes: MAX_OUTPUT_BYTES,
    alwaysReencode: true,
    maxSourceBytes: MAX_SOURCE_BYTES,
  });
  return blobDataUrl(compressed);
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
