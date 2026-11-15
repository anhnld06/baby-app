"use client";

import { LoaderCircle, MonitorSmartphone } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { clearOfflineData } from "@/lib/offline-db";

export function LogoutAllDevicesButton({ action }: { action: () => Promise<void> }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="destructive"
      className="h-11 w-full rounded-xl"
      disabled={pending}
      onClick={() => {
        if (
          !window.confirm(
            "Đăng xuất khỏi tất cả thiết bị? Cả hai điện thoại (và mọi trình duyệt đã đăng nhập) sẽ phải đăng nhập lại.",
          )
        ) {
          return;
        }
        startTransition(async () => {
          await clearOfflineData().catch(() => undefined);
          await action();
        });
      }}
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : <MonitorSmartphone className="size-4" />}
      Đăng xuất mọi thiết bị
    </Button>
  );
}
