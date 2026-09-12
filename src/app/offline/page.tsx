import Link from "next/link";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6 text-center">
      <div className="max-w-sm">
        <WifiOff className="mx-auto size-10 text-primary" />
        <h1 className="mt-4 text-2xl font-semibold">Thiết bị đang mất mạng</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Bạn vẫn có thể ghi nhanh bú, ngủ và tã nếu đã bật lưu ngoại tuyến trong Hồ sơ.
        </p>
        <Link href="/" className="mt-5 inline-flex min-h-12 items-center rounded-2xl bg-primary px-5 font-medium text-primary-foreground">
          Thử tải lại
        </Link>
      </div>
    </main>
  );
}
