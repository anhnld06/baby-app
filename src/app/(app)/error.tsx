"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-[60dvh] place-items-center px-4 text-center">
      <div className="max-w-sm rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" />
        </span>
        <h1 className="mt-4 text-xl font-semibold">Chưa thể mở nội dung này</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Dữ liệu của bạn vẫn được giữ nguyên. Hãy thử tải lại; nếu lỗi tiếp tục xảy ra, quay về trang trước.
        </p>
        <Button type="button" onClick={retry} className="mt-5 h-11 rounded-xl">
          <RotateCcw className="size-4" />
          Thử lại
        </Button>
      </div>
    </div>
  );
}
