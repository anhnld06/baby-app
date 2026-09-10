"use client";

import { CheckCircle2, Loader2, ScanLine } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { LocalOcrError, scanHealthDocument } from "@/features/ocr/client";
import type { HealthDocumentType } from "@/features/ocr/parse";

export function OcrScanField({
  recordType,
  locale,
  scanLabel,
  scanningLabel,
  unavailableLabel,
  onExtract,
}: {
  recordType: HealthDocumentType;
  locale: "vi" | "en";
  scanLabel: string;
  scanningLabel: string;
  unavailableLabel: string;
  onExtract: (data: Record<string, unknown>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [recognizedText, setRecognizedText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const copy = locale === "vi"
    ? {
        success: "Đã đọc ảnh và tự điền các trường nhận diện được. Vui lòng kiểm tra lại.",
        extractedText: "Văn bản đã nhận diện",
        privateProcessing: "Ảnh được xử lý trên thiết bị và không gửi tới dịch vụ AI.",
        tooLarge: "Ảnh lớn hơn 25 MB. Vui lòng chọn ảnh nhỏ hơn.",
        unsupported: "Trình duyệt không đọc được định dạng ảnh này. Hãy dùng JPEG, PNG hoặc WebP.",
        noText: "Không tìm thấy chữ đủ rõ. Hãy chụp thẳng trang giấy và tránh phản sáng.",
      }
    : {
        success: "The image was read and recognized fields were filled in. Please review them.",
        extractedText: "Recognized text",
        privateProcessing: "The image is processed on this device and is not sent to an AI service.",
        tooLarge: "The image is larger than 25 MB. Choose a smaller image.",
        unsupported: "This image format cannot be read. Use JPEG, PNG, or WebP.",
        noText: "No clear text was found. Photograph the page straight on and avoid glare.",
      };

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setStatus("scanning");
    setProgress(0);
    setRecognizedText("");
    setErrorMessage("");
    try {
      const result = await scanHealthDocument(file, recordType, setProgress);
      onExtract(result.fields);
      setRecognizedText(result.text);
      setStatus("success");
    } catch (error) {
      setErrorMessage(
        error instanceof LocalOcrError && error.code === "too-large"
          ? copy.tooLarge
          : error instanceof LocalOcrError && error.code === "unsupported"
            ? copy.unsupported
            : error instanceof LocalOcrError && error.code === "no-text"
              ? copy.noText
              : unavailableLabel,
      );
      setStatus("error");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />
      <Button
        type="button"
        variant="outline"
        className="h-12 w-full rounded-xl"
        disabled={status === "scanning"}
        onClick={() => inputRef.current?.click()}
      >
        {status === "scanning" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : status === "success" ? (
          <CheckCircle2 className="size-4" />
        ) : (
          <ScanLine className="size-4" />
        )}
        {status === "scanning" ? `${scanningLabel} ${Math.round(progress * 100)}%` : scanLabel}
      </Button>
      {status === "scanning" && (
        <div
          className="h-1.5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${Math.max(3, progress * 100)}%` }}
          />
        </div>
      )}
      {status === "error" && (
        <p className="px-1 text-xs text-destructive" role="alert">{errorMessage}</p>
      )}
      {status === "success" && (
        <div className="space-y-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
          <p role="status">{copy.success}</p>
          <details>
            <summary className="cursor-pointer font-medium">{copy.extractedText}</summary>
            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-background/70 p-2 font-sans text-[11px] leading-5 text-foreground">
              {recognizedText}
            </pre>
          </details>
        </div>
      )}
      <p className="px-1 text-[11px] leading-4 text-muted-foreground">{copy.privateProcessing}</p>
    </div>
  );
}
