"use client";

import { useState } from "react";
import { Check, Clipboard, NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CareHandover({ summary }: { summary: string }) {
  const [copiedSummary, setCopiedSummary] = useState("");
  const copied = copiedSummary === summary;
  const [error, setError] = useState(false);
  return (
    <details data-handover className="group mt-6 rounded-3xl border border-border/60 bg-card p-4 shadow-sm sm:p-5">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary"><NotebookPen className="size-5" /></span>
        <span className="flex-1"><strong className="block text-sm font-semibold">Bàn giao chăm bé</strong><span className="mt-0.5 block text-xs text-muted-foreground">Tóm tắt hôm nay để người chăm tiếp theo nắm rõ</span></span>
        <span className="text-xl text-muted-foreground group-open:rotate-45" aria-hidden="true">+</span>
      </summary>
      <div className="mt-4 border-t border-border/60 pt-4">
        <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{summary}</p>
        <Button variant="secondary" className="mt-4 h-11 rounded-xl" onClick={async () => {
          try {
            await navigator.clipboard.writeText(summary);
            setCopiedSummary(summary);
            setError(false);
          } catch {
            setCopiedSummary("");
            setError(true);
          }
        }}>{copied ? <Check className="size-4" /> : <Clipboard className="size-4" />}{copied ? "Đã sao chép" : "Sao chép tóm tắt"}</Button>
        <p role="status" className="mt-2 text-xs text-muted-foreground">{error ? "Chưa sao chép được. Bạn có thể chọn và sao chép phần văn bản phía trên." : copied ? "Bạn có thể dán tóm tắt vào nơi muốn chia sẻ." : "Chỉ sao chép khi bạn chọn. Ứng dụng không tự gửi thông tin."}</p>
      </div>
    </details>
  );
}
