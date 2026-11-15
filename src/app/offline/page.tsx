import { WifiOff } from "lucide-react";
import { RetryButton } from "./retry-button";

export default function OfflinePage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6 text-center">
      <div className="max-w-sm">
        <WifiOff className="mx-auto size-10 text-primary" />
        <h1 className="mt-4 text-2xl font-semibold">Thiết bị đang mất mạng</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Trang này cần có mạng để mở. Khi mất mạng, ứng dụng không mở được trang mới.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Nếu đã bật “Ghi nhanh khi mất mạng” trong Hồ sơ, bạn chỉ ghi được bú, ngủ và tã trên
          trang đã mở sẵn trước khi mất mạng. Bản ghi được lưu tạm trên thiết bị và tự đồng bộ khi
          có mạng lại.
        </p>
        <RetryButton />
      </div>
    </main>
  );
}
