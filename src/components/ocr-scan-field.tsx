"use client";

import { Loader2, ScanLine } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { HealthRecordType } from "@/features/ai/provider";

export function OcrScanField({
  recordType,
  locale,
  scanLabel,
  scanningLabel,
  unavailableLabel,
  onExtract,
}: {
  recordType: HealthRecordType;
  locale: "vi" | "en";
  scanLabel: string;
  scanningLabel: string;
  unavailableLabel: string;
  onExtract: (data: Record<string, unknown>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "scanning" | "error">("idle");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setStatus("scanning");
    try {
      const formData = new FormData();
      formData.set("image", file);
      formData.set("recordType", recordType);
      formData.set("locale", locale);
      const response = await fetch("/api/health/ocr", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("OCR_UNAVAILABLE");
      const data = (await response.json()) as Record<string, unknown>;
      onExtract(data);
      setStatus("idle");
    } catch {
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
        ) : (
          <ScanLine className="size-4" />
        )}
        {status === "scanning" ? scanningLabel : scanLabel}
      </Button>
      {status === "error" && (
        <p className="px-1 text-xs text-destructive">{unavailableLabel}</p>
      )}
    </div>
  );
}
